import $ from 'jquery';
// Sets the global Datepicker base class, must be imported before the widget.
import 'vanillajs-datepicker';
import {
    DatepickerWidget,
    register_datepicker_array_subscribers,
} from '../src/bootstrap5/datepicker.js';

QUnit.module('bootstrap5 DatepickerWidget', (hooks) => {
    const container = $('<div id="container" />');
    let elem;
    let picker;
    let css_link;

    hooks.before(async () => {
        css_link = document.createElement('link');
        css_link.rel = 'stylesheet';
        css_link.href = '../../src/yafowil/widget/datetime/resources/bootstrap5/datepicker.min.css';
        document.head.appendChild(css_link);
        // Wait for required styles to load
        await new Promise((resolve) => {
            css_link.onload = resolve;
        });
        $('body').append(container);
    });
    hooks.beforeEach(() => {
        elem = $('<input type="text" />').addClass('datepicker');
        container.append(elem);
    });
    hooks.afterEach(() => {
        if (picker && $.contains(document, picker.trigger[0])) {
            picker.destroy();
        }
        picker = null;
        container.empty();
        container.css('position', '').css('top', '');
        delete window.ts;
        delete window.yafowil_array;
    });
    hooks.after(() => {
        container.remove();
        document.head.removeChild(css_link);
    });

    QUnit.test('initialize', (assert) => {
        DatepickerWidget.initialize();
        picker = elem.data('yafowil-datepicker');

        assert.ok(picker instanceof DatepickerWidget);
        assert.strictEqual(picker.elem[0], elem[0]);
        assert.strictEqual(picker._options.orientation, 'bottom');
        assert.strictEqual(picker._options.format, 'mm.dd.yyyy');
        assert.ok(picker.trigger.is('button.datepicker-trigger.btn.btn-outline-secondary'));
        assert.ok(picker.trigger.prev().is(elem));
    });

    QUnit.test('initialize twice binds once', (assert) => {
        DatepickerWidget.initialize();
        picker = elem.data('yafowil-datepicker');

        DatepickerWidget.initialize();

        assert.strictEqual(elem.data('yafowil-datepicker'), picker);
        assert.strictEqual(container.find('button.datepicker-trigger').length, 1);
    });

    QUnit.test('initialize skips array template', (assert) => {
        window.yafowil_array = {
            inside_template: () => true,
        };
        DatepickerWidget.initialize();
        assert.strictEqual(elem.data('yafowil-datepicker'), undefined);
    });

    QUnit.test('constructor - no space on bottom', (assert) => {
        container.css('position', 'absolute').css('top', 'calc(100vh - 100px)');
        DatepickerWidget.initialize();
        picker = elem.data('yafowil-datepicker');
        assert.strictEqual(picker._options.orientation, 'top');
    });

    QUnit.test('constructor - locale and options', (assert) => {
        picker = new DatepickerWidget(elem, 'de', { autohide: false });
        assert.strictEqual(picker._options.format, 'dd.mm.yyyy');
        assert.strictEqual(picker._options.autohide, false);
    });

    QUnit.test('adapt', (assert) => {
        DatepickerWidget.initialize();
        picker = elem.data('yafowil-datepicker');
        const p_el = $(picker.picker.element);

        assert.ok($('.datepicker-picker', p_el).hasClass('card'));
        assert.ok($('.datepicker-header', p_el).is('.card-header.bg-primary'));
        assert.ok($('.datepicker-header .btn', p_el).first().hasClass('btn-primary'));
        assert.ok($('.datepicker-main', p_el).hasClass('card-body'));
    });

    QUnit.test('toggle_picker', (assert) => {
        DatepickerWidget.initialize();
        picker = elem.data('yafowil-datepicker');
        assert.strictEqual($(picker.picker.element).css('display'), 'none');

        picker.trigger.trigger('mousedown');
        assert.strictEqual($(picker.picker.element).css('display'), 'block');

        picker.trigger.trigger('touchstart');
        assert.strictEqual($(picker.picker.element).css('display'), 'none');

        const click = $.Event('click');
        picker.trigger.trigger(click);
        assert.true(click.isDefaultPrevented());
        assert.strictEqual($(picker.picker.element).css('display'), 'none');
    });

    QUnit.test('date change triggers change event', (assert) => {
        DatepickerWidget.initialize();
        picker = elem.data('yafowil-datepicker');
        elem.on('change', () => {
            assert.step('change');
        });

        picker.setDate('03.09.2023');
        assert.verifySteps(['change']);
    });

    QUnit.test('destroy', (assert) => {
        DatepickerWidget.initialize();
        picker = elem.data('yafowil-datepicker');
        const trigger = picker.trigger;
        elem.on('change', () => {
            assert.step('change');
        });

        picker.destroy();

        // the input is rendered server side, destroy removes only what the
        // widget created
        assert.notOk($.contains(document, trigger[0]));
        assert.strictEqual(container.find('button.datepicker-trigger').length, 0);
        assert.ok($.contains(document, elem[0]));
        assert.strictEqual(elem.data('yafowil-datepicker'), undefined);
        trigger.trigger('mousedown');
        elem.trigger('changeDate');
        assert.verifySteps([]);
    });

    QUnit.test('destroy keeps foreign handlers and data', (assert) => {
        DatepickerWidget.initialize();
        picker = elem.data('yafowil-datepicker');
        elem.data('foreign', 'value');
        elem.on('change', () => {
            assert.step('change');
        });

        picker.destroy();

        elem.trigger('change');
        assert.verifySteps(['change']);
        assert.strictEqual(elem.data('foreign'), 'value');

        // initialize binds the input again, destroyed in afterEach
        DatepickerWidget.initialize();
        assert.ok(elem.data('yafowil-datepicker') instanceof DatepickerWidget);
        assert.true(elem.data('yafowil-datepicker') !== picker);
        picker = elem.data('yafowil-datepicker');
    });

    QUnit.test('unload without ts destroys', (assert) => {
        DatepickerWidget.initialize();
        picker = elem.data('yafowil-datepicker');
        picker.unload();
        assert.notOk($.contains(document, picker.trigger[0]));
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

        QUnit.test('widget is attached to ts.ajax', (assert) => {
            DatepickerWidget.initialize();
            picker = elem.data('yafowil-datepicker');
            assert.strictEqual(attached.length, 1);
            assert.strictEqual(attached[0].inst, picker);
            assert.strictEqual(attached[0].el[0], elem[0]);
        });

        QUnit.test('unload is deprecated and destroys', (assert) => {
            DatepickerWidget.initialize();
            picker = elem.data('yafowil-datepicker');
            picker.unload();
            assert.deepEqual(deprecated, [
                [
                    'yafowil.widget.datepicker.unload',
                    'yafowil.widget.datepicker.destroy',
                    'yafowil 2.1',
                ],
            ]);
            assert.notOk($.contains(document, picker.trigger[0]));
        });
    });

    QUnit.module('register_datepicker_array_subscribers', () => {
        QUnit.test('without array widget', (assert) => {
            assert.strictEqual(register_datepicker_array_subscribers(), undefined);
        });

        QUnit.test('with array widget', (assert) => {
            let on_add;
            window.yafowil_array = {
                on_array_event: (evt_name, evt_function) => {
                    assert.strictEqual(evt_name, 'on_add');
                    on_add = evt_function;
                },
                inside_template: () => false,
            };
            register_datepicker_array_subscribers();

            on_add(null, container);
            picker = elem.data('yafowil-datepicker');
            assert.ok(picker instanceof DatepickerWidget);
        });
    });
});
