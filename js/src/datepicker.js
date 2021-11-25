/* jslint browser: true */
/* global jQuery, yafowil */
/* 
 * yafowil datepicker widget
 * 
 * Requires: vanillajs-datepicker
 * Optional: bdajax
 */

import $ from 'jquery';
import Datepicker from '../../src/yafowil/widget/datetime/resources/Datepicker.js';
// import de from '../../src/yafowil/widget/datetime/resources/i18n/locales/de.js';
// Object.assign(Datepicker.locales, de);

export class DatePicker {

    static initialize(context) {
        $('input.datepicker', context).each(function() {
            let elem = $(this);
            new DatePicker(elem);
        });
    }

    constructor(elem) {
        this.elem = elem;

        this.datepicker = new Datepicker(this.elem[0], {
            orientation: 'bottom',
            buttonClass: 'bs4-btn',
            weekStart: 1,
            todayHighlight: true,
            language: "de"
        });
    }
}