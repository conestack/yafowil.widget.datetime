import $ from 'jquery';
// Sets the global Datepicker base class, must be imported before the widget.
import 'vanillajs-datepicker';
import * as bs5_datepicker from '../src/bootstrap5/datepicker.js';
import * as bs5_timepicker from '../src/bootstrap5/timepicker.js';
import * as default_datepicker from '../src/default/datepicker.js';
import * as default_timepicker from '../src/default/timepicker.js';

/**
 * Import a bundle and capture its DOM ready callback instead of letting
 * jQuery run it once, so every registration branch can be exercised.
 */
async function import_bundle(load) {
    const orig_ready = $.fn.ready;
    let on_ready;
    $.fn.ready = function (fn) {
        on_ready = fn;
        return this;
    };
    try {
        const bundle = await load();
        return { bundle, on_ready };
    } finally {
        $.fn.ready = orig_ready;
    }
}

const variants = [
    [
        'default',
        () => import('../src/default/bundle.js'),
        { ...default_datepicker, ...default_timepicker },
    ],
    [
        'bootstrap5',
        () => import('../src/bootstrap5/bundle.js'),
        { ...bs5_datepicker, ...bs5_timepicker },
    ],
];

for (const [name, load, expected] of variants) {
    QUnit.module(`${name} bundle`, (hooks) => {
        let bundle;
        let on_ready;
        let array_events;

        hooks.before(async () => {
            ({ bundle, on_ready } = await import_bundle(load));
        });
        hooks.beforeEach(() => {
            array_events = [];
            window.yafowil_array = {
                on_array_event: (evt_name) => {
                    array_events.push(evt_name);
                },
                inside_template: () => false,
            };
        });
        hooks.afterEach(() => {
            delete window.ts;
            delete window.bdajax;
            delete window.yafowil_array;
        });

        QUnit.test('exports', (assert) => {
            assert.deepEqual(Object.keys(bundle).sort(), Object.keys(expected).sort());
            for (const [key, value] of Object.entries(expected)) {
                assert.strictEqual(bundle[key], value, key);
            }
        });

        QUnit.test('registers with treibstoff', (assert) => {
            const registered = [];
            window.ts = {
                ajax: {
                    register: (func, instant) => {
                        registered.push([func, instant]);
                    },
                },
            };
            on_ready();
            assert.deepEqual(registered, [
                [bundle.DatepickerWidget.initialize, true],
                [bundle.TimepickerWidget.initialize, true],
            ]);
            assert.deepEqual(array_events, ['on_add', 'on_add']);
        });

        QUnit.test('registers with bdajax', (assert) => {
            const registered = [];
            window.bdajax = {
                register: (func, instant) => {
                    registered.push([func, instant]);
                },
            };
            on_ready();
            assert.deepEqual(registered, [
                [bundle.DatepickerWidget.initialize, true],
                [bundle.TimepickerWidget.initialize, true],
            ]);
            assert.deepEqual(array_events, ['on_add', 'on_add']);
        });

        QUnit.test('initializes without ajax framework', (assert) => {
            const container = $('<div />').appendTo('body');
            const date = $('<input type="text" class="datepicker" />').appendTo(container);
            const time = $('<input type="text" class="timepicker" />').appendTo(container);
            on_ready();
            const date_widget = date.data('yafowil-datepicker');
            const time_widget = time.data('yafowil-timepicker');
            assert.ok(date_widget instanceof bundle.DatepickerWidget);
            assert.ok(time_widget instanceof bundle.TimepickerWidget);
            assert.deepEqual(array_events, ['on_add', 'on_add']);
            date_widget.destroy();
            time_widget.destroy();
            container.remove();
        });
    });
}
