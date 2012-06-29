/* 
 * yafowil datepicker widget
 * 
 * Requires: jquery ui datepicker
 * Optional: bdajax
 */

if (typeof(window['yafowil']) == "undefined") yafowil = {};

(function($) {

    $(document).ready(function() {
        // initial binding
        yafowil.datepicker.binder();
        
        // add after ajax binding if bdajax present
        if (typeof(window['bdajax']) != "undefined") {
            $.extend(bdajax.binders, {
                datepicker_binder: yafowil.datepicker.binder
            });
        }
        
        // add binder to yafowil.widget.array hooks
        if (typeof(window.yafowil['array']) != "undefined") {
            $.extend(yafowil.array.hooks.add, {
                datepicker_binder: yafowil.datepicker.binder
            });
        }
    });
    
    $.extend(yafowil, {
        
        datepicker: {
            
        	icon: '/++resource++yafowil.widget.datetime/images/cal16_16.gif',
            
            binder: function(context) {
                $('input.datepicker', context).datepicker({
                    showAnim: null,
                    showOn: 'both',
                    buttonImage: yafowil.datepicker.icon,
                    buttonImageOnly: true
                });
                $('input.timepicker').timepicker({
                    showPeriodLabels: false,
                    showOn: 'both'
                });
            }
        }
    });
    
    // Configure jQuery.UI datepicker languages.
    $(function() {
        $.datepicker.regional['de'] = {
            clearText: 'löschen',
            clearStatus: 'aktuelles Datum löschen',
            closeText: 'schließen',
            closeStatus: 'ohne Änderungen schließen',
            prevText: '&#x3c;zurück',
            prevStatus: 'letzten Monat zeigen',
            nextText: 'Vor&#x3e;',
            nextStatus: 'nächsten Monat zeigen',
            currentText: 'heute',
            currentStatus: '',
            monthNames: [
                'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
            ],
            monthNamesShort: [
                'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
                'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'
            ],
            monthStatus: 'anderen Monat anzeigen',
            yearStatus: 'anderes Jahr anzeigen',
            weekHeader: 'Wo',
            weekStatus: 'Woche des Monats',
            dayNames: [
                'Sonntag', 'Montag', 'Dienstag', 'Mittwoch',
                'Donnerstag', 'Freitag', 'Samstag'
            ],
            dayNamesShort: [
                'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'
            ],
            dayNamesMin: [
                'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'
            ],
            dayStatus: 'Setze DD als ersten Wochentag',
            dateStatus: 'Wähle D, M d',
            dateFormat: 'dd.mm.yy',
            firstDay: 1, 
            initStatus: 'Wähle ein Datum',
            isRTL: false
        };
        $.datepicker.setDefaults($.datepicker.regional['de']);
        
        $.timepicker.regional['de'] = {
            hourText: 'Stunde',
            minuteText: 'Minuten',
            amPmText: ['AM', 'PM'] ,
            closeButtonText: 'Beenden',
            nowButtonText: 'Aktuelle Zeit',
            deselectButtonText: 'Wischen'
        };
        $.timepicker.setDefaults($.timepicker.regional['de']);
    });

})(jQuery);