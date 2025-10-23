import $ from 'jquery';
import Popper from 'popper';

export class TimepickerButton {

    /**
     * @param {jQuery} elem - The button element.
     * @param {TimepickerButtonContainer} parent - The parent container for the button.
     */
    constructor(elem, parent) {
        this.elem = elem;
        this.parent = parent;
    }

    /**
     * Gets the selected state of the button.
     * @returns {boolean} - True if the button is selected, otherwise false.
     */
    get selected() {
        return this.elem.hasClass('selected');
    }

    /**
     * Sets the selected state of the button.
     * @param {boolean} value
     */
    set selected(value) {
        if (value) {
            this.parent.remove_previously_selected();
            this.elem.addClass('selected');
        } else {
            this.elem.removeClass('selected');
        }
    }

    /**
     * Gets the previously selected state of the button.
     * @returns {boolean}
     */
    get previously_selected() {
        return this.elem.hasClass('prev-selected');
    }

    /**
     * Sets the previously selected state of the button.
     * @param {boolean} value
     */
    set previously_selected(value) {
        if (value) {
            this.elem.addClass('prev-selected');
        } else {
            this.elem.removeClass('prev-selected');
        }
    }
}

export class TimepickerButtonContainer {

    /**
     * @param {TimepickerWidget} picker - The timepicker widget.
     * @param {jQuery} elem - The container element for buttons.
     */
    constructor(picker, elem) {
        this.picker = picker;
        this.elem = elem;
        this.children = [];
    }

    /**
     * Unloads all buttons by removing event handlers.
     */
    unload_all() {
        for (let child of this.children) {
            child.elem.off('click', child.on_click);
        }
    }

    /**
     * Unselects all buttons in the container.
     */
    unselect_all() {
        for (let child of this.children) {
            child.selected = false;
        }
    }

    /**
     * Marks the currently selected button as previously selected and unselects it.
     */
    mark_previously_selected() {
        for (let child of this.children) {
            if (child.selected) {
                child.previously_selected = true;
                child.selected = false;
            }
        }
    }

    /**
     * Removes the previously selected state from all buttons.
     */
    remove_previously_selected() {
        for (let child of this.children) {
            child.previously_selected = false;
        }
    }
}

export class TimepickerHour extends TimepickerButton {

    /**
     * @param {TimepickerHours} hours - The parent hours container.
     * @param {jQuery} container - The container element for this hour button.
     * @param {number} value - The hour value.
     * @param {string} period - The period (AM/PM) for 12-hour format.
     */
    constructor(hours, container, value, period) {
        let elem = $('<div />')
            .addClass('cell')
            .text(new String(value).padStart(2, '0'))
            .appendTo(container);
        super(elem, hours);
        this.hours = hours;
        this.picker = hours.picker;
        this.period = period;
        this.on_click = this.on_click.bind(this);
        this.elem.on('click', this.on_click);
    }

    /**
     * Handles the click event for the hour button.
     * @param {Event} e - The click event.
     */
    on_click(e) {
        let hour = this.elem.text();
        this.hours.unselect_all();
        this.selected = true;
        this.picker.period = this.period;
        this.picker.hour = hour;
    }
}

export class TimepickerMinute extends TimepickerButton {

    /**
     * @param {TimepickerMinutes} minutes - The parent minutes container.
     * @param {jQuery} container - The container element for this minute button.
     * @param {number} value - The minute value.
     */
    constructor(minutes, container, value) {
        let elem = $('<div />')
            .addClass('cell')
            .text(new String(value).padStart(2, '0'))
            .appendTo(container);
        super(elem, minutes);
        this.minutes = minutes;
        this.picker = minutes.picker;
        this.on_click = this.on_click.bind(this);
        this.elem.on('click', this.on_click);
    }

    /**
     * Handles the click event for the minute button.
     * @param {Event} e - The click event.
     */
    on_click(e) {
        this.minutes.unselect_all();
        this.selected = true;
        this.picker.minute = this.elem.text();
    }
}

export class TimepickerHours extends TimepickerButtonContainer {

    /**
     * @param {TimepickerWidget} picker - The timepicker widget.
     * @param {jQuery} container - The container element for hour buttons.
     */
    constructor(picker, container) {
        super(picker, $('<div />').addClass('card-body hours-content'));
        if (picker.clock === 24) {
            this.create_clock_24();
        } else if (picker.clock === 12) {
            this.create_clock_12();
        }
        this.to_minute = this.to_minute.bind(this);
        let header = $('<div />')
            .addClass('header card-header bg-primary text-white')
            .text(picker.translate('hour'));
        this.minutes_btn = $('<button />')
            .append($('<i class="bi bi-caret-right"/>'))
            .append($('<span>Minute</span>'))
            .addClass('to_minutes d-block d-sm-none btn p-0 float-end')
            .on('click', this.to_minute)
            .appendTo(header);
        this.container_elem = $('<div />')
            .addClass('card timepicker-hours')
            .append(header)
            .append(this.elem)
            .appendTo(container);
    }

