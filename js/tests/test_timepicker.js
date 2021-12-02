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

    QUnit.test('language and clock 12', assert => {
        data_clock = 12;
        data_locale = "de";

        elem.data('time-clock', data_clock);
        elem.data('time-locale', data_locale);
        TimepickerWidget.initialize();

        picker = elem.data('timepicker');
        assert.strictEqual(picker.language, data_locale);
        assert.strictEqual(picker.clock, data_clock);
        assert.strictEqual(picker.period, null);
    });
});

QUnit.module('place', hooks => {
    let elem;
    let picker;

    hooks.before(() => {
        $('body').append(container);
        elem = create_elem();
        container.append(elem);
    });
    hooks.after(() => {
        container.empty();
        container.css('top', 'unset').css('left', 'unset').css('position', 'unset');
        picker = null;
    });

    QUnit.test('too little space on bottom', assert => {
        container
            .css('position', 'absolute')
            .css('top', 'calc(100vh - 100px)');

        TimepickerWidget.initialize();
        picker = elem.data('timepicker');

        picker.elem.trigger('focus');
        assert.strictEqual(picker.dd_elem.css('top'), '-170px');
    });
    QUnit.test('too little space on right', assert => {
        container
            .css('position', 'absolute')
            .css('left', 'calc(100% - 200px)');

        TimepickerWidget.initialize();
        picker = elem.data('timepicker');

        picker.elem.trigger('focus');
        assert.strictEqual(
            picker.dd_elem.offset().right,
            picker.elem.offset().right
        );
    });
});

QUnit.module('unload', hooks => {
    let elem;
    let picker;

    hooks.before(() => {
        $('body').append(container);
        elem = create_elem();
        container.append(elem);
    });
    hooks.after(() => {
        container.empty();
        picker = null;
    });

    QUnit.test('unload elements', assert => {
        TimepickerWidget.initialize();
        picker = elem.data('timepicker');
        assert.strictEqual(picker.dd_elem.css('display'), 'none');

        picker.unload();

        picker.elem.trigger('focus');
        assert.strictEqual(picker.dd_elem.css('display'), 'none');

        picker.trigger_elem.trigger('click');
        assert.strictEqual(picker.dd_elem.css('display'), 'none');

        $(document).trigger('click');
        assert.strictEqual(picker.dd_elem.css('display'), 'none');

        let keypress = $.Event('keypress', { key: '1' } );
        picker.elem.trigger(keypress);
        assert.strictEqual(picker.dd_elem.css('display'), 'none');

        let keyup = $.Event('keyup', { key: '1' } );
        picker.elem.trigger(keyup);
        assert.strictEqual(picker.dd_elem.css('display'), 'none');
    });
});

QUnit.module('set_time', hooks => {
    let elem;
    let picker;

    hooks.before(() => {
        $('body').append(container);
    });
    hooks.beforeEach(() => {
        elem = create_elem();
        $('#container').append(elem);
    });
    hooks.afterEach(() => {
        container.empty();
        picker = null;
    });

    QUnit.test('empty hours and minutes', assert => {
        TimepickerWidget.initialize();
        picker = elem.data('timepicker');
        picker.show_dropdown();
        assert.strictEqual(picker.dd_elem.css('display'), 'block');
        assert.strictEqual(picker.hour, '');
        assert.strictEqual(picker.minute, '');

        picker.set_time();
        assert.strictEqual(picker.dd_elem.css('display'), 'block');
    });

    QUnit.test('24hr clock', assert => {
        let data_clock = 24;
        elem.data('time-clock', data_clock);
        TimepickerWidget.initialize();
        picker = elem.data('timepicker');
        picker.show_dropdown();
        assert.strictEqual(picker.dd_elem.css('display'), 'block');

        picker.minute = '25';
        picker.hour = '14';
        assert.strictEqual(picker.hour, '');
        assert.strictEqual(picker.minute, '');

        assert.strictEqual(picker.elem.val(), '14:25');
        assert.strictEqual(picker.dd_elem.css('display'), 'none');
    });

    QUnit.test('12hr clock', assert => {
        let data_clock = 12;
        elem.data('time-clock', data_clock);
        TimepickerWidget.initialize();
        picker = elem.data('timepicker');
        picker.show_dropdown();
        assert.strictEqual(picker.dd_elem.css('display'), 'block');

        picker.period = 'AM';
        picker.minute = '10';
        picker.hour = '08';
        assert.strictEqual(picker.hour, '');
        assert.strictEqual(picker.minute, '');

        assert.strictEqual(picker.elem.val(), '08:10AM');
        assert.strictEqual(picker.dd_elem.css('display'), 'none');
    });
});

