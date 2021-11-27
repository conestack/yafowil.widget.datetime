import $ from 'jquery';

export class TimepickerWidget {

    static initialize(context) {
        $('input.timepicker', context).each(function() {
            let elem = $(this);
            elem.attr('spellcheck', false);
            new TimepickerWidget(elem, {
                language: elem.data('time-lang'),
                hour: 'Stunde',
                minute: 'Minute',
                clock: elem.data('time-clock')
            });
        });
    }

    constructor(elem, locale) {
        this.elem = elem;
        this.locale = locale;

        this.hours = [];
        this.minutes = [];
        this.period = null;

        this.hour = '';
        this.minute = '';
        this.elem.val('');

        this.compile();

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

    compile() {
        let elem = this.elem;

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

        let hours_content = $(`<div />`).addClass('hours-content'),
            minutes_content = $(`<div />`).addClass('minutes-content');

        $('<div />')
            .addClass('timepicker-hours')
            .append(`<div class="header">${this.locale.hour}</div>`)
            .append(hours_content)
            .appendTo(dd_container);

        $('<div />')
            .addClass('timepicker-minutes')
            .append(`<div class="header">${this.locale.minute}</div>`)
            .append(minutes_content)
            .appendTo(dd_container);

        if (this.locale.clock === 24) {
            for (let i = 0; i < 24; i++) {
                let i_disp = i;
                if (i < 10) {
                    i_disp = '0' + i;
                }
                let elem = $(`<div class="cell">${i_disp}</div>`);
                hours_content.append(elem);
                let cell = new HourCell(elem, this);
                this.hours.push(cell);
            }
        } else if (this.locale.clock === 12) {
            this.hours_am = $(`<div class="am" />`);
            this.hours_pm = $(`<div class="pm" />`);
            hours_content
                .css('display', 'block')
                .append('<span class="am">A.M.</span>')
                .append(this.hours_am)
                .append('<span class="pm">P.M.</span>')
                .append(this.hours_pm);

            for (let i = 0; i < 12; i++) {
                let i_disp = i;
                if (i < 10) {
                    i_disp = '0' + i;
                }
                let elem = $(`<div class="cell">${i_disp}</div>`);
                this.hours_am.append(elem);

                let cell = new HourCell(elem, this, 'AM');
                this.hours.push(cell);
            }
            for (let i = 0; i < 12; i++) {
                let i_disp = i;
                if (i === 0) {
                    i_disp = '12';
                } else if (i < 10) {
                    i_disp = '0' + i;
                }
                let elem = $(`<div class="cell">${i_disp}</div>`);
                this.hours_pm.append(elem);

                let cell = new HourCell(elem, this, 'PM');
                this.hours.push(cell);
            }
        }

        for (let i = 0; i < 12; i++) {
            let i_disp = i * 5;
            if (i_disp < 10) {
                i_disp = '0' + i_disp;
            }
            let elem = $(`<div class="cell">${i_disp}</div>`);
            minutes_content.append(elem);
            let cell = new MinuteCell(elem, this);
            this.minutes.push(cell);
        }
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
        if (this.locale.clock === 24) {
            this.elem.val(`${this.hour}:${this.minute}`);
        } else if (this.locale.clock === 12) {
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

class HourCell {

    constructor(elem, picker, period) {
        this.elem = elem;
        this.picker = picker;
        this.period = period;
        this.click_handle = this.click_handle.bind(this);
        this.elem.on('click', this.click_handle);
    }

    click_handle(e) {
        let hour = this.elem.text();
        for (let hour of this.picker.hours) {
            hour.elem.removeClass('selected')
        }
        this.elem.addClass('selected');
        this.picker.period = this.period;
        this.picker.hour = hour;
    }
}

class MinuteCell {

    constructor(elem, picker) {
        this.elem = elem;
        this.picker = picker;
        this.click_handle = this.click_handle.bind(this);
        this.elem.on('click', this.click_handle);
    }

    click_handle(e) {
        let minute = this.elem.text();
        for (let minute of this.picker.minutes) {
            minute.elem.removeClass('selected')
        }
        this.elem.addClass('selected');
        this.picker.minute = minute;
    }
}
