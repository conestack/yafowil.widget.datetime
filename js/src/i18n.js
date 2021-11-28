export class TimepickerI18n {

    translate(locale, msgid) {
        let messages = this.constructor.messages,
            lang = messages[locale] || messages[this.constructor.default_locale];
        return lang[msgid];
    }
}

// cannot set static class properties yet. karma module resolver fails with
// unexpected token.
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
export {timepicker_i18n};
