/* jslint browser: true */
/* global jQuery, yafowil */
/* 
 * yafowil timepicker widget
 */

import $ from 'jquery';
// import de from '../../src/yafowil/widget/datetime/resources/i18n/locales/de.js';
// Object.assign(Datepicker.locales, de);

export class TimePickerWidget {

    static initialize(context) {
        $('input.timepicker', context).each(function() {
            let elem = $(this);
            new TimePickerWidget(elem);
        });
    }

    constructor(elem) {
        this.elem = elem;

        this.dropdown = $(`<div class="timepicker-dropdown"/>`);
        this.dropdown_container = $(`<div class="timepicker-container"/>`);

        this.hours_content = $(`<div />`)
            .addClass('hours-content');
        this.hours_elem = $('<div />')
            .addClass('timepicker-hours')
            .append('<div class="header">Hours</div>')
            .append(this.hours_content);
        this.minutes_elem = $('<div />')
            .addClass('timepicker-minutes')
            .append('<div class="header">Minutes</>')
            .append('<div class="minutes-content" />');

        for (let i = 1; i < 24; i++) {
            this.hours_content.append(
                $(`<div class="cell">${i}</div>`)
            );
        }

        this.elem.after(this.dropdown);
        this.dropdown.append(this.dropdown_container);
        this.dropdown_container.append(this.hours_elem).append(this.minutes_elem);

        this.show_dropdown = this.show_dropdown.bind(this);
        this.elem.on('focus', this.show_dropdown);
    }

    show_dropdown() {
        this.dropdown.show();
    }
}