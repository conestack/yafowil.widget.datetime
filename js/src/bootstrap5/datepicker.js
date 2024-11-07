import $ from 'jquery';

// Datepicker base class is global (from vanillajs-datepicker).
export class DatepickerWidget extends Datepicker {

    /**
     * Initializes each widget in the given DOM context.
     * 
     * @param {HTMLElement} context - DOM context for initialization.
     */
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

    /**
     * @param {jQuery} elem - The widget input element.
     * @param {string} locale - The locale for the datepicker.
     * @param {object} opts - Additional options for the datepicker.
     */
    constructor(elem, locale, opts={}) {
        let opts_ = {
            language: locale,
            orientation: 'bottom',
            buttonClass: 'btn',
            todayHighlight: true,
            autohide: true
        };

        // Calculate the lower edge of the element
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

        this.adapt();

        // Create trigger button
        this.trigger = $(`<button />`)
            .addClass('datepicker-trigger btn btn-outline-secondary')
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

        let created_event = $.Event('datepicker_created', {widget: this});
        this.elem.trigger(created_event);
    }

    /**
     * Adjusts the UI elements of the datepicker for Bootstrap5.
     */
    adapt() {
        const p_el = $(this.picker.element);
        $('.datepicker-picker', p_el).addClass('card');
        const header = $('.datepicker-header', p_el).addClass('card-header bg-primary');
        $('.btn', header).addClass('btn-primary');
        $('.datepicker-main', p_el).addClass('card-body');
    }

    /**
     * Cleans up event handlers.
     */
    unload() {
        this.trigger.off('mousedown touchstart', this.toggle_picker);
        this.elem.off('focus', this.prevent_hide);
    }

    /**
     * Toggles the visibility of the datepicker.
     * 
     * @param {Event} evt - The event that triggered this function.
     */
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

// Locale options
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

/**
 * Re-initializes widget on array add event.
 */
function datepicker_on_array_add(inst, context) {
    DatepickerWidget.initialize(context);
}

/**
 * Registers subscribers to yafowil array events.
 */
export function register_datepicker_array_subscribers() {
    if (window.yafowil_array === undefined) {
        return;
    }
    window.yafowil_array.on_array_event('on_add', datepicker_on_array_add);
}