    /**
     * Creates hour buttons for a 24-hour format clock.
     */
    create_clock_24() {
        for (let i = 0; i < 24; i++) {
            this.children.push(new TimepickerHour(this, this.elem, i));
        }
    }

    /**
     * Creates hour buttons for a 12-hour format clock.
     */
    create_clock_12() {
        $('<span />').addClass('am').text('A.M.').appendTo(this.elem);
        let hours_am = $('<div />').addClass('am').appendTo(this.elem);
        $('<span />').addClass('pm').text('P.M.').appendTo(this.elem);
        let hours_pm = $('<div />').addClass('pm').appendTo(this.elem);
        for (let i = 0; i < 12; i++) {
            this.children.push(new TimepickerHour(this, hours_am, i, 'AM'));
        }
        for (let i = 0; i < 12; i++) {
            this.children.push(new TimepickerHour(this, hours_pm, i, 'PM'));
        }
        this.elem.css('grid-template-rows', '1fr 1fr');
        this.elem.css('grid-template-columns', 'auto 1fr');
    }

    /**
     * Navigates to the minute selection interface.
     * @param {Event} e - The click event.
     */
    to_minute(e) {
        e.preventDefault();
        this.container_elem.hide();
        this.picker.minutes.container_elem.show();
    }
}

export class TimepickerMinutes extends TimepickerButtonContainer {

    /**
     * @param {TimepickerWidget} picker - The timepicker widget.
     * @param {jQuery} container - The container element for minute buttons.
     * @param {number} step - The step for minute increments.
     */
    constructor(picker, container, step) {
        super(picker, $('<div />').addClass('card-body minutes-content'));
        this.step = step;
        let count = 60 / step;
        let columns = 0;
        if (count <= 32) {
            // calculate grid columns based on number of cells
            columns = Math.ceil(count / 4);
            let cols = '1fr '.repeat(Math.ceil(count / 4));
            this.elem.css(
                'grid-template-columns',
                cols
            );
        } else {
            columns = 10;
            this.elem.css(
                'grid-template-columns',
                '1fr '.repeat(10)
            );
            if (picker.clock === 24) {
                $('div.hours-content', picker.dd_elem).css({
                    'grid-template-columns': '1fr 1fr 1fr 1fr'
                });
            } else {
                $('div.am, div.pm', picker.dd_elem).css({
                    'grid-template-columns': '1fr 1fr 1fr 1fr'
                });
            }
        }
        this.columns_count = columns;

        for (let i = 0; i < count; i++) {
            this.children.push(new TimepickerMinute(this, this.elem, i * step));
        }
        this.to_hour = this.to_hour.bind(this);

        let header = $('<div />')
            .addClass('header card-header bg-primary text-white')
            .text(picker.translate('minute'));
        this.hours_btn = $('<button />')
            .append($('<i class="bi bi-caret-left"/>'))
            .append($('<span>Hour</span>'))
            .addClass('to_hours d-block d-sm-none btn p-0 float-end')
            .on('click', this.to_hour)
            .appendTo(header);
        this.container_elem = $('<div />')
            .addClass('card timepicker-minutes')
            .append(header)
            .append(this.elem)
            .appendTo(container);
    }

    /**
     * Navigates back to the hour selection interface.
     * @param {Event} e - The click event.
     */
    to_hour(e) {
        e.preventDefault();
        this.container_elem.hide();
        this.picker.hours.container_elem.show();
    }
}

export class TimepickerWidget {

    /**
     * Initializes each widget in the given DOM context.
     * 
     * @param {jQuery} context - DOM context for initialization.
     */
    static initialize(context) {
        $('input.timepicker', context).each(function() {
            let elem = $(this);
            if (window.yafowil_array !== undefined &&
                window.yafowil_array.inside_template(elem)) {
                return;
            }
            elem.attr('spellcheck', false);
            new TimepickerWidget(elem, {
                language: elem.data('time-locale'),
                clock: elem.data('time-clock'),
                step: elem.data('time-minutes_step')
            });
        });
    }

