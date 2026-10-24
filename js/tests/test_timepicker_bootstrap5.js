import $ from 'jquery';
import Popper from 'popper';
import {
    register_timepicker_array_subscribers,
    TimepickerButton,
    TimepickerButtonContainer,
    TimepickerWidget,
} from '../src/bootstrap5/timepicker.js';

QUnit.module('bootstrap5 TimepickerWidget', (hooks) => {
    const orig_create_popper = Popper.createPopper;
    const container = $('<div id="container" />');
    let elem;
    let picker;
    let poppers;
    let css_link;

    hooks.before(async () => {
        css_link = document.createElement('link');
        css_link.rel = 'stylesheet';
        css_link.href = '../../src/yafowil/widget/datetime/resources/bootstrap5/timepicker.min.css';
        document.head.appendChild(css_link);
        // Wait for required styles to load
        await new Promise((resolve) => {
            css_link.onload = resolve;
        });
        $('body').append(container);
    });
    hooks.beforeEach(() => {
        poppers = [];
        Popper.createPopper = (reference, popper, options) => {
            const instance = { reference, popper, options, updates: 0, destroyed: false };
            instance.forceUpdate = () => {
                instance.updates++;
            };
            instance.destroy = () => {
                instance.destroyed = true;
            };
            poppers.push(instance);
            return instance;
        };
        elem = $('<input type="text" />').addClass('timepicker');
        $('<div class="input-group" />').append(elem).appendTo(container);
    });
    hooks.afterEach(() => {
        if (picker) {
            picker.destroy();
        }
        picker = null;
        container.empty();
        Popper.createPopper = orig_create_popper;
        delete window.ts;
        delete window.yafowil_array;
    });
    hooks.after(() => {
        container.remove();
        document.head.removeChild(css_link);
    });

    function keypress(...keys) {
        for (const key of keys) {
            picker.elem.trigger($.Event('keypress', { key }));
            picker.elem.trigger('keyup');
        }
    }

    QUnit.test('initialize - no data', (assert) => {
        TimepickerWidget.initialize();
        picker = elem.data('yafowil-timepicker');

        assert.ok(picker instanceof TimepickerWidget);
        assert.strictEqual(picker.language, 'en');
        assert.strictEqual(picker.clock, 24);
        assert.strictEqual(picker.step, 5);
        assert.strictEqual(picker.period, null);
        assert.ok(picker.trigger_elem.is('button.timepicker-trigger.btn.btn-outline-secondary'));
        assert.ok(picker.dd_elem.prev().is('.input-group'));
        assert.ok($('.timepicker-container', picker.dd_elem).is('.card-group.shadow'));
        assert.strictEqual(picker.hours.children.length, 24);
        assert.strictEqual(picker.minutes.children.length, 12);
        assert.strictEqual(picker.dd_elem.css('display'), 'none');

        const popper = picker.popper;
        assert.strictEqual(popper.reference, elem[0]);
        assert.strictEqual(popper.popper, picker.dd_elem[0]);
        assert.strictEqual(popper.options.placement, 'bottom-start');
    });

    QUnit.test('initialize disables spellcheck', (assert) => {
        TimepickerWidget.initialize();
        picker = elem.data('yafowil-timepicker');

        // jQuery 4 removes an attribute set to boolean ``false``
        assert.strictEqual(elem.attr('spellcheck'), 'false');
    });

    QUnit.test('initialize - data', (assert) => {
        elem.data('time-clock', 12);
        elem.data('time-locale', 'de');
        elem.data('time-minutes_step', 15);
        TimepickerWidget.initialize();
        picker = elem.data('yafowil-timepicker');

        assert.strictEqual(picker.language, 'de');
        assert.strictEqual(picker.clock, 12);
        assert.strictEqual(picker.step, 15);
        assert.strictEqual($('.timepicker-hours .header', picker.dd_elem).text(), 'StundeMinute');
        assert.strictEqual(picker.hours.children.length, 24);
        assert.strictEqual($('div.am .cell', picker.dd_elem).length, 12);
        assert.strictEqual($('div.pm .cell', picker.dd_elem).length, 12);
        assert.strictEqual(picker.hours.children[12].period, 'PM');
    });

    QUnit.test('initialize twice binds once', (assert) => {
        TimepickerWidget.initialize();
        picker = elem.data('yafowil-timepicker');

        TimepickerWidget.initialize();

        assert.strictEqual(elem.data('yafowil-timepicker'), picker);
        assert.strictEqual(poppers.length, 1);
    });

    QUnit.test('initialize skips array template', (assert) => {
        window.yafowil_array = {
            inside_template: () => true,
        };
        TimepickerWidget.initialize();
        assert.strictEqual(elem.data('yafowil-timepicker'), undefined);
    });

    QUnit.test('faulty minutes step', (assert) => {
        for (const step of [0, 61, '5']) {
            const input = $('<input type="text" />').appendTo(container);
            const widget = new TimepickerWidget(input, { step });
            assert.strictEqual(widget.step, 5);
            widget.destroy();
        }
    });

    QUnit.test('translate - unknown language falls back to english', (assert) => {
        picker = new TimepickerWidget(elem, { language: 'fr' });
        assert.strictEqual(picker.translate('hour'), 'Hour');
    });

    QUnit.module('calc_flex_basis', () => {
        QUnit.test('step 5', (assert) => {
            picker = new TimepickerWidget(elem, { step: 5 });
            assert.strictEqual(picker.minutes.columns_count, 3);
            assert.strictEqual(picker.minutes.elem.css('grid-template-columns'), '1fr 1fr 1fr');
            assert.strictEqual(parseFloat(picker.hours.container_elem[0].style.flexBasis), 66.67);
            assert.strictEqual(parseFloat(picker.minutes.container_elem[0].style.flexBasis), 33.33);
            assert.strictEqual(picker.dd_elem[0].style.width, 'calc(360px + 4rem)');
        });

        QUnit.test('step 30 uses at least two minute columns', (assert) => {
            picker = new TimepickerWidget(elem, { step: 30 });
            assert.strictEqual(picker.minutes.columns_count, 1);
            assert.strictEqual(parseFloat(picker.hours.container_elem[0].style.flexBasis), 75);
            assert.strictEqual(parseFloat(picker.minutes.container_elem[0].style.flexBasis), 25);
            assert.strictEqual(picker.dd_elem[0].style.width, 'calc(320px + 4rem)');
        });

        QUnit.test('step 1 with 24 hour clock', (assert) => {
            picker = new TimepickerWidget(elem, { step: 1, clock: 24 });
            assert.strictEqual(picker.minutes.columns_count, 10);
            assert.strictEqual(
                $('div.hours-content', picker.dd_elem)[0].style.gridTemplateColumns,
                '1fr 1fr 1fr 1fr',
            );
            assert.strictEqual(picker.dd_elem[0].style.width, 'calc(560px + 4rem)');
        });

        QUnit.test('step 1 with 12 hour clock', (assert) => {
            picker = new TimepickerWidget(elem, { step: 1, clock: 12 });
            assert.strictEqual(
                $('div.am', picker.dd_elem)[0].style.gridTemplateColumns,
                '1fr 1fr 1fr 1fr',
            );
            assert.strictEqual(picker.dd_elem[0].style.width, 'calc(600px + 4rem)');
        });
    });

    QUnit.test('show, toggle and hide dropdown', (assert) => {
        picker = new TimepickerWidget(elem, {});

        picker.elem.trigger('focus');
        assert.strictEqual(picker.dd_elem.css('display'), 'block');
        assert.strictEqual(picker.popper.updates, 1);

        // click on input does not hide
        $(document).trigger($.Event('click', { target: elem[0] }));
        assert.strictEqual(picker.dd_elem.css('display'), 'block');

        // click inside dropdown does not hide
        picker.dd_elem.trigger('click');
        assert.strictEqual(picker.dd_elem.css('display'), 'block');

        // click outside hides and drops a half selected time
        picker.hours.children[5].elem.trigger('click');
        assert.strictEqual(picker.hour, '05');
        assert.ok(picker.hours.children[5].selected);
        $('body').trigger('click');
        assert.strictEqual(picker.dd_elem.css('display'), 'none');
        assert.strictEqual(picker.hour, '');
        assert.notOk(picker.hours.children[5].selected);

        const click = $.Event('click');
        picker.trigger_elem.trigger(click);
        assert.true(click.isDefaultPrevented());
        assert.strictEqual(picker.dd_elem.css('display'), 'block');
        assert.strictEqual(picker.popper.updates, 2);

        // click on trigger does not hide via document handler
        picker.trigger_elem.trigger('click');
        assert.strictEqual(picker.dd_elem.css('display'), 'none');
    });

    QUnit.test('set_time - 24 hour clock', (assert) => {
        picker = new TimepickerWidget(elem, {});
        picker.elem.on('change', () => {
            assert.step('change');
        });
        picker.show_dropdown();

        picker.set_time();
        assert.strictEqual(picker.dd_elem.css('display'), 'block');

        picker.hours.children[14].elem.trigger('click');
        picker.minutes.children[5].elem.trigger('click');

        assert.strictEqual(picker.elem.val(), '14:25');
        assert.verifySteps(['change']);
        assert.strictEqual(picker.hour, '');
        assert.strictEqual(picker.minute, '');
        assert.strictEqual(picker.dd_elem.css('display'), 'none');
        // selection is kept as previous selection
        assert.notOk(picker.hours.children[14].selected);
        assert.true(picker.hours.children[14].previously_selected);
        assert.true(picker.minutes.children[5].previously_selected);

        // a new selection removes the previous one
        picker.hours.children[3].elem.trigger('click');
        assert.false(picker.hours.children[14].previously_selected);
        assert.true(picker.hours.children[3].selected);
    });

    QUnit.test('set_time - 12 hour clock', (assert) => {
        picker = new TimepickerWidget(elem, { clock: 12 });
        picker.show_dropdown();

        picker.hours.children[20].elem.trigger('click');
        picker.minutes.children[2].elem.trigger('click');

        assert.strictEqual(picker.elem.val(), '08:10PM');
        assert.strictEqual(picker.dd_elem.css('display'), 'none');
    });

    QUnit.module('mobile view', (hooks) => {
        const orig_width = $.fn.width;

        hooks.beforeEach(() => {
            $.fn.width = function (...args) {
                if (this[0] === window && args.length === 0) {
                    return 500;
                }
                return orig_width.apply(this, args);
            };
        });
        hooks.afterEach(() => {
            $.fn.width = orig_width;
        });

        // The stylesheet decides visibility by media query, the viewport of
        // the test browser is wide, so the inline styles set are checked.
        QUnit.test('switch between hours and minutes', (assert) => {
            picker = new TimepickerWidget(elem, {});
            picker.show_dropdown();

            const to_minute = $.Event('click');
            picker.hours.minutes_btn.trigger(to_minute);
            assert.true(to_minute.isDefaultPrevented());
            assert.strictEqual(picker.hours.container_elem[0].style.display, 'none');
            assert.notStrictEqual(picker.minutes.container_elem[0].style.display, 'none');

            const to_hour = $.Event('click');
            picker.minutes.hours_btn.trigger(to_hour);
            assert.true(to_hour.isDefaultPrevented());
            assert.notStrictEqual(picker.hours.container_elem[0].style.display, 'none');
            assert.strictEqual(picker.minutes.container_elem[0].style.display, 'none');
        });

        QUnit.test('set_time resets visibility', (assert) => {
            picker = new TimepickerWidget(elem, {});
            picker.show_dropdown();
            picker.hours.children[1].elem.trigger('click');
            picker.hours.minutes_btn.trigger('click');
            picker.minutes.children[1].elem.trigger('click');

            assert.strictEqual(picker.elem.val(), '01:05');
            assert.notStrictEqual(picker.hours.container_elem[0].style.display, 'none');
            assert.strictEqual(picker.minutes.container_elem[0].style.display, 'none');
        });
    });

    QUnit.module('keypress', () => {
        QUnit.test('24 hour clock', (assert) => {
            picker = new TimepickerWidget(elem, {});
            picker.elem.trigger('focus');
            keypress('A', '1', '3', '2', '5', 'A', 'M', '7');
            assert.strictEqual(picker.elem.val(), '13:25');
            assert.strictEqual(picker.dd_elem.css('display'), 'none');
        });

        QUnit.test('12 hour clock', (assert) => {
            picker = new TimepickerWidget(elem, { clock: 12 });
            picker.elem.trigger('focus');
            keypress('0', '1', '2', '5', 'Q', 'A', 'x', 'M', 'M');
            assert.strictEqual(picker.elem.val(), '01:25AM');
            assert.strictEqual(picker.dd_elem.css('display'), 'none');
        });

        QUnit.test('Enter hides dropdown', (assert) => {
            picker = new TimepickerWidget(elem, {});
            picker.elem.trigger('focus');
            assert.strictEqual(picker.dd_elem.css('display'), 'block');
            keypress('Enter');
            assert.strictEqual(picker.dd_elem.css('display'), 'none');
            assert.strictEqual(picker.elem.val(), '');
        });
    });

    QUnit.module('validate', () => {
        QUnit.test('24 hour clock', (assert) => {
            picker = new TimepickerWidget(elem, {});
            picker.elem.val('16:35');
            picker.validate();
            assert.strictEqual(picker.elem.val(), '16:35');
            assert.true(picker.hours.children[16].previously_selected);
            assert.true(picker.minutes.children[7].previously_selected);
        });

        QUnit.test('12 hour clock', (assert) => {
            picker = new TimepickerWidget(elem, { clock: 12 });
            picker.elem.val('03:15pm');
            picker.validate();
            assert.strictEqual(picker.elem.val(), '03:15PM');
            assert.true(picker.hours.children[15].previously_selected);

            picker.elem.val('03:15am');
            picker.validate();
            assert.strictEqual(picker.elem.val(), '03:15AM');
            assert.true(picker.hours.children[3].previously_selected);
        });

        QUnit.test('12 hour clock - 12am selects the AM 00 hour', (assert) => {
            picker = new TimepickerWidget(elem, { clock: 12 });
            picker.elem.val('12:30am');
            picker.validate();
            assert.strictEqual(picker.elem.val(), '00:30AM');
            assert.true(picker.hours.children[0].previously_selected);
            assert.false(picker.hours.children[12].previously_selected);
        });

        QUnit.test('12 hour clock - 12pm selects the PM 00 hour', (assert) => {
            picker = new TimepickerWidget(elem, { clock: 12 });
            picker.elem.val('12:30pm');
            picker.elem.trigger('keyup');
            assert.strictEqual(picker.elem.val(), '00:30PM');
            assert.true(picker.hours.children[12].previously_selected);
            assert.true(picker.minutes.children[6].previously_selected);
        });

        QUnit.test('no match', (assert) => {
            picker = new TimepickerWidget(elem, {});
            picker.elem.val('1:35U');
            picker.validate();
            picker.clock = 12;
            picker.elem.val('1j8:23AM');
            picker.validate();
            for (const hour of picker.hours.children) {
                assert.false(hour.selected);
            }
        });

        QUnit.test('minute not matching step', (assert) => {
            picker = new TimepickerWidget(elem, {});
            picker.minutes.children[2].selected = true;
            picker.elem.val('10:07');
            picker.validate();
            assert.true(picker.hours.children[10].selected);
            for (const minute of picker.minutes.children) {
                assert.false(minute.selected);
            }
        });
    });

    QUnit.test('TimepickerButton', (assert) => {
        const parent = new TimepickerButtonContainer(null, $('<div />'));
        const button = new TimepickerButton($('<div />'), parent);
        parent.children.push(button);

        button.previously_selected = true;
        assert.true(button.previously_selected);
        button.selected = true;
        assert.true(button.selected);
        assert.false(button.previously_selected);

        parent.mark_previously_selected();
        assert.false(button.selected);
        assert.true(button.previously_selected);

        parent.mark_previously_selected();
        assert.true(button.previously_selected);
    });

    QUnit.test('destroy', (assert) => {
        picker = new TimepickerWidget(elem, {});
        const popper = picker.popper;
        const dd_elem = picker.dd_elem;
        const hour = picker.hours.children[1];

        picker.destroy();

        assert.true(popper.destroyed);
        assert.notOk($.contains(document, dd_elem[0]));
        hour.elem.trigger('click');
        assert.strictEqual(picker.hour, '');
        picker = null;
    });

    QUnit.test('unload without ts destroys', (assert) => {
        picker = new TimepickerWidget(elem, {});
        const popper = picker.popper;
        picker.unload();
        assert.true(popper.destroyed);
        picker = null;
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
            TimepickerWidget.initialize();
            picker = elem.data('yafowil-timepicker');
            assert.strictEqual(attached.length, 1);
            assert.strictEqual(attached[0].inst, picker);
            assert.strictEqual(attached[0].el[0], elem[0]);
        });

        QUnit.test('unload is deprecated and destroys', (assert) => {
            picker = new TimepickerWidget(elem, {});
            const popper = picker.popper;
            picker.unload();
            assert.deepEqual(deprecated, [
                [
                    'yafowil.widget.timepicker.unload',
                    'yafowil.widget.timepicker.destroy',
                    'yafowil 2.1',
                ],
            ]);
            assert.true(popper.destroyed);
            picker = null;
        });
    });

    QUnit.module('register_timepicker_array_subscribers', () => {
        QUnit.test('without array widget', (assert) => {
            assert.strictEqual(register_timepicker_array_subscribers(), undefined);
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
            register_timepicker_array_subscribers();

            on_add(null, container);
            picker = elem.data('yafowil-timepicker');
            assert.ok(picker instanceof TimepickerWidget);
        });
    });
});
