import $ from 'jquery';
import Datepicker from '../../src/yafowil/widget/datetime/resources/Datepicker';
import {Timepicker} from './timepicker';
import date_de from '../../src/yafowil/widget/datetime/resources/i18n/locales/de.js';
Object.assign(Datepicker.locales, date_de);
import time_de from './locales/de.js';
import time_us from './locales/us.js';
import time_en from './locales/base_locales.js';

export class DateTimeWidget {

    static initialize(context) {
        $('input.datepicker', context).each(function() {
            let elem = $(this);

            // let locale = elem.data('locale');
            let locale = "de";

            let picker = new Datepicker(elem[0], {
                orientation: 'bottom',
                buttonClass: 'bs4-btn',
                weekStart: 1,
                todayHighlight: true,
                language: locale
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
            elem.attr('spellcheck', false);

            // let locales = [time_de, time_en, time_us];
            // let language;
            // for (let locale of locales) {
            //     if (elem.data('locale') === locale.lang) {
            //         language = locale;
            //     }
            // }

            let language = time_us;
            new Timepicker(elem, language);
        });
    }
}