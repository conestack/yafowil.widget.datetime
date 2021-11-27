import $ from 'jquery';

import {DateTimeWidget} from './datetime.js';

export * from './timepicker.js';
export * from './datetime.js';

$(function() {
    if (window.ts !== undefined) {
        ts.ajax.register(DateTimeWidget.initialize, true);
    } else {
        DateTimeWidget.initialize();
    }
});