QUnit.module('unload', hooks => {
    let elem;
    let picker;

    hooks.before(() => {
        $('body').append(container);
        elem = create_elem();
        $('#container').append(elem);
    });
    hooks.after(() => {
        container.empty();
        picker = null;
    });

    QUnit.test('unload elements', assert => {
        TimepickerWidget.initialize();
        picker = elem.data('timepicker');
        assert.strictEqual(picker.dd_elem.css('display'), 'none');

        picker.unload();

        picker.elem.trigger('focus');
        assert.strictEqual(picker.dd_elem.css('display'), 'none');

        picker.trigger_elem.trigger('click');
        assert.strictEqual(picker.dd_elem.css('display'), 'none');

        $(document).trigger('click');
        assert.strictEqual(picker.dd_elem.css('display'), 'none');

        let keypress = $.Event('keypress', { key: '1' } );
        picker.elem.trigger(keypress);
        assert.strictEqual(picker.dd_elem.css('display'), 'none');

        let keyup = $.Event('keyup', { key: '1' } );
        picker.elem.trigger(keyup);
        assert.strictEqual(picker.dd_elem.css('display'), 'none');
    });
});

QUnit.module('manual input', hooks => {
    let elem;
    let picker;

    /** NOTE:
     * manually firing an event does not generate the default action
     * associated with that event. For example, manually firing a key event
     * does not cause that letter to appear in a focused text input. In the
     * case of UI events, this is important for security reasons, as it
     * prevents scripts from simulating user actions that interact with
     * the browser itself.
    */

    hooks.before(() => {
        $('body').append(container);
    });
    hooks.beforeEach(() => {
        elem = create_elem();
        $('#container').append(elem);
    });
    hooks.afterEach(() => {
        container.empty();
        picker = null;
    });

    QUnit.module('24hr clock', () => {
        QUnit.test('correct input', assert => {
            TimepickerWidget.initialize();
            picker = elem.data('timepicker');
            picker.elem.trigger('focus');
            assert.strictEqual(picker.dd_elem.css('display'), 'block');

            let keys = [
                $.Event('keypress', { key: '1' } ),
                $.Event('keypress', { key: '3' } ),
                $.Event('keypress', { key: '2' } ),
                $.Event('keypress', { key: '5' } )
            ]
            for (let key of keys) {
                picker.elem.trigger(key);
                picker.elem.trigger('keyup');
            }

            assert.strictEqual(picker.elem.val(), '13:25');
            assert.strictEqual(picker.dd_elem.css('display'), 'none');
        });
        QUnit.test('AM/PM input', assert => {
            TimepickerWidget.initialize();
            picker = elem.data('timepicker');
            picker.elem.trigger('focus');
            assert.strictEqual(picker.dd_elem.css('display'), 'block');

            let keys = [
                $.Event('keypress', { key: '0' } ),
                $.Event('keypress', { key: '1' } ),
                $.Event('keypress', { key: '2' } ),
                $.Event('keypress', { key: '5' } ),
                $.Event('keypress', { key: 'A' } ),
                $.Event('keypress', { key: 'M' } )
            ]
            for (let key of keys) {
                picker.elem.trigger(key);
                picker.elem.trigger('keyup');
            }

            assert.strictEqual(picker.elem.val(), '01:25');
            assert.strictEqual(picker.dd_elem.css('display'), 'none');
        });
        QUnit.test('faulty inputs', assert => {
            TimepickerWidget.initialize();
            picker = elem.data('timepicker');
            picker.elem.trigger('focus');
            assert.strictEqual(picker.dd_elem.css('display'), 'block');

            let keys = [
                $.Event('keypress', {key: 'A'}),
                $.Event('keypress', {key: 'Q'}),
                $.Event('keypress', {key: 'Space'}),
                $.Event('keypress', {key: '1'}),
                $.Event('keypress', {key: '1'}),
                $.Event('keypress', {key: '2'}),
                $.Event('keypress', {key: '5'})
            ]
            for (let key of keys) {
                picker.elem.trigger(key);
                picker.elem.trigger('keyup');
            }
            assert.strictEqual(picker.elem.val(), '11:25');
            assert.strictEqual(picker.dd_elem.css('display'), 'none');

            // Hide on Enter Key
            picker.elem.trigger($.Event('keypress', {key: 'Enter'}));
            assert.strictEqual(picker.dd_elem.css('display'), 'none');
        });
    });

    QUnit.module('12hr clock', () => {
        QUnit.test('correct input', assert => {
            let data_clock = 12;
            elem.data('time-clock', data_clock);
            TimepickerWidget.initialize();
            picker = elem.data('timepicker');
            picker.elem.trigger('focus');
            assert.strictEqual(picker.dd_elem.css('display'), 'block');

            let keys = [
                $.Event('keypress', { key: '0' } ),
                $.Event('keypress', { key: '1' } ),
                $.Event('keypress', { key: '2' } ),
                $.Event('keypress', { key: '5' } ),
                $.Event('keypress', { key: 'A' } ),
                $.Event('keypress', { key: 'M' } )
            ]
            for (let key of keys) {
                picker.elem.trigger(key);
                picker.elem.trigger('keyup');
            }

            assert.strictEqual(picker.elem.val(), '01:25AM');
            assert.strictEqual(picker.dd_elem.css('display'), 'none');
        });
        QUnit.test('faulty inputs', assert => {
            let data_clock = 12;
            elem.data('time-clock', data_clock);
            TimepickerWidget.initialize();
            picker = elem.data('timepicker');
            picker.elem.trigger('focus');
            assert.strictEqual(picker.dd_elem.css('display'), 'block');

            let keys = [
                $.Event('keypress', {key: 'A'}),
                $.Event('keypress', {key: 'Q'}),
                $.Event('keypress', {key: 'Space'}),
                $.Event('keypress', {key: '1'}),
                $.Event('keypress', {key: '1'}),
                $.Event('keypress', {key: '2'}),
                $.Event('keypress', {key: '5'}),
                $.Event('keypress', {key: '2'}),
                $.Event('keypress', {key: '5'}),
                $.Event('keypress', {key: 'A'}),
                $.Event('keypress', {key: '2'}),
                $.Event('keypress', {key: 'M'})
            ]
            for (let key of keys) {
                picker.elem.trigger(key);
                picker.elem.trigger('keyup');
            }
            assert.strictEqual(picker.elem.val(), '11:25AM');
            assert.strictEqual(picker.dd_elem.css('display'), 'none');
        });
    });
});

