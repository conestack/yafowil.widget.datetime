import $ from 'jquery';
// Sets the global Datepicker base class, must be imported before the widget.
import 'vanillajs-datepicker';
import {
    DatepickerWidget,
    register_datepicker_array_subscribers,
} from '../src/default/datepicker.js';

QUnit.module('DatepickerWidget', (hooks) => {
    const container = $('<div id="container" />');
    let elem;
    let picker;
    let _array_subscribers = {
        on_add: [],
    };
    let css_link;

    hooks.before(async () => {
        css_link = document.createElement('link');
        css_link.rel = 'stylesheet';
        css_link.href = '../../src/yafowil/widget/datetime/resources/default/datepicker.min.css';
        document.head.appendChild(css_link);
        // Wait for required styles to load
        await new Promise((resolve) => {
            css_link.onload = resolve;
        });
        $('body').append(container);
    });
    hooks.beforeEach(() => {
        elem = $(`<input type="text" />`).addClass('datepicker');
        container.append(elem);
    });
    hooks.afterEach(() => {
        container.empty();
        container.css('position', '').css('top', 'unset');
        picker = null;
    });
    hooks.after(() => {
        // remove required css styles after test run has finished
        if (css_link) {
            document.head.removeChild(css_link);
        }
    });

    QUnit.test('register_datepicker_array_subscribers', (assert) => {
        container.empty();

        // return if window.yafowil === undefined
        register_datepicker_array_subscribers();
        assert.deepEqual(_array_subscribers.on_add, []);

        // patch yafowil_array
        window.yafowil_array = {
            on_array_event: (evt_name, evt_function) => {
                _array_subscribers[evt_name] = evt_function;
            },
            inside_template(elem) {
                return elem.parents('.arraytemplate').length > 0;
            },
        };
        register_datepicker_array_subscribers();

        // create table DOM
        const table = $('<table />').append($('<tr />')).append($('<td />')).appendTo('body');

        const el = $(`<input type="text" />`).addClass('datepicker');
        $('td', table).addClass('arraytemplate');
        el.appendTo($('td', table));

        // invoke array on_add - returns
        _array_subscribers.on_add.apply(null, $('tr', table));
        picker = el.data('yafowil-datepicker');
        assert.notOk(picker);
        $('td', table).removeClass('arraytemplate');

        // invoke array on_add
        el.attr('id', '');
        _array_subscribers.on_add.apply(null, $('tr', table));
        picker = el.data('yafowil-datepicker');
        assert.ok(picker);

        table.remove();
        window.yafowil_array = undefined;
        _array_subscribers = undefined;
    });

    QUnit.test('Constructor - no data', (assert) => {
        DatepickerWidget.initialize();

        picker = elem.data('yafowil-datepicker');
        // default options taken
        assert.strictEqual(picker._options.orientation, 'bottom');
        assert.strictEqual(picker._options.buttonClass, 'btn');
        assert.strictEqual(picker._options.todayHighlight, true);
        assert.strictEqual(picker._options.autohide, true);

        assert.deepEqual(picker.elem, elem);
        assert.deepEqual(elem.data('yafowil-datepicker'), picker);
        assert.ok(picker.trigger.is('button.datepicker-trigger.btn.btn-default'));

        assert.ok(picker.toggle_picker);
    });

    QUnit.test('Constructor - no space on bottom', (assert) => {
        container.css('position', 'absolute').css('top', 'calc(100vh - 100px)');
        DatepickerWidget.initialize();

        picker = elem.data('yafowil-datepicker');
        // default options taken
        assert.strictEqual(picker._options.orientation, 'top');
    });

    QUnit.test('initialize twice binds once', (assert) => {
        // A reload that replaces an element binds its **parent** again, so
        // every input beside it is initialized a second time. Without a guard
        // the widget attaches another trigger button on each pass, and after
        // a few sorts of a table the field is a row of buttons.
        DatepickerWidget.initialize();
        const first = elem.data('yafowil-datepicker');

        DatepickerWidget.initialize();

        assert.strictEqual(elem.data('yafowil-datepicker'), first);
        assert.strictEqual(container.find('button.datepicker-trigger').length, 1);
    });

    QUnit.test('initialize picks up a new element beside a bound one', (assert) => {
        // The guard must not turn into "already ran here, skip the context" -
        // binding the parent again is exactly how a newly added field gets
        // its widget.
        DatepickerWidget.initialize();
        const second = $('<input type="text" />').addClass('datepicker');
        container.append(second);

        DatepickerWidget.initialize();

        assert.ok(second.data('yafowil-datepicker'));
        assert.strictEqual(container.find('button.datepicker-trigger').length, 2);
        second.data('yafowil-datepicker').destroy();
    });

    QUnit.test('destroy', (assert) => {
        // patch toggle_picker to test unbind
        const original_toggle_picker = DatepickerWidget.prototype.toggle_picker;
        DatepickerWidget.prototype.toggle_picker = () => {
            assert.step('toggle_picker');
        };

        // initialize widget
        DatepickerWidget.initialize();
        picker = elem.data('yafowil-datepicker');

        // trigger bound events
        picker.trigger.trigger('mousedown');
        picker.trigger.trigger('touchstart');
        picker.trigger.trigger('click');

        assert.verifySteps(['toggle_picker', 'toggle_picker']);

        // destroy picker
        picker.destroy();

        // trigger now unbound events
        picker.trigger.trigger('mousedown');
        picker.trigger.trigger('touchstart');
        picker.trigger.trigger('click');

        // event listeners detached
        assert.verifySteps([]);

        DatepickerWidget.prototype.toggle_picker = original_toggle_picker;
    });

    QUnit.test('destroy removes the trigger and keeps the input', (assert) => {
        DatepickerWidget.initialize();
        picker = elem.data('yafowil-datepicker');

        picker.destroy();

        assert.notOk($.contains(document, picker.trigger[0]));
        assert.strictEqual(container.find('button.datepicker-trigger').length, 0);
        assert.ok($.contains(document, elem[0]));
    });

    QUnit.test('mousedown', (assert) => {
        DatepickerWidget.initialize();
        picker = elem.data('yafowil-datepicker');
        assert.strictEqual($(picker.picker.element).css('display'), 'none');

        // trigger first mousedown
        picker.trigger.trigger('mousedown');
        assert.strictEqual($(picker.picker.element).css('display'), 'block');
        // assert.ok(picker.elem.is(':focus'));

        // trigger second mousedown
        picker.trigger.trigger('mousedown');
        assert.strictEqual($(picker.picker.element).css('display'), 'none');
        // assert.notOk(picker.elem.is(':focus'));
    });

    QUnit.test('touchstart', (assert) => {
        DatepickerWidget.initialize();
        picker = elem.data('yafowil-datepicker');
        assert.strictEqual($(picker.picker.element).css('display'), 'none');

        // trigger first mousedown
        picker.trigger.trigger('touchstart');
        assert.strictEqual($(picker.picker.element).css('display'), 'block');
        // assert.ok(picker.elem.is(':focus'));

        // trigger second mousedown
        picker.trigger.trigger('touchstart');
        assert.strictEqual($(picker.picker.element).css('display'), 'none');
        // assert.notOk(picker.elem.is(':focus'));
    });

    QUnit.module('treibstoff', (hooks) => {
        let attached;
        let deprecated;

        hooks.beforeEach(() => {
            attached = [];
            deprecated = [];
            window.ts = {
                ajax: {
                    attach: (inst, el) => {
                        attached.push({ inst, el });
                    },
                },
                deprecate: (...args) => {
                    deprecated.push(args);
                },
            };
        });
        hooks.afterEach(() => {
            delete window.ts;
        });

        QUnit.test('widget is attached to ts.ajax', (assert) => {
            DatepickerWidget.initialize();
            picker = elem.data('yafowil-datepicker');
            assert.strictEqual(attached.length, 1);
            assert.strictEqual(attached[0].inst, picker);
            assert.strictEqual(attached[0].el[0], elem[0]);
            picker.destroy();
        });

        QUnit.test('unload is deprecated and destroys', (assert) => {
            DatepickerWidget.initialize();
            picker = elem.data('yafowil-datepicker');
            const destroyed = [];
            picker.destroy = () => {
                destroyed.push(true);
            };
            picker.unload();
            assert.deepEqual(deprecated, [
                [
                    'yafowil.widget.datepicker.unload',
                    'yafowil.widget.datepicker.destroy',
                    'yafowil 2.1',
                ],
            ]);
            assert.deepEqual(destroyed, [true]);
            delete picker.destroy;
            picker.destroy();
        });
    });

    QUnit.test('unload without ts destroys', (assert) => {
        DatepickerWidget.initialize();
        picker = elem.data('yafowil-datepicker');
        const destroyed = [];
        picker.destroy = () => {
            destroyed.push(true);
        };
        picker.unload();
        assert.deepEqual(destroyed, [true]);
        delete picker.destroy;
        picker.destroy();
    });

    QUnit.test('on date change', (assert) => {
        DatepickerWidget.initialize();
        picker = elem.data('yafowil-datepicker');
        picker.elem.on('change', () => {
            assert.step('datepicker_change_event');
        });

        picker.trigger.trigger('mousedown');
        $('span.datepicker-cell.day:first-of-type').trigger('click');
        assert.verifySteps(['datepicker_change_event']);

        picker.picker.datepicker.setDate('03.09.2023');
        assert.verifySteps(['datepicker_change_event']);
    });
});
