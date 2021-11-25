/* jslint browser: true */
/* global jQuery, yafowil */
/* 
 * yafowil datepicker widget
 * 
 * Requires: jquery ui datepicker
 * Optional: bdajax
 */

import $ from 'jquery';
import Datepicker from '../../src/yafowil/widget/datetime/resources/Datepicker.js';

export class DatePicker {

    static initialize(context) {
        $('input.datepicker', context).each(function() {
            let elem = $(this);
            new DatePicker(elem);
        });
    }

    constructor(elem) {
        this.elem = elem;
        console.log('AAAAAA');
        // this.foo = new Datepicker(elem, {});
        const element = document.querySelector('input[name="yafowil.widget.datetime.date.yafowil.widget.datetime.date.date"]');
        const datepicker = new Datepicker(element, {
        });
    }
}