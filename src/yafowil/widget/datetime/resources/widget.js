var yafowil_datetime = (function (exports, $) {
    'use strict';

    class DatepickerSettings {
        settings(locale) {
            let locales = this.constructor.locales;
            let settings = locales[locale];
            return settings || locales[this.constructor.default_locale];
        }
    }
    DatepickerSettings.default_locale = 'en';
    DatepickerSettings.locales = {};
    DatepickerSettings.locales.en = {
        weekStart: 1,
        format: 'mm.dd.yyyy'
    };
    DatepickerSettings.locales.de = {
        weekStart: 1,
        format: 'dd.mm.yyyy'
    };
    let datepicker_settings = new DatepickerSettings();

    class DatepickerWidget extends Datepicker {
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

    class TimepickerI18n {
        translate(locale, msgid) {
            let messages = this.constructor.messages,
                lang = messages[locale] || messages[this.constructor.default_locale];
            return lang[msgid];
        }
    }
    TimepickerI18n.default_locale = 'en';
    TimepickerI18n.messages = {};
    TimepickerI18n.messages.en = {
        hour: 'Hour',
        minute: 'Minute'
    };
    TimepickerI18n.messages.de = {
        hour: 'Stunde',
        minute: 'Minute'
    };
    let timepicker_i18n = new TimepickerI18n();

    class TimepickerButton {
        constructor(elem) {
            this.elem = elem;
        }
        get selected() {
            return this.elem.hasClass('selected');
        }
        set selected(value) {
            if (value) {
                this.elem.addClass('selected');
            } else {
                this.elem.removeClass('selected');
            }
        }
    }
    class TimepickerButtonContainer {
        constructor(picker, elem) {
            this.picker = picker;
            this.elem = elem;
            this.children = [];
        }
        unselect_all() {
            for (let child of this.children) {
                child.selected = false;
            }
        }
    }
    class TimepickerHour extends TimepickerButton {
        constructor(hours, container, value, period) {
            super($('<div />')
                .addClass('cell')
                .text(new String(value).padStart(2, '0'))
                .appendTo(container)
            );
            this.hours = hours;
            this.picker = hours.picker;
            this.period = period;
            this.click_handle = this.click_handle.bind(this);
            this.elem.on('click', this.click_handle);
        }
        click_handle(e) {
            let hour = this.elem.text();
            this.hours.unselect_all();
            this.selected = true;
            this.picker.period = this.period;
            this.picker.hour = hour;
        }
    }
    class TimepickerMinute extends TimepickerButton {
        constructor(minutes, container, value) {
            super($('<div />')
                .addClass('cell')
                .text(new String(value).padStart(2, '0'))
                .appendTo(container)
            );
            this.minutes = minutes;
            this.picker = minutes.picker;
            this.click_handle = this.click_handle.bind(this);
            this.elem.on('click', this.click_handle);
        }
        click_handle(e) {
            let minute = this.elem.text();
            this.minutes.unselect_all();
            this.selected = true;
            this.picker.minute = minute;
        }
    }
    class TimepickerHours extends TimepickerButtonContainer {
        constructor(picker, container) {
            super(picker, $(`<div />`).addClass('hours-content'));
            if (picker.clock === 24) {
                this.create_clock_24();
            } else if (picker.clock === 12) {
                this.create_clock_12();
            }
            let header = $('<div />')
                .addClass('header')
                .text(timepicker_i18n.translate(picker.language, 'hour'));
            $('<div />')
                .addClass('timepicker-hours')
                .append(header)
                .append(this.elem)
                .appendTo(container);
        }
        create_clock_24() {
            for (let i = 0; i < 24; i++) {
                this.children.push(new TimepickerHour(this, this.elem, i));
            }
        }
        create_clock_12() {
            let hours_am = $(`<div class="am" />`);
            for (let i = 0; i < 12; i++) {
                this.children.push(new TimepickerHour(this, hours_am, i, 'AM'));
            }
            let hours_pm = $(`<div class="pm" />`);
            for (let i = 0; i < 12; i++) {
                this.children.push(new TimepickerHour(this, hours_pm, i, 'PM'));
            }
            this.elem.css('display', 'block')
                .append('<span class="am">A.M.</span>')
                .append(hours_am)
                .append('<span class="pm">P.M.</span>')
                .append(hours_pm);
        }
    }
    class TimepickerMinutes extends TimepickerButtonContainer {
        constructor(picker, container) {
            super(picker, $(`<div />`).addClass('minutes-content'));
            for (let i = 0; i < 12; i++) {
                this.children.push(new TimepickerMinute(this, this.elem, i));
            }
            let header = $('<div />')
                .addClass('header')
                .text(timepicker_i18n.translate(picker.language, 'minute'));
            $('<div />')
                .addClass('timepicker-minutes')
                .append(header)
                .append(this.elem)
                .appendTo(container);
        }
    }
    class TimepickerWidget {
        static initialize(context) {
            $('input.timepicker', context).each(function() {
                let elem = $(this);
                elem.attr('spellcheck', false);
                new TimepickerWidget(elem, {
                    language: elem.data('time-locale'),
                    clock: elem.data('time-clock')
                });
            });
        }
        constructor(elem, opts) {
            this.elem = elem;
            this.language = opts.language || 'en';
            this.clock = opts.clock || 24;
            this.period = null;
            this.hour = '';
            this.minute = '';
            this.trigger_elem = $(`<button>...</button>`)
                .addClass('timepicker-trigger btn btn-default');
            elem.after(this.trigger_elem);
            let dd_elem = this.dd_elem = $(`<div />`).addClass('timepicker-dropdown');
            elem.after(dd_elem);
            let offset = elem.offset().left - elem.parent().offset().left;
            dd_elem.css('left', `${offset}px`);
            let dd_container = $(`<div />`)
                .addClass('timepicker-container')
                .appendTo(dd_elem);
            this.hours = new TimepickerHours(this, dd_container);
            this.minutes = new TimepickerMinutes(this, dd_container);
            this.show_dropdown = this.show_dropdown.bind(this);
            this.elem.on('focus', this.show_dropdown);
            this.toggle_dropdown = this.toggle_dropdown.bind(this);
            this.trigger_elem.on('click', this.toggle_dropdown);
            this.hide_dropdown = this.hide_dropdown.bind(this);
            $(document).on('click', this.hide_dropdown);
        }
        unload() {
            $(document).off('click', this.hide_dropdown);
        }
        get hour() {
            return this._hour;
        }
        set hour(hour) {
            this._hour = hour;
            this.set_time();
        }
        get minute() {
            return this._minute;
        }
        set minute(minute) {
            this._minute = minute;
            this.set_time();
        }
        set_time() {
            if (this.hour === '' || this.minute === '') {
                return;
            }
            if (this.clock === 24) {
                this.elem.val(`${this.hour}:${this.minute}`);
            } else if (this.clock === 12) {
                this.elem.val(`${this.hour}:${this.minute}${this.period}`);
            }
            this.hour = '';
            this.minute = '';
            this.dd_elem.hide();
        }
        hide_dropdown(e) {
            if (e.target !== this.elem[0] && e.target !== this.trigger_elem[0]) {
                if ($(e.target).closest(this.dd_elem).length === 0) {
                    this.dd_elem.hide();
                }
            }
        }
        show_dropdown(e) {
            this.dd_elem.show();
        }
        toggle_dropdown(e) {
            e.preventDefault();
            this.dd_elem.toggle();
        }
    }

    $(function() {
        if (window.ts !== undefined) {
            ts.ajax.register(DatepickerWidget.initialize, true);
            ts.ajax.register(TimepickerWidget.initialize, true);
        } else if (window.bdajax !== undefined) {
            bdajax.register(DatepickerWidget.initialize, true);
            bdajax.register(TimepickerWidget.initialize, true);
        } else {
            DatepickerWidget.initialize();
            TimepickerWidget.initialize();
        }
    });

    exports.DatepickerSettings = DatepickerSettings;
    exports.DatepickerWidget = DatepickerWidget;
    exports.TimepickerButton = TimepickerButton;
    exports.TimepickerButtonContainer = TimepickerButtonContainer;
    exports.TimepickerHour = TimepickerHour;
    exports.TimepickerHours = TimepickerHours;
    exports.TimepickerI18n = TimepickerI18n;
    exports.TimepickerMinute = TimepickerMinute;
    exports.TimepickerMinutes = TimepickerMinutes;
    exports.TimepickerWidget = TimepickerWidget;
    exports.datepicker_settings = datepicker_settings;
    exports.timepicker_i18n = timepicker_i18n;

    Object.defineProperty(exports, '__esModule', { value: true });


    if (window.yafowil === undefined) {
        window.yafowil = {};
    }
    window.yafowil.datetime = exports;


    return exports;

})({}, jQuery);