    /**
     * @param {jQuery} elem - The widget input element.
     * @param {Object} opts - Configuration options.
     */
    constructor(elem, opts) {
        elem.data('yafowil-timepicker', this);
        this.elem = elem;
        this.language = opts.language || 'en';
        this.clock = opts.clock || 24;

        this.period = null;
        this.hour = '';
        this.minute = '';
        if (opts.step <= 0 || opts.step > 60 || typeof opts.step !== 'number') {
            this.step = 5;
        } else {
            this.step = opts.step;
        }

        this.trigger_elem = $('<button />')
            .addClass('timepicker-trigger btn btn-outline-secondary')
            .text('...')
            .insertAfter(elem);

        let dd_elem = this.dd_elem = $('<div />')
            .addClass('timepicker-dropdown')
            .insertAfter(elem.closest('.input-group'));

        let dd_container = $('<div />')
            .addClass('timepicker-container card-group shadow')
            .appendTo(dd_elem);

        this.hours = new TimepickerHours(this, dd_container);
        this.minutes = new TimepickerMinutes(this, dd_container, this.step);

        this.calc_flex_basis(this.minutes.columns_count);

        this.validate();

        this.show_dropdown = this.show_dropdown.bind(this);
        this.elem.on('focus', this.show_dropdown);

        this.toggle_dropdown = this.toggle_dropdown.bind(this);
        this.trigger_elem.on('click', this.toggle_dropdown);

        this.hide_dropdown = this.hide_dropdown.bind(this);
        $(document).on('click', this.hide_dropdown);

        this.on_keypress = this.on_keypress.bind(this);
        this.elem.on('keypress', this.on_keypress);
        this.validate = this.validate.bind(this);
        this.elem.on('keyup', this.validate);

        this.popper = Popper.createPopper(this.elem[0], this.dd_elem[0], {
            placement: "bottom-start",
            modifiers: [
              {
                  name: 'preventOverflow',
                  options: {
                      boundary: 'viewport',
                      padding: 10,
                  },
              },
              {
                name: "flip",
                options: {
                  allowedAutoPlacements: ["top-start", "bottom-start"],
                  rootBoundary: "viewport"
                }
              }
            ]
        });

        let created_event = $.Event('timepicker_created', {widget: this});
        this.elem.trigger(created_event);

        if (window.ts !== undefined) {
            window.ts.ajax.attach(this, elem);
        }
    }

    /**
     * Calculates and sets the flex basis for hours and minutes containers based
     * on column counts.
     * @param {number} minutesColumns - The number of columns for minutes.
     */
    calc_flex_basis(minutesColumns) {
        let hoursColumns = 6;
        if (60 / this.step > 32) {
            if (this.clock === 24) {
                hoursColumns = 4;
            } else {
                hoursColumns = 5;
            }
        }
        if (minutesColumns < 2) {
            minutesColumns = 2; // ensure minimum width of minutes DOM element
        }
        const total_columns = hoursColumns + minutesColumns;
        // Calculate flex-basis for Hours and Minutes cards
        const hoursFlexBasis = (hoursColumns / total_columns) * 100;
        const minutesFlexBasis = (minutesColumns / total_columns) * 100;
        this.hours.container_elem.css('flex-basis', hoursFlexBasis.toFixed(2) + '%');
        this.minutes.container_elem.css('flex-basis', minutesFlexBasis.toFixed(2) + '%');
        // Calculate container width
        const containerWidth = `calc(${total_columns * 40}px + 4rem)`;
        this.dd_elem.css('width', containerWidth);
    }

    /**
     * Unloads the timepicker by removing event listeners and destroying the
     * popper instance (deprecated as of yafowil 2.1).
     */
    unload() {
        if (window.ts !== undefined) {
            ts.deprecate(
                'yafowil.widget.timepicker.unload',
                'yafowil.widget.timepicker.destroy',
                'yafowil 2.1'
            );
        }
        this.destroy();
    }

    /**
     * Gets the currently set hour.
     * @returns {string} - The current hour.
     */
    get hour() {
        return this._hour;
    }

    /**
     * Sets the hour and updates the time display.
     * @param {string} hour - The hour to set.
     */
    set hour(hour) {
        this._hour = hour;
        this.set_time();
    }

    /**
     * Gets the currently set minute.
     * @returns {string} - The current minute.
     */
    get minute() {
        return this._minute;
    }

    /**
     * Sets the minute and updates the time display.
     * @param {string} minute - The minute to set.
     */
    set minute(minute) {
        this._minute = minute;
        this.set_time();
    }

    /**
     * Updates the input element with the current hour and minute values.
     */
    set_time() {
        if (this.hour === '' || this.minute === '') {
            return;
        }
        if (this.clock === 24) {
            this.elem.val(`${this.hour}:${this.minute}`);
        } else if (this.clock === 12) {
            this.elem.val(`${this.hour}:${this.minute}${this.period}`);
        }
        this.elem.trigger('change');
        this.hour = '';
        this.minute = '';

        this.hours.mark_previously_selected();
        this.minutes.mark_previously_selected();

        if ($(window).width() <= 575) {
            // reset display properties of hours and minutes on mobile view
            this.reset_visibility();
        }
        this.dd_elem.hide();
    }

