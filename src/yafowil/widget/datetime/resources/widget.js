(function (exports, $) {
    'use strict';

    class DatePicker {
        static initialize(context) {
            $('input.datepicker', context).each(function() {
                let elem = $(this);
                new DatePicker(elem);
            });
        }
        constructor(elem) {
            this.elem = elem;
            console.log('AAAAAA');
        }
    }

    $(function() {
        if (window.ts !== undefined) {
            ts.ajax.register(DatePicker.initialize, true);
        } else {
            DatePicker.initialize();
        }
    });

    exports.DatePicker = DatePicker;

    Object.defineProperty(exports, '__esModule', { value: true });


    if (window.yafowil === undefined) {
        window.yafowil = {};
    }

    window.yafowil.datetime = exports;


    return exports;

})({}, jQuery);
//# sourceMappingURL=yafowil.widget.datetime.js.map
