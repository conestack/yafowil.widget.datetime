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

        // patch onClickOutside to prevent outside touch when scrolling
        this.onTouchOutside = this.onTouchOutside.bind(this);
        $(document).off('touchstart touchend', this.onTouchOutside).on('touchstart touchend', this.onTouchOutside);
    }

    onTouchOutside(e) {
        // let elem = $(document.activeElement);
        // console.log($('input:focus'));
        if (this.elem.is(':focus')) {
            console.log('FOCUS')
            // this.show();
        }
    }

    hide() {
        console.log('WHATTUP YO')
        if (this.inline) {
            return;
        }

        this.picker.hide();
        this.picker.update().changeView(this.config.startView).render();
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
