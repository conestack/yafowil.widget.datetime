import $ from 'jquery';

// Datepicker base class is global.
export class DatepickerWidget extends Datepicker {

    static initialize(context) {
        $('input.datepicker', context).each(function() {
            let elem = $(this);
            new DatepickerWidget(elem, {
                language: elem.data('date-lang')
            });
        });
    }

    constructor(elem, opts={}) {
        Object.assign(opts, {
            orientation: 'bottom',
            buttonClass: 'btn',
            weekStart: 1,
            todayHighlight: true,
            autohide: true,
            format: 'dd.mm.yyyy'
        });
        super(elem[0], opts);

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
