import $ from 'jquery';

// Datepicker base class is global.
export class DatepickerWidget extends Datepicker {

    static initialize(context) {
        $('input.datepicker', context).each(function() {
            let elem = $(this);
            if (window.yafowil_array !== undefined &&
                window.yafowil_array.inside_template(elem)) {
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
        this.elem.on('changeDate', () => {
            this.elem.trigger('change');
        });

        if (window.ts !== undefined) {
            ts.ajax.attach(this, elem);
        }
        
        let created_event = $.Event('datepicker_created', {widget: this});
        this.elem.trigger(created_event);
    }

    unload() {
        if (window.ts !== undefined) {
            ts.deprecate(
                'yafowil.widget.datepicker.unload',
                'yafowil.widget.datepicker.destroy',
                'yafowil 2.1'
            );
        }
        this.destroy();
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

    destroy() {
        this.trigger.off('mousedown touchstart', this.toggle_picker);
        this.picker.detach();
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

export function register_datepicker_array_subscribers() {
    if (window.yafowil_array === undefined) {
        return;
    }
    window.yafowil_array.on_array_event('on_add', datepicker_on_array_add);
}
