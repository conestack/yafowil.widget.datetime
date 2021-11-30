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

        let trigger = $(`<button>...</button>`)
            .addClass('datepicker-trigger btn btn-default');
        elem.after(trigger);

        this.toggle_picker = this.toggle_picker.bind(this);
        trigger.off('mousedown').on('mousedown', this.toggle_picker);
        trigger.on('click', (e) => {e.preventDefault();});

        // patch for scrolling on mobile device
        this.show_touchmove = this.show_touchmove.bind(this);
        this.elem.on('focus', this.show_touchmove);
        this.hide_touchmove = this.hide_touchmove.bind(this);
        this.elem.on('focusout', this.hide_touchmove);
    }

    show_touchmove() {
        // $(this.pickerElement).css('display', 'block');
        this.picker.show();
    }

    hide_touchmove() {
        // $(this.pickerElement).css('display', 'none');
    }

    toggle_picker(evt) {
        // $(this.pickerElement).css('display', 'unset');
        evt.preventDefault();
        evt.stopPropagation();
        if (this.active) {
            this.hide();
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
