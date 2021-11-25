import $ from 'jquery';

import {DatePicker} from './datepicker';
import {TimePickerWidget} from './timepicker';

export * from './datepicker.js';
export * from './timepicker.js';
export * from '../../src/yafowil/widget/datetime/resources/Datepicker.js';

$(function() {
    if (window.ts !== undefined) {
        ts.ajax.register(DatePicker.initialize, true);
        ts.ajax.register(TimePickerWidget.initialize, true);
    } else {
        DatePicker.initialize();
        TimePickerWidget.initialize();
    }
});