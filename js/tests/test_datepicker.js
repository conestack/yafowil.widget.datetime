// import {Datepicker} from '../node_modules/vanillajs-datepicker/dist/js/datepicker.js';
import {DatepickerWidget} from '../src/datepicker.js';

QUnit.test('test', assert => {
    assert.ok(true);
});

let container = $('<div id="container" />');


////////////////////////////////////////////////////////////////////////////////
// DatepickerWidget
////////////////////////////////////////////////////////////////////////////////

QUnit.module('DatepickerWidget', () => {
    QUnit.module('constructor', hooks => {
        let elem;
        let picker;

        hooks.before(() => {
            $('body').append(container);
        });
        hooks.beforeEach(() => {
            elem = create_elem();
            container.append(elem);
        })
        hooks.afterEach(() => {
            container.empty();
            container
                .css('position', '')
                .css('top', 'unset');
            picker = null;
        });

        QUnit.test('no data', assert => {
            DatepickerWidget.initialize();

            picker = elem.data('datepicker');
            // default options taken
            assert.strictEqual(picker._options.orientation, 'bottom');
            assert.strictEqual(picker._options.buttonClass, 'btn');
            assert.strictEqual(picker._options.todayHighlight, true);
            assert.strictEqual(picker._options.autohide, true);

            assert.deepEqual(picker.elem, elem);
            assert.deepEqual(elem.data('datepicker'), picker);
            assert.ok(picker.trigger.is('button.datepicker-trigger.btn.btn-default'));

            assert.ok(picker.toggle_picker);
        });
        QUnit.test('no space on bottom', assert => {
            container
                .css('position', 'absolute')
                .css('top', 'calc(100vh - 100px)');
            DatepickerWidget.initialize();

            picker = elem.data('datepicker');
            // default options taken
            assert.strictEqual(picker._options.orientation, 'top');
        });
    });

    QUnit.module('unload', hooks => {
        let elem;
        let picker;

        hooks.before(() => {
            $('body').append(container);
        });
        hooks.beforeEach(() => {
            elem = create_elem();
            container.append(elem);
        })
        hooks.afterEach(() => {
            container.empty();
            picker = null;
        });

        QUnit.test('unload', assert => {
            DatepickerWidget.initialize();
            picker = elem.data('datepicker');
            assert.strictEqual($(picker.picker.element).css('display'), 'none');

            // unload picker
            picker.unload();

            // trigger mousedown
            picker.trigger.trigger('mousedown');
            assert.strictEqual($(picker.picker.element).css('display'), 'none');

            // trigger touchstart
            picker.trigger.trigger('touchstart');
            assert.strictEqual($(picker.picker.element).css('display'), 'none');

            // trigger click
            picker.trigger.trigger('click');
            assert.strictEqual($(picker.picker.element).css('display'), 'none');
        });
    });

    QUnit.module('toggle_picker', hooks => {
        let elem;
        let picker;

        hooks.before(() => {
            $('body').append(container);
        });
        hooks.beforeEach(() => {
            elem = create_elem();
            container.append(elem);
        })
        hooks.afterEach(() => {
            container.empty();
            picker = null;
        });

        QUnit.test('mousedown', assert => {
            DatepickerWidget.initialize();
            picker = elem.data('datepicker');
            assert.strictEqual($(picker.picker.element).css('display'), 'none');

            // trigger first mousedown
            picker.trigger.trigger('mousedown');
            assert.strictEqual($(picker.picker.element).css('display'), 'block');
            assert.ok(picker.elem.is(':focus'));

            // trigger second mousedown
            picker.trigger.trigger('mousedown');
            assert.strictEqual($(picker.picker.element).css('display'), 'none');
            assert.notOk(picker.elem.is(':focus'));
        });

        QUnit.test('touchstart', assert => {
            DatepickerWidget.initialize();
            picker = elem.data('datepicker');
            assert.strictEqual($(picker.picker.element).css('display'), 'none');

            // trigger first mousedown
            picker.trigger.trigger('touchstart');
            assert.strictEqual($(picker.picker.element).css('display'), 'block');
            assert.ok(picker.elem.is(':focus'));

            // trigger second mousedown
            picker.trigger.trigger('touchstart');
            assert.strictEqual($(picker.picker.element).css('display'), 'none');
            assert.notOk(picker.elem.is(':focus'));
        });
    });
});



function create_elem() {
    let elem = $(`<input type="text" />`).addClass('datepicker');
    return elem;
}
