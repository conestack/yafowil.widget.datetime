import $ from 'jquery';
import {Timepicker} from './timepicker.js';

export class DateTimeWidget {

    static initialize(context) {
        $('input.datepicker', context).each(function() {
            let elem = $(this);

            // let locale = elem.data('locale');
            let locale = "de";

            let picker = new Datepicker(elem[0], {
                orientation: 'bottom',
                buttonClass: 'btn',
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
            new Timepicker(elem, {
                lang: "de",
                hour: "Stunde",
                minute: "Minute",
                timeFormat: "eu"
            });
        });
    }
}
