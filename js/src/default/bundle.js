import $ from 'jquery';
import { DatepickerWidget, register_datepicker_array_subscribers } from './datepicker.js';
import { register_timepicker_array_subscribers, TimepickerWidget } from './timepicker.js';

export * from './datepicker.js';
export * from './timepicker.js';

$(() => {
    if (window.ts !== undefined) {
        ts.ajax.register(DatepickerWidget.initialize, true);
        ts.ajax.register(TimepickerWidget.initialize, true);
    } else if (window.bdajax !== undefined) {
        bdajax.register(DatepickerWidget.initialize, true);
        bdajax.register(TimepickerWidget.initialize, true);
    } else {
        DatepickerWidget.initialize();
        TimepickerWidget.initialize();
    }
    register_datepicker_array_subscribers();
    register_timepicker_array_subscribers();
});
