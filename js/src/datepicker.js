import $ from 'jquery';

export class DatepickerSettings {
    static default_locale = 'en';
    static locales = {
        en: {
            weekStart: 1,
            format: 'mm.dd.yyyy'
        },
        de: {
            weekStart: 1,
            format: 'dd.mm.yyyy'
        }
    };

    settings(locale) {
        let locales = this.constructor.locales;
        let settings = locales[locale];
        return settings || locales[this.constructor.default_locale];
    }
}

let datepicker_settings = new DatepickerSettings();
export {datepicker_settings};

// Datepicker base class is global.
export class DatepickerWidget extends Datepicker {

    static initialize(context) {
        $('input.datepicker', context).each(function() {
            let elem = $(this);
            new DatepickerWidget(elem, elem.data('date-locale'));
        });
    }

    constructor(elem, locale, opts={}) {
        let opts_ = datepicker_settings.settings(locale);
        Object.assign(opts_, {
            language: locale,
            orientation: 'bottom',
            buttonClass: 'btn',
            todayHighlight: true,
            autohide: true
        });
        Object.assign(opts_, opts);
        super(elem[0], opts_);

        let trigger = $(`<button>...</button>`)
            .addClass('datepicker-trigger btn btn-default');
        elem.after(trigger);

        this.toggle_picker = this.toggle_picker.bind(this);
        trigger.off('mousedown').on('mousedown', this.toggle_picker);
        trigger.on('click', (e) => {e.preventDefault();});
    }

    toggle_picker(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if (this.active) {
            this.hide();
        } else {
            this.show();
        }
    }
}
