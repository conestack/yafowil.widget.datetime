import {TimepickerWidget} from '../src/timepicker.js';

let container = $('<div id="container" />');

QUnit.module('initialize function', hooks => {
    let elem;
    let data_clock;
    let data_locale;
    let picker;

    hooks.before(() => {
        $('body').append(container);
    });
    hooks.beforeEach(() => {
        elem = create_elem();
        $('#container').append(elem);
    })
    hooks.afterEach(() => {
        container.empty();
        picker = null;
    });

    QUnit.test('no data', assert => {
        TimepickerWidget.initialize();

        picker = elem.data('timepicker');
        assert.strictEqual(picker.language, "en");
        assert.strictEqual(picker.clock, 24);
    });

    QUnit.test('language and clock', assert => {
        data_clock = 12;
        data_locale = "de";

        elem.data('time-clock', data_clock);
        elem.data('time-locale', data_locale);
        TimepickerWidget.initialize();

        picker = elem.data('timepicker');
        assert.strictEqual(picker.language, data_locale);
        assert.strictEqual(picker.clock, data_clock);
    });
});

function create_elem() {
    let elem = $(`<input type="text" />`).addClass('timepicker');
    return elem;
}