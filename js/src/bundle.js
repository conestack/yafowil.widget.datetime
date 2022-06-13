import $ from 'jquery';

import {DatepickerWidget} from './datepicker.js';
import {TimepickerWidget} from './timepicker.js';

export * from './datepicker.js';
export * from './timepicker.js';

$(function() {
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
});
