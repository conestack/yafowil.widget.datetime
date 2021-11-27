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

        this.dropdown = $(`<div class="timepicker-dropdown"/>`);
        this.dropdown_container = $(`<div class="timepicker-container"/>`);

        this.trigger_elem = $(`<button>...</button>`)
            .addClass('timepicker-trigger btn btn-default');
        this.hours_content = $(`<div />`).addClass('hours-content');
        this.minutes_content = $(`<div />`).addClass('minutes-content');
        this.hours_elem = $('<div />')
            .addClass('timepicker-hours')
            .append(`<div class="header">${this.locale.hour}</div>`)
            .append(this.hours_content);
        this.minutes_elem = $('<div />')
            .addClass('timepicker-minutes')
            .append(`<div class="header">${this.locale.minute}</>`)
            .append(this.minutes_content);

        if (this.locale.clock === 24) {
            for (let i = 0; i < 24; i++) {
                let i_disp = i;
                if (i < 10) {
                    i_disp = '0' + i;
                }
                let elem = $(`<div class="cell">${i_disp}</div>`);
                this.hours_content.append(elem);
                let cell = new HoursCell(elem, this);
                this.hours.push(cell);
            }
        } else if (this.locale.clock === 12) {
            this.hours_am = $(`<div class="am" />`);
            this.hours_pm = $(`<div class="pm" />`);
            this.hours_content
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

                let cell = new HoursCell(elem, this, 'AM');
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

                let cell = new HoursCell(elem, this, 'PM');
                this.hours.push(cell);
            }
        }

        for (let i = 0; i < 12; i++) {
            let i_disp = i * 5;
            if (i_disp < 10) {
                i_disp = '0' + i_disp;
            }
            let elem = $(`<div class="cell">${i_disp}</div>`);
            this.minutes_content.append(elem);
            let cell = new MinutesCell(elem, this);
            this.minutes.push(cell);
        }

        this.elem.after(this.dropdown);
        let offset = this.elem.offset().left - this.elem.parent().offset().left;
        this.dropdown.css('left', `${offset}px`);
        this.elem.after(this.trigger_elem);
        this.dropdown.append(this.dropdown_container);
        this.dropdown_container.append(this.hours_elem).append(this.minutes_elem);

        this.show_dropdown = this.show_dropdown.bind(this);
        this.toggle_dropdown = this.toggle_dropdown.bind(this);
        this.hide_dropdown = this.hide_dropdown.bind(this);

        this.elem.on('focus', this.show_dropdown);
        this.trigger_elem.on('click', this.toggle_dropdown);

        $(document).on('click', this.hide_dropdown);
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
        this.dropdown.hide();
    }

    hide_dropdown(e) {
        if (e.target !== this.elem[0] && e.target !== this.trigger_elem[0]) {
            if ($(e.target).closest(this.dropdown).length === 0) {
                this.dropdown.hide();
            }
        }
    }

    show_dropdown() {
        this.dropdown.show();
    }

    toggle_dropdown(e) {
        e.preventDefault();
        this.dropdown.toggle();
    }
}

class HoursCell {

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

class MinutesCell {

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
