import $ from 'jquery';

import {DateTimeWidget} from './datetime.js';
import {Timepicker} from './timepicker.js';

export * from './datetime.js';
export * from './timepicker.js';

$(function() {
    if (window.ts !== undefined) {
        ts.ajax.register(DateTimeWidget.initialize, true);
    } else {
        DateTimeWidget.initialize();
    }
});
