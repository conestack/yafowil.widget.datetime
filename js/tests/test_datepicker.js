import {DatepickerWidget} from '../src/datepicker.js';
import {register_datepicker_array_subscribers} from '../src/datepicker.js';


QUnit.module('DatepickerWidget', hooks => {
    let container = $('<div id="container" />');
    let elem;
    let picker;
    let _array_subscribers = {
        on_add: []
    };

    hooks.before(() => {
        $('body').append(container);
    });
    hooks.beforeEach(() => {
        elem = $(`<input type="text" />`).addClass('datepicker');
        container.append(elem);
    })
    hooks.afterEach(() => {
        container.empty();
        container
            .css('position', '')
            .css('top', 'unset');
        picker = null;
    });

    QUnit.test('register_datepicker_array_subscribers', assert => {
        container.empty();

        // return if window.yafowil === undefined
        register_datepicker_array_subscribers();
        assert.deepEqual(_array_subscribers['on_add'], []);

        // patch yafowil_array
        window.yafowil_array = {
            on_array_event: function(evt_name, evt_function) {
                _array_subscribers[evt_name] = evt_function;
            }
        };
        register_datepicker_array_subscribers();

        // create table DOM
        let table = $('<table />')
            .append($('<tr />'))
            .append($('<td />'))
            .appendTo('body');
        
        let el = $(`<input type="text" />`).addClass('datepicker');
        $('td', table).addClass('arraytemplate');
        el.appendTo($('td', table));

        // invoke array on_add - returns
        _array_subscribers['on_add'].apply(null, $('tr', table));
        picker = el.data('yafowil-datepicker');
        assert.notOk(picker);
        $('td', table).removeClass('arraytemplate');

        // invoke array on_add
        el.attr('id', '');
        _array_subscribers['on_add'].apply(null, $('tr', table));
        picker = el.data('yafowil-datepicker');
        assert.ok(picker);

        table.remove();
        window.yafowil_array = undefined;
        _array_subscribers = undefined;
    });

    QUnit.test('Constructor - no data', assert => {
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

    QUnit.test('Constructor - no space on bottom', assert => {
        container
            .css('position', 'absolute')
            .css('top', 'calc(100vh - 100px)');
        DatepickerWidget.initialize();

        picker = elem.data('yafowil-datepicker');
        // default options taken
        assert.strictEqual(picker._options.orientation, 'top');
    });

    QUnit.test('unload', assert => {
        DatepickerWidget.initialize();
        picker = elem.data('yafowil-datepicker');
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

    QUnit.test('mousedown', assert => {
        DatepickerWidget.initialize();
        picker = elem.data('yafowil-datepicker');
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
        picker = elem.data('yafowil-datepicker');
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
