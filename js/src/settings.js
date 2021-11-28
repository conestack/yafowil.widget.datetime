export class DatepickerSettings {

    settings(locale) {
        let locales = this.constructor.locales;
        let settings = locales[locale];
        return settings || locales[this.constructor.default_locale];
    }
}

// cannot set static class properties yet. karma module resolver fails with
// unexpected token.
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
export {datepicker_settings};
