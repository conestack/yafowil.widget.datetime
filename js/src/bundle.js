import $ from 'jquery';

import {DatePicker} from './widget';

export * from './widget.js';
export * from '../../src/yafowil/widget/datetime/resources/Datepicker.js';

$(function() {
    if (window.ts !== undefined) {
        ts.ajax.register(DatePicker.initialize, true);
    } else {
        DatePicker.initialize();
    }
});