    /**
     * Resets the visibility of the hours and minutes containers.
     */
    reset_visibility() {
        this.hours.container_elem.show();
        this.minutes.container_elem.hide();
    }

    /**
     * Hides the dropdown when clicking outside of the timepicker.
     * @param {Event} e - The click event.
     */
    hide_dropdown(e) {
        if (e.target !== this.elem[0] && e.target !== this.trigger_elem[0]) {
            if ($(e.target).closest(this.dd_elem).length === 0) {
                this.dd_elem.hide();
                if (this.hour === '' || this.minute === '') {
                    this._hour = '';
                    this._minute = '';
                }
                this.hours.unselect_all();
                this.minutes.unselect_all();
            }
        }
    }

    /**
     * Shows the dropdown when the input element gains focus.
     * @param {Event} e - The focus event.
     */
    show_dropdown(e) {
        this.dd_elem.show();
        this.popper.forceUpdate();
    }

    /**
     * Toggles the visibility of the dropdown when the trigger button is clicked.
     * @param {Event} e - The click event.
     */
    toggle_dropdown(e) {
        e.preventDefault();
        this.dd_elem.toggle();
        this.popper.forceUpdate();
    }

    /**
     * Handles keypress events to allow input in the timepicker input field.
     * @param {Event} e - The keypress event.
     */
    on_keypress(e) {
        e.preventDefault();
        let val = this.elem.val();
        let cursor_pos = e.target.selectionStart;
        if (e.key === 'Enter') {
            this.dd_elem.hide();
            this.elem.blur();
        }

        if (cursor_pos <= 4) {
            if (e.key.match(new RegExp('[0-9]'))) {
                this.elem.val(val + e.key);
                if (cursor_pos === 2) {
                    this.elem.val(`${val}:${e.key}`);
                }
            }
        } else if (cursor_pos === 5 && this.clock === 12) {
            let correct = ['a', 'A', 'p', 'P'];
            if (correct.includes(e.key)) {
                this.elem.val(val + e.key);
            }
        } else if (cursor_pos === 6 && this.clock === 12) {
            if (e.key === 'm' || e.key === 'M') {
                this.elem.val(val + e.key);
            }
        };
    }

    /**
     * Validates the input time format and selects the corresponding
     * hour and minute.
     */
    validate() {
        if (!this.elem.val()) return;

        let time = this.elem.val(),
            match_24 = new RegExp(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
            match_12 = new RegExp(/^(?:0?\d|1[012]):[0-5]\d[apAP][mM]$/),
            hour = time.substr(0, 2),
            hour_index = parseInt(hour),
            minute = time.substr(3, 2),
            minute_index = parseInt(minute) / this.step;

        if (this.clock === 24) {
            if (!time.match(match_24) || time.length < 5) {
                return;
            }
        } else if (this.clock === 12) {
            if (!time.match(match_12) || time.length < 7) {
                return;
            }
            let period = time.substr(5).toUpperCase();
            this.period = (period === 'PM') ? 'PM' : 'AM';
            if (period === 'PM') hour_index += 12;
        }

        let hour_elem = this.hours.children[hour_index];
        hour_elem.on_click();

        let minute_elem = this.minutes.children[minute_index];
        if (minute_elem) {
            minute_elem.on_click();
        } else {
            this.minutes.unselect_all();
        }
    }

    /**
     * Translates a message ID to the corresponding string in
     * the selected language.
     * @param {string} msgid - The message ID to translate.
     * @returns {string} - The translated message.
     */
    translate(msgid) {
        let locales = this.constructor.locales,
            locale = locales[this.language] || locales.en;
        return locale[msgid];
    }

    /**
     * Unloads the timepicker by removing event listeners, destroying the
     * popper instance and removing the dropdown elem.
     */
    destroy() {
        $(document).off('click', this.hide_dropdown);
        this.popper.destroy();
        this.hours.unload_all();
        this.minutes.unload_all();
        this.dd_elem.remove();
    }
}

TimepickerWidget.locales = {
    en: {
        hour: 'Hour',
        minute: 'Minute'
    },
    de: {
        hour: 'Stunde',
        minute: 'Minute'
    }
};

//////////////////////////////////////////////////////////////////////////////
// yafowil.widget.array integration
//////////////////////////////////////////////////////////////////////////////

/**
 * Re-initializes widget on array add event.
 */
function timepicker_on_array_add(inst, context) {
    TimepickerWidget.initialize(context);
}

/**
 * Registers subscribers to yafowil array events.
 */
export function register_timepicker_array_subscribers() {
    if (window.yafowil_array === undefined) {
        return;
    }
    window.yafowil_array.on_array_event('on_add', timepicker_on_array_add);
}

