import $ from 'jquery';

export class TimepickerButton {

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

export class TimepickerButtonContainer {

    constructor(picker, elem) {
        this.picker = picker;
        this.elem = elem;
        this.children = [];
    }

    unload_all() {
        for (let child of this.children) {
            child.elem.off('click', child.click_handle);
        }
    }

    unselect_all() {
        for (let child of this.children) {
            child.selected = false;
        }
    }
}

export class TimepickerHour extends TimepickerButton {

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

export class TimepickerMinute extends TimepickerButton {

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

export class TimepickerHours extends TimepickerButtonContainer {

    constructor(picker, container) {
        super(picker, $(`<div />`).addClass('hours-content'));
        if (picker.clock === 24) {
            this.create_clock_24();
        } else if (picker.clock === 12) {
            this.create_clock_12();
        }
        let header = $('<div />')
            .addClass('header')
            .text(picker.translate('hour'));
        $('<div />')
            .addClass('timepicker-hours')
            .append(header)
            .append(this.elem)
            .appendTo(container);

        if (picker.clock === 12) {
            header.css('margin-left', '34px');
        }
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

export class TimepickerMinutes extends TimepickerButtonContainer {

    constructor(picker, container) {
        super(picker, $(`<div />`).addClass('minutes-content'));
        for (let i = 0; i < 12; i++) {
            this.children.push(new TimepickerMinute(this, this.elem, i * 5));
        }
        let header = $('<div />')
            .addClass('header')
            .text(picker.translate('minute'));
        $('<div />')
            .addClass('timepicker-minutes')
            .append(header)
            .append(this.elem)
            .appendTo(container);
    }
}

export class TimepickerWidget {

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
        this.elem.data('timepicker', this);
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

        let dd_container = $(`<div />`)
            .addClass('timepicker-container')
            .appendTo(dd_elem);

        this.hours = new TimepickerHours(this, dd_container);
        this.minutes = new TimepickerMinutes(this, dd_container);

        this.validate();
        this.place();

        this.show_dropdown = this.show_dropdown.bind(this);
        this.elem.on('focus', this.show_dropdown);

        this.toggle_dropdown = this.toggle_dropdown.bind(this);
        this.trigger_elem.on('click', this.toggle_dropdown);

        this.hide_dropdown = this.hide_dropdown.bind(this);
        $(document).on('click', this.hide_dropdown);

        this.input_handle = this.input_handle.bind(this);
        this.elem.on('keypress', this.input_handle);
        this.validate = this.validate.bind(this);
        this.elem.on('keyup', this.validate);
    }

    unload() {
        this.elem.off('focus', this.show_dropdown);
        this.trigger_elem.off('click', this.toggle_dropdown);
        $(document).off('click', this.hide_dropdown);
        this.elem.off('keypress', this.input_handle);
        this.elem.off('keyup', this.validate);

        this.hours.unload_all();
        this.minutes.unload_all();
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

    place() {
        let offset = this.elem.offset().left - this.elem.parent().offset().left;
        this.dd_elem.css('left', `${offset}px`);

        let offset_left = this.elem.offset().left,
            offset_top = this.elem.offset().top,
            dd_width = this.dd_elem.outerWidth(),
            dd_height = this.dd_elem.outerHeight(),
            elem_width = this.elem.outerWidth();

        let lower_edge = offset_top + this.elem.outerHeight() + dd_height;
        let right_edge = offset_left + dd_width;

        if (lower_edge > $(document).height()) {
            this.dd_elem.css('top', '-170px');
        }
        if (offset_left + elem_width - dd_width < 0) {
            this.dd_elem.css('left', 'unset');
        } else if (right_edge > $(window).width()) {
            this.dd_elem
                .css('transform',
                    `translateX(calc(-100% + ${elem_width}px))`);
        }
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

    input_handle(e) {
        e.preventDefault();
        let isNumber = new RegExp("[0-9]");
        let val = this.elem.val();
        let cursor_pos = e.target.selectionStart;
        if (e.key === 'Enter') {
            this.dd_elem.hide();
            this.elem.blur();
        }

        if (cursor_pos <= 4) {
            if (e.key.match(isNumber)) {
                this.elem.val(val + e.key);
                if (cursor_pos === 2) {
                    this.elem.val(`${val}:${e.key}`);
                }
            }
        } else if (cursor_pos === 5 && this.clock === 12) {
            let correct = ["a", "A", "p", "P"];
            if (correct.includes(e.key)) {
                this.elem.val(val + e.key);
            }
        } else if (cursor_pos === 6 && this.clock === 12) {
            if (e.key === "m" || e.key === "M") {
                this.elem.val(val + e.key);
            }
        };
    }

    validate() {
        if (!this.elem.val()) return;

        let time = this.elem.val(),
            match_24 = new RegExp(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
            match_12 = new RegExp(/^(?:0?\d|1[012]):[0-5]\d[apAP][mM]$/),
            hour = time.substr(0, 2),
            hour_index = parseInt(hour),
            minute = time.substr(3, 2),
            minute_index = parseInt(minute) / 5;

        if (this.clock === 24) {
            if (!time.match(match_24) || time.length < 5) {
                return;
            }
        } else if (this.clock === 12) {
            if (!time.match(match_12) || time.length < 7) {
                return;
            }
            let period = time.substr(5).toUpperCase();
            this.period = (period === "PM") ? "PM" : "AM";
            if (period === "PM") hour_index += 12;
        }

        let hour_elem = this.hours.children[hour_index];
        hour_elem.click_handle();

        let minute_elem = this.minutes.children[minute_index];
        minute_elem.click_handle();
    }

    translate(msgid) {
        let locales = this.constructor.locales,
            locale = locales[this.language] || locales.en;
        return locale[msgid];
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
