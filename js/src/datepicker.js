import $ from 'jquery';

// Datepicker base class is global.
export class DatepickerWidget extends Datepicker {

    static initialize(context) {
        $('input.datepicker', context).each(function() {
            let elem = $(this);
            let id = elem.attr('id');
            if (id && id.includes('TEMPLATE')) {
                return;
            }
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

        elem.data('yafowil-datepicker', this);
        this.elem = elem;

        this.trigger = $(`<button />`)
            .addClass('datepicker-trigger btn btn-default')
            .text('...')
            .insertAfter(elem);

        this.toggle_picker = this.toggle_picker.bind(this);
        this.trigger
            .off('mousedown touchstart', this.toggle_picker)
            .on('mousedown touchstart', this.toggle_picker);
        this.trigger.on('click', (e) => {e.preventDefault()});
    }

    unload() {
        this.trigger.off('mousedown touchstart', this.toggle_picker);
        this.elem.off('focus', this.prevent_hide);
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

//////////////////////////////////////////////////////////////////////////////
// yafowil.widget.array integration
//////////////////////////////////////////////////////////////////////////////

function datepicker_on_array_add(inst, context) {
    DatepickerWidget.initialize(context);
}

$(function() {
    if (yafowil_array === undefined) {
        return;
    }
    yafowil_array.on_array_event('on_add', datepicker_on_array_add);
});
