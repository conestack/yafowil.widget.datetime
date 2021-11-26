import $ from 'jquery';
import Datepicker from '../../src/yafowil/widget/datetime/resources/Datepicker';
import {Timepicker} from './timepicker';
// import de from '../../src/yafowil/widget/datetime/resources/i18n/locales/de.js';
// Object.assign(Datepicker.locales, de);

export class DateTimeWidget {

    static initialize(context) {
        $('input.datepicker', context).each(function() {
            let elem = $(this);
            let picker = new Datepicker(elem[0], {
                orientation: 'bottom',
                buttonClass: 'bs4-btn',
                weekStart: 1,
                todayHighlight: true
            });
            let btn_trigger = $(`<button>...</button>`)
                .addClass('datepicker-trigger btn btn-default');
            elem.after(btn_trigger);

            let toggle_view = toggle_picker.bind(picker);

            btn_trigger.off('mousedown', toggle_view).on('mousedown', toggle_view);
            btn_trigger.on('click', (e) => {e.preventDefault();});

            function toggle_picker(evt) {
                evt.preventDefault();
                evt.stopPropagation();

                if ($(picker.picker.element).hasClass('active')) {
                    picker.hide();
                } else {
                    picker.show();
                }
            }
        });
        $('input.timepicker', context).each(function() {
            let elem = $(this);
            new Timepicker(elem);
        });
    }
}