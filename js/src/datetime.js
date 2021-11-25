import $ from 'jquery';
import Datepicker from '../../src/yafowil/widget/datetime/resources/Datepicker';
import {Timepicker} from './timepicker';
// import de from '../../src/yafowil/widget/datetime/resources/i18n/locales/de.js';
// Object.assign(Datepicker.locales, de);

export class DateTimeWidget {

    static initialize(context) {
        $('input.datepicker', context).each(function() {
            let elem = $(this);
            new Datepicker(elem[0], {
                orientation: 'bottom',
                buttonClass: 'bs4-btn',
                weekStart: 1,
                todayHighlight: true
            });
        });
        $('input.timepicker', context).each(function() {
            let elem = $(this);
            new Timepicker(elem);
        });
    }
}