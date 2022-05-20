import {TimepickerWidget} from '../src/timepicker.js';

QUnit.module('TimepickerWidget', hooks => {
    let container = $('<div id="container" />');
    let elem;
    let data_clock;
    let data_locale;
    let picker;

    hooks.before(() => {
        $('body').append(container);
    });
    hooks.beforeEach(() => {
        elem = $(`<input type="text" />`).addClass('timepicker');
        container.append(elem);
    });
    hooks.afterEach(() => {
        container.empty();
        // reset container css
        container.css('top', 'unset').css('left', 'unset').css('position', 'unset');
        picker = null;
    });

    QUnit.test('Initialize() - no data', assert => {
        TimepickerWidget.initialize();

        picker = elem.data('yafowil-timepicker');
        assert.strictEqual(picker.language, "en");
        assert.strictEqual(picker.clock, 24);
    });

    QUnit.test('Initialize() - language and clock 12', assert => {
        // manually set data and locale
        data_clock = 12;
        data_locale = "de";

        elem.data('time-clock', data_clock);
        elem.data('time-locale', data_locale);
        TimepickerWidget.initialize();

        picker = elem.data('yafowil-timepicker');
        assert.strictEqual(picker.language, data_locale);
        assert.strictEqual(picker.clock, data_clock);
        assert.strictEqual(picker.period, null);
    });

    /**
     * set position of timepicker dropdown
     * depending on available space
    */

    /* lack of space on bottom edge */
    QUnit.test('Place - align to top', assert => {
        container
            .css('position', 'absolute')
            .css('top', 'calc(100vh - 100px)');

        TimepickerWidget.initialize();
        picker = elem.data('yafowil-timepicker');

        picker.elem.trigger('focus');
        assert.strictEqual(picker.dd_elem.css('top'), '-170px');
    });
    /* lack of space on right edge */
    QUnit.test('Place - align to right', assert => {
        container
            .css('position', 'absolute')
            .css('left', 'calc(100% - 200px)');

        TimepickerWidget.initialize();
        picker = elem.data('yafowil-timepicker');

        picker.elem.trigger('focus');
        assert.strictEqual(
            picker.dd_elem.offset().right,
            picker.elem.offset().right
        );
    });

    QUnit.test('unload elements', assert => {
        TimepickerWidget.initialize();
        picker = elem.data('yafowil-timepicker');
        assert.strictEqual(picker.dd_elem.css('display'), 'none');

        // trigger unload
        picker.unload();

        // trigger unbind of focus
        picker.elem.trigger('focus');
        assert.strictEqual(picker.dd_elem.css('display'), 'block');

        // trigger unbind of document click
        $(document).trigger('click');
        assert.strictEqual(picker.dd_elem.css('display'), 'block');
    });

    QUnit.test('Set_time() - empty hours and minutes', assert => {
        // returns if no hour or minute is set
        TimepickerWidget.initialize();
        picker = elem.data('yafowil-timepicker');
        picker.show_dropdown();
        assert.strictEqual(picker.dd_elem.css('display'), 'block');
        assert.strictEqual(picker.hour, '');
        assert.strictEqual(picker.minute, '');

        picker.set_time();
        assert.strictEqual(picker.dd_elem.css('display'), 'block');
    });

    QUnit.test('Set_time() - 24hr clock', assert => {
        let data_clock = 24;
        elem.data('time-clock', data_clock);
        TimepickerWidget.initialize();
        picker = elem.data('yafowil-timepicker');
        picker.show_dropdown();
        assert.strictEqual(picker.dd_elem.css('display'), 'block');

        picker.minute = '25';
        picker.hour = '14';
        // hours and minutes get reset after processing
        assert.strictEqual(picker.hour, '');
        assert.strictEqual(picker.minute, '');

        // check if correct value has been set
        assert.strictEqual(picker.elem.val(), '14:25');
        assert.strictEqual(picker.dd_elem.css('display'), 'none');
    });

    QUnit.test('Set_time() - 12hr clock', assert => {
        let data_clock = 12;
        elem.data('time-clock', data_clock);
        TimepickerWidget.initialize();
        picker = elem.data('yafowil-timepicker');
        picker.show_dropdown();
        assert.strictEqual(picker.dd_elem.css('display'), 'block');

        picker.period = 'AM';
        picker.minute = '10';
        picker.hour = '08';
        // hours and minutes get reset after processing
        assert.strictEqual(picker.hour, '');
        assert.strictEqual(picker.minute, '');

        // check if correct value has been set
        assert.strictEqual(picker.elem.val(), '08:10AM');
        assert.strictEqual(picker.dd_elem.css('display'), 'none');
    });

    QUnit.module('24hr clock', () => {
        QUnit.test('correct input', assert => {
            TimepickerWidget.initialize();
            picker = elem.data('yafowil-timepicker');
            picker.elem.trigger('focus');
            assert.strictEqual(picker.dd_elem.css('display'), 'block');

            // define keypress events
            let keys = [
                $.Event('keypress', { key: '1' }),
                $.Event('keypress', { key: '3' }),
                $.Event('keypress', { key: '2' }),
                $.Event('keypress', { key: '5' })
            ]
            // trigger keypress events
            for (let key of keys) {
                picker.elem.trigger(key);
                picker.elem.trigger('keyup');
            }

            // assert correct input value
            assert.strictEqual(picker.elem.val(), '13:25');
            assert.strictEqual(picker.dd_elem.css('display'), 'none');
        });
        QUnit.test('AM/PM input', assert => {
            TimepickerWidget.initialize();
            picker = elem.data('yafowil-timepicker');
            picker.elem.trigger('focus');
            assert.strictEqual(picker.dd_elem.css('display'), 'block');

            // define keypress events
            let keys = [
                $.Event('keypress', { key: '0' }),
                $.Event('keypress', { key: '1' }),
                $.Event('keypress', { key: '2' }),
                $.Event('keypress', { key: '5' }),
                $.Event('keypress', { key: 'A' }),
                $.Event('keypress', { key: 'M' })
            ]
            // trigger keypress events
            for (let key of keys) {
                picker.elem.trigger(key);
                picker.elem.trigger('keyup');
            }

            // incorrect characters have not been accepted
            assert.strictEqual(picker.elem.val(), '01:25');
            assert.strictEqual(picker.dd_elem.css('display'), 'none');
        });
        QUnit.test('faulty inputs', assert => {
            TimepickerWidget.initialize();
            picker = elem.data('yafowil-timepicker');
            picker.elem.trigger('focus');
            assert.strictEqual(picker.dd_elem.css('display'), 'block');

            // define keypress events
            let keys = [
                $.Event('keypress', { key: 'A' }),
                $.Event('keypress', { key: 'Q' }),
                $.Event('keypress', { key: 'Space' }),
                $.Event('keypress', { key: '1' }),
                $.Event('keypress', { key: '1' }),
                $.Event('keypress', { key: '2' }),
                $.Event('keypress', { key: '5' })
            ]
            // trigger keypress events
            for (let key of keys) {
                picker.elem.trigger(key);
                picker.elem.trigger('keyup');
            }
            // incorrect characters have not been accepted
            assert.strictEqual(picker.elem.val(), '11:25');
            assert.strictEqual(picker.dd_elem.css('display'), 'none');

            // Hide on Enter Key
            picker.elem.trigger($.Event('keypress', { key: 'Enter' }));
            assert.strictEqual(picker.dd_elem.css('display'), 'none');
        });
        QUnit.test('validate() - correct input', assert => {
            TimepickerWidget.initialize();
            picker = elem.data('yafowil-timepicker');

            // set time in elem
            picker.elem.val('16:35');
            // validate time format
            picker.validate();

            assert.strictEqual(picker.elem.val(), '16:35');

            // correct hour and minute cell are selected
            let hour_elem = picker.hours.children[16];
            assert.strictEqual(hour_elem.selected, true);
            let minute_elem = picker.minutes.children[7];
            assert.strictEqual(minute_elem.selected, true);
        });
        QUnit.test('validate() - no match', assert => {
            TimepickerWidget.initialize();
            picker = elem.data('yafowil-timepicker');

            // set time in elem
            picker.elem.val('1:35U');
            // validate time format
            picker.validate();

            // no minute or hour cell selected
            for (let hour of picker.hours.children) {
                assert.strictEqual(hour.selected, false);
            }
            for (let minute of picker.minutes.children) {
                assert.strictEqual(minute.selected, false);
            }
        });
    });

    QUnit.module('12hr clock', () => {
        QUnit.test('correct input', assert => {
            let data_clock = 12;
            elem.data('time-clock', data_clock);
            TimepickerWidget.initialize();
            picker = elem.data('yafowil-timepicker');
            picker.elem.trigger('focus');
            assert.strictEqual(picker.dd_elem.css('display'), 'block');

            // define keypress events
            let keys = [
                $.Event('keypress', { key: '0' }),
                $.Event('keypress', { key: '1' }),
                $.Event('keypress', { key: '2' }),
                $.Event('keypress', { key: '5' }),
                $.Event('keypress', { key: 'A' }),
                $.Event('keypress', { key: 'M' })
            ]
            // trigger keypress events
            for (let key of keys) {
                picker.elem.trigger(key);
                picker.elem.trigger('keyup');
            }

            // assert correct input value
            assert.strictEqual(picker.elem.val(), '01:25AM');
            assert.strictEqual(picker.dd_elem.css('display'), 'none');
        });
        QUnit.test('faulty inputs', assert => {
            let data_clock = 12;
            elem.data('time-clock', data_clock);
            TimepickerWidget.initialize();
            picker = elem.data('yafowil-timepicker');
            picker.elem.trigger('focus');
            assert.strictEqual(picker.dd_elem.css('display'), 'block');

            // define keypress events
            let keys = [
                $.Event('keypress', { key: 'A' }),
                $.Event('keypress', { key: 'Q' }),
                $.Event('keypress', { key: 'Space' }),
                $.Event('keypress', { key: '1' }),
                $.Event('keypress', { key: '1' }),
                $.Event('keypress', { key: '2' }),
                $.Event('keypress', { key: '5' }),
                $.Event('keypress', { key: '2' }),
                $.Event('keypress', { key: '5' }),
                $.Event('keypress', { key: 'A' }),
                $.Event('keypress', { key: '2' }),
                $.Event('keypress', { key: 'M' })
            ]
            // trigger keypress events
            for (let key of keys) {
                picker.elem.trigger(key);
                picker.elem.trigger('keyup');
            }

            // incorrect characters have not been accepted
            assert.strictEqual(picker.elem.val(), '11:25AM');
            assert.strictEqual(picker.dd_elem.css('display'), 'none');
        });
        QUnit.test('validate() - correct input, AM', assert => {
            let data_clock = 12;
            elem.data('time-clock', data_clock);
            TimepickerWidget.initialize();
            picker = elem.data('yafowil-timepicker');

            // set time in elem
            picker.elem.val('03:15am');
            // validate time format
            picker.validate();

            assert.strictEqual(picker.elem.val(), '03:15AM');

            // correct hour and minute cell are selected
            let hour_elem = picker.hours.children[3];
            assert.strictEqual(hour_elem.selected, true);
            let minute_elem = picker.minutes.children[3];
            assert.strictEqual(minute_elem.selected, true);
        });
        QUnit.test('validate() - correct input, PM', assert => {
            let data_clock = 12;
            elem.data('time-clock', data_clock);
            TimepickerWidget.initialize();
            picker = elem.data('yafowil-timepicker');

            // set time in elem
            picker.elem.val('03:15pm');
            // validate time format
            picker.validate();

            // correct hour and minute cell are selected
            assert.strictEqual(picker.elem.val(), '03:15PM');
            let hour_elem = picker.hours.children[15];
            assert.strictEqual(hour_elem.selected, true);
            let minute_elem = picker.minutes.children[3];
            assert.strictEqual(minute_elem.selected, true);
        });
        QUnit.test('validate() - no match', assert => {
            let data_clock = 12;
            elem.data('time-clock', data_clock);
            TimepickerWidget.initialize();
            picker = elem.data('yafowil-timepicker');

            // set time in elem
            picker.elem.val('1j8:23AM');
            // validate time format
            picker.validate();

            // no minute or hour cell selected
            for (let hour of picker.hours.children) {
                assert.strictEqual(hour.selected, false);
            }
            for (let minute of picker.minutes.children) {
                assert.strictEqual(minute.selected, false);
            }
        });
    });

    QUnit.test('toggle_dropdown()', assert => {
        TimepickerWidget.initialize();
        picker = elem.data('yafowil-timepicker');
        assert.strictEqual(picker.dd_elem.css('display'), 'none');

        // trigger click on trigger element
        picker.trigger_elem.trigger('click');
        assert.strictEqual(picker.dd_elem.css('display'), 'block');

        // trigger click on trigger element
        picker.trigger_elem.trigger('click');
        assert.strictEqual(picker.dd_elem.css('display'), 'none');
    });

    QUnit.test('hide_dropdown() - click outside of dropdown', assert => {
        TimepickerWidget.initialize();
        picker = elem.data('yafowil-timepicker');
        assert.strictEqual(picker.dd_elem.css('display'), 'none');

        // show element
        picker.trigger_elem.trigger('click');
        assert.strictEqual(picker.dd_elem.css('display'), 'block');

        // click outside of element
        let click = new $.Event('click', { pageX: 1, pageY: 1 });
        $(document).trigger(click);
        assert.strictEqual(picker.dd_elem.css('display'), 'none');

        // show element
        picker.trigger_elem.trigger('click');
        assert.strictEqual(picker.dd_elem.css('display'), 'block');

        // click inside of element
        picker.dd_elem.trigger('click');
        assert.strictEqual(picker.dd_elem.css('display'), 'block');
    });
});

