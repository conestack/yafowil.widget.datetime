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
            this.children.push(new TimepickerMinute(this, this.elem, i));
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
