import $ from 'jquery';

// Datepicker base class is global.
export class DatepickerWidget extends Datepicker {

    static initialize(context) {
        $('input.datepicker', context).each(function() {
            let elem = $(this);
            new DatepickerWidget(elem, elem.data('date-locale'));
        });
    }

    constructor(elem, locale, opts={}) {
        let opts_ = {
            language: locale,
            orientation: 'bottom',
            buttonClass: 'btn',
            todayHighlight: true,
            autohide: true
        };

        let lower_edge = elem.offset().top + elem.outerHeight() + 250;
        if (lower_edge > $(document).height()) {
            opts_.orientation = "top";
        }

        let locale_options = DatepickerWidget.locale_options;
        Object.assign(opts_, locale_options[locale] || locale_options.en);
        Object.assign(opts_, opts);
        super(elem[0], opts_);

        this.elem = elem;

        let trigger = this.trigger = $(`<button>...</button>`)
            .addClass('datepicker-trigger btn btn-default');
        elem.after(trigger);

        this.toggle_picker = this.toggle_picker.bind(this);
        this.trigger
            .off('mousedown touchstart', this.toggle_picker)
            .on('mousedown touchstart', this.toggle_picker);
        this.trigger.on('click', (e) => {e.preventDefault()});

        /**
          * Patch for onClickOutside function in anonymous Datepicker function.
          * Allows the user to adjust the dropdown position on mobile
          * by preventing the default hide() on initial touchstart after focus.
        */
        this.allow_hide = true;
        this.enable_hide = this.enable_hide.bind(this);
        this.prevent_hide = this.prevent_hide.bind(this);
        this.enable_hide();

        this.elem.on('focus', this.prevent_hide);
        $(document).on('touchmove touchend', this.enable_hide);
    }

    unload() {
        this.trigger.off('mousedown touchstart', this.toggle_picker);
        this.elem.off('focus', this.prevent_hide);
        $(document).off('touchmove touchend', this.enable_hide);
    }

    prevent_hide(e) {
        this.allow_hide = false;
    }

    enable_hide(e) {
        this.allow_hide = true;
    }

    hide() {
        if (this.allow_hide) {
            super.hide();
        }
    }

    toggle_picker(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        if (this.picker.active || this.active) {
            this.hide();
            this.elem.blur();
        } else {
            this.show();
        }
    }
}

DatepickerWidget.locale_options = {
    en: {
        weekStart: 1,
        format: 'mm.dd.yyyy'
    },
    de: {
        weekStart: 1,
        format: 'dd.mm.yyyy'
    }
};