QUnit.module('validate', hooks => {
    let elem;
    let picker;

    hooks.before(() => {
        $('body').append(container);
    });
    hooks.beforeEach(() => {
        elem = create_elem();
        $('#container').append(elem);
    });
    hooks.afterEach(() => {
        container.empty();
        picker = null;
    });

    QUnit.module('24hr clock', () => {
        QUnit.test('correct input', assert => {
            TimepickerWidget.initialize();
            picker = elem.data('timepicker');

            picker.elem.val('16:35');
            picker.validate();

            assert.strictEqual(picker.elem.val(), '16:35');
            let hour_elem = picker.hours.children[16];
            assert.strictEqual(hour_elem.selected, true);
            let minute_elem = picker.minutes.children[7];
            assert.strictEqual(minute_elem.selected, true);
        });
        QUnit.test('no match', assert => {
            TimepickerWidget.initialize();
            picker = elem.data('timepicker');

            picker.elem.val('1:35U');
            picker.validate();

            for (let hour of picker.hours.children) {
                assert.strictEqual(hour.selected, false);
            }
            for (let minute of picker.minutes.children) {
                assert.strictEqual(minute.selected, false);
            }
        });
    });

    QUnit.module('12hr clock', () => {
        QUnit.test('correct input, AM', assert => {
            let data_clock = 12;
            elem.data('time-clock', data_clock);
            TimepickerWidget.initialize();
            picker = elem.data('timepicker');

            picker.elem.val('03:15am');
            picker.validate();

            assert.strictEqual(picker.elem.val(), '03:15AM');
            let hour_elem = picker.hours.children[3];
            assert.strictEqual(hour_elem.selected, true);
            let minute_elem = picker.minutes.children[3];
            assert.strictEqual(minute_elem.selected, true);
        });
        QUnit.test('correct input, PM', assert => {
            let data_clock = 12;
            elem.data('time-clock', data_clock);
            TimepickerWidget.initialize();
            picker = elem.data('timepicker');

            picker.elem.val('03:15pm');
            picker.validate();

            assert.strictEqual(picker.elem.val(), '03:15PM');
            let hour_elem = picker.hours.children[15];
            assert.strictEqual(hour_elem.selected, true);
            let minute_elem = picker.minutes.children[3];
            assert.strictEqual(minute_elem.selected, true);
        });
        QUnit.test('no match', assert => {
            let data_clock = 12;
            elem.data('time-clock', data_clock);
            TimepickerWidget.initialize();
            picker = elem.data('timepicker');

            picker.elem.val('1j8:23AM');
            picker.validate();

            for (let hour of picker.hours.children) {
                assert.strictEqual(hour.selected, false);
            }
            for (let minute of picker.minutes.children) {
                assert.strictEqual(minute.selected, false);
            }
        });
    });
});

function create_elem() {
    let elem = $(`<input type="text" />`).addClass('timepicker');
    return elem;
}