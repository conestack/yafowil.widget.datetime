if (typeof(window['yafowil']) == "undefined") yafowil = {};

(function($) {

    $(document).ready(function() {
        yafowil.datepicker.binder();
        bdajax.binders.datepicker_binder = yafowil.datepicker.binder;
    });
	
	// yafowil datepicker widget
	$.extend(yafowil, {
		
		datepicker: {
			
			binder: function(context) {
	            $('input.datepicker').datepicker({
	                showAnim: null,
	                showOn: 'button',
	                buttonImage: '/static/icons/calendar16_16.gif',
	                buttonImageOnly: true
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
    });

})(jQuery);