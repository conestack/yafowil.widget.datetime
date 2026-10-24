from bda.intellidatetime import convert
from bda.intellidatetime import DateTimeConversionError
from bda.intellidatetime import LocalePattern
from datetime import datetime
from node.utils import UNSET
from yafowil.base import ExtractionError
from yafowil.base import factory
from yafowil.base import fetch_value
from yafowil.common import generic_extractor
from yafowil.common import generic_required_extractor
from yafowil.datatypes import generic_emptyvalue_extractor
from yafowil.tsf import TSF
from yafowil.utils import attr_value
from yafowil.utils import css_managed_props
from yafowil.utils import cssclasses
from yafowil.utils import cssid
from yafowil.utils import managedprops
import re


_ = TSF('yafowil.widget.datetime')


def time_data_defs(widget, data):
    format_ = attr_value('format', widget, data)
    if format_ not in ['number', 'string', 'tuple']:
        raise ValueError(f"Unknown format '{format_}'")
    unit = attr_value('unit', widget, data)
    if unit not in ['minutes', 'hours']:
        raise ValueError(f"Unknown unit '{unit}'")
    return format_, unit


def is_clock_12(widget, data):
    # ``clock`` defaults to the string ``'24'``, integers are accepted as well
    return str(attr_value('clock', widget, data)) == '12'


def parse_time(value):
    """Parse hours and minutes of a time input.

    :param value: Time input string, ``HH:MM``, ``HHMM`` or ``H:M``.
    :return: Tuple of hours and minutes as integers.
    :raises ExtractionError: If ``value`` cannot be parsed.
    """
    if len(value) > 5:
        message = _('input_not_valid_time', default='Not a valid time input.')
        raise ExtractionError(message)
    elif len(value) == 5:
        hours = value[:2]
        minutes = value[3:]
    elif len(value) == 4 and value.find(':') == -1:
        hours = value[:2]
        minutes = value[2:]
    else:
        value = value.split(':')
        if len(value) != 2:
            message = _('failed_to_parse_time', default='Failed to parse time input.')
            raise ExtractionError(message)
        hours, minutes = value
    try:
        hours = int(hours)
    except ValueError:
        message = _('hours_not_a_number', default='Hours not a number.')
        raise ExtractionError(message)
    try:
        minutes = int(minutes)
    except ValueError:
        message = _('minutes_not_a_number', default='Minutes not a number.')
        raise ExtractionError(message)
    return hours, minutes


_period_suffix = re.compile(r'\s*([AP]M)\s*$', re.IGNORECASE)


def clock_12_to_24(value):
    """Convert a 12-hour clock time input to the 24-hour format ``HH:MM``.

    The timepicker writes hours 00-11 per period, e.g. ``00:30PM`` for half
    past noon. 12 o'clock typed by hand is accepted as well, ``12:30AM`` is
    ``00:30`` and ``12:30PM`` is ``12:30``. The period is case insensitive.

    :param value: Time input string.
    :return: The converted time, or ``value`` unchanged if it has no ``AM`` or
        ``PM`` suffix.
    :raises ExtractionError: If ``value`` is no valid 12-hour clock time.
    """
    match = _period_suffix.search(value)
    if not match:
        return value
    hours, minutes = parse_time(value[: match.start()])
    if not (0 <= hours <= 12 and 0 <= minutes <= 59):
        message = _('input_not_valid_time', default='Not a valid time input.')
        raise ExtractionError(message)
    hours %= 12
    if match.group(1).upper() == 'PM':
        hours += 12
    return f'{hours:02d}:{minutes:02d}'


_time_24 = re.compile(r'^([01]?\d|2[0-3]):([0-5]\d)$')


def clock_24_to_12(value):
    """Convert a 24-hour clock time to the format of the 12-hour timepicker.

    Hours are 00-11 per period as written by the timepicker, ``12:30`` is
    ``00:30PM``.

    :param value: Time value to render.
    :return: The converted time, or ``value`` unchanged if it is no 24-hour
        clock time ``H:MM`` or ``HH:MM``.
    """
    match = _time_24.match(str(value))
    if not match:
        return value
    hours = int(match.group(1))
    period = 'PM' if hours >= 12 else 'AM'
    return f'{hours % 12:02d}:{match.group(2)}{period}'


@managedprops('format', 'unit', 'daytime', 'clock')
def time_extractor(widget, data):
    format_, unit = time_data_defs(widget, data)
    extracted = data.extracted
    if extracted == UNSET or extracted == '':
        return UNSET
    if is_clock_12(widget, data):
        extracted = clock_12_to_24(extracted)
    hours, minutes = parse_time(extracted)
    daytime = attr_value('daytime', widget, data)
    timepicker = attr_value('timepicker', widget, data)
    if daytime or timepicker:
        if hours < 0 or hours > 23:
            message = _('invalid_hours_range', default='Hours must be in range 0..23.')
            raise ExtractionError(message)
        if minutes < 0 or minutes > 59:
            message = _(
                'invalid_minutes_range', default='Minutes must be in range 0..59.'
            )
            raise ExtractionError(message)
    if format_ == 'string':
        return f'{hours:02d}:{minutes:02d}'
    if format_ == 'tuple':
        return (hours, minutes)
    if unit == 'hours':
        return hours + (minutes / 60.0)
    return hours * 60 + minutes


def render_time_input(widget, data, value, postfix=None, css_class=False):
    tag = data.tag
    widgetname = widget.dottedpath
    if postfix:
        widgetname = f'{widgetname}.{postfix}'
    if value is True:
        value = ''
    if value and is_clock_12(widget, data):
        value = clock_24_to_12(value)
    if not value and data.request:
        value = data.request.get(widgetname)
    disabled = 'disabled' if attr_value('disabled', widget, data) else None
    placeholder = attr_value('placeholder', widget, data) or None
    attrs = {
        'type': 'text',
        'value': value,
        'name_': widgetname,
        'id': cssid(widget, 'input', postfix),
        'size': 5,
        'disabled': disabled,
        'placeholder': placeholder,
    }
    class_ = [attr_value('timeinput_class', widget, data)]
    timepicker = attr_value('timepicker', widget, data)
    if timepicker and not disabled:
        class_.append(attr_value('timepicker_class', widget, data))
        attrs['data-time-locale'] = attr_value('locale', widget, data)
        attrs['data-time-clock'] = attr_value('clock', widget, data)
        attrs['data-time-minutes_step'] = attr_value('minutes_step', widget, data)
    if css_class:
        attrs['class_'] = cssclasses(widget, data, additional=class_)
    else:
        attrs['class_'] = cssclasses(
            widget,
            data,
            classattr=None,
            additional=class_,
            ignores=['required_class', 'class_add'],
        )
    tags = tag('input', **attrs)
    wrapper_class = attr_value('timepicker_wrapper_class', widget, data)
    wrapper_class = cssclasses(
        widget,
        data,
        classattr='timepicker_wrapper_class',
        ignores=['required_class', 'class_add'],
    )
    return data.tag('div', tags, **{'class': wrapper_class})


def time_value(format_, unit, time):
    if format_ == 'tuple':
        if not time or not isinstance(time, tuple):
            return ''
        time = '{:02d}:{:02d}'.format(*(int(time[0]), int(time[1])))
    elif format_ == 'number':
        if time is UNSET or time == '':
            return ''
        if isinstance(time, str):
            # input of a failed extraction is rendered as entered
            return time
        if unit == 'hours':
            hours = int(time)
            minutes = int(round((time - int(time)) * 60.0))
            time = f'{hours:02d}:{minutes:02d}'
        else:
            hours = time // 60
            minutes = time % 60
            time = f'{hours:02d}:{minutes:02d}'
    return time


@managedprops(
    'format',
    'unit',
    'disabled',
    'timepicker',
    'timepicker_class',
    'clock',
    'minutes_step',
    'locale',
    'timepicker_wrapper_class',
    'placeholder',
    *css_managed_props,
)
def time_edit_renderer(widget, data):
    format_, unit = time_data_defs(widget, data)
    time = time_value(format_, unit, fetch_value(widget, data))
    return render_time_input(widget, data, time, css_class=True)


@managedprops('format', 'unit', 'class')
def time_display_renderer(widget, data):
    format_, unit = time_data_defs(widget, data)
    value = data.value
    if not value:
        value = attr_value('empty_display_value', widget, data)
        if not value:
            return ''
    display_class = attr_value('display_class', widget, data)
    attrs = {
        'id': cssid(widget, 'display'),
        'class_': f'display-{attr_value("class", widget, data)}'
        + (f' {display_class}' if display_class is not None else ''),
    }
    return data.tag('div', time_value(format_, unit, value), **attrs)


factory.register(
    'time',
    extractors=[
        generic_extractor,
        generic_required_extractor,
        time_extractor,
        generic_emptyvalue_extractor,
    ],
    edit_renderers=[time_edit_renderer],
    display_renderers=[time_display_renderer],
)

factory.doc['blueprint']['time'] = """\
Add-on blueprint `yafowil.widget.datetime
<http://github.com/conestack/yafowil.widget.datetime/>`_ .
"""

factory.defaults['time.default'] = ''

factory.defaults['time.class'] = 'time'

factory.defaults['time.required_class'] = 'required'

factory.defaults['time.timeinput_class'] = 'timeinput'
factory.doc['props']['time.timeinput_class'] = """\
CSS class rendered on time input field.
"""

factory.defaults['time.timepicker_class'] = 'timepicker'
factory.doc['props']['time.timepicker_class'] = """\
jquery.ui timepicker binds to this class.
"""

factory.defaults['time.disabled'] = False

factory.defaults['time.timepicker'] = False
factory.doc['props']['time.timepicker'] = """\
Flag whether time picker is enabled.
"""

factory.defaults['time.format'] = 'string'
factory.doc['props']['time.format'] = """\
Define widget value and extraction format. Either 'string', 'number' or
'tuple'.
"""

factory.defaults['time.unit'] = 'hours'
factory.doc['props']['time.unit'] = """\
Only considered if 'format' is 'number'. If unit is 'hours' value is float,
otherwise integer.
"""

factory.defaults['time.daytime'] = False
factory.doc['props']['time.daytime'] = """\
Flag whether value is day of time. Setting this property or 'timepicker'
property above to True results in day time range validation.
"""

factory.defaults['time.clock'] = '24'
factory.doc['props']['time.clock'] = """\
Defines which clock to use in timepicker and time input. Either `24` for
24-hour-clock or `12` for 12-hour-clock. Defaults to `24`.

With the 12-hour-clock, the time input renders the value the way the
timepicker writes it, e.g. ``03:15PM``, and ``00:30PM`` for half past noon.
Extraction accepts this format and 12 o'clock typed by hand like ``12:30am``.
Input without ``AM`` or ``PM`` is read as 24-hour-clock time. Display mode
renders the 24-hour-clock time.
"""

factory.defaults['time.locale'] = 'en'
factory.doc['props']['time.locale'] = """\
Widget locale. Used for translations in timepicker widget.
"""

factory.defaults['time.minutes_step'] = '5'
factory.doc['props']['time.minutes_step'] = """\
Defines step between time options. Used in timepicker widget.
"""

factory.defaults['time.empty_display_value'] = None
factory.doc['props']['time.empty_display_value'] = """\
Value to display if no time value set. Used if widget mode is ``display``.
"""

factory.defaults['time.placeholder'] = 'hh:mm'
factory.doc['props']['time.placeholder'] = """\
Placeholder text rendered on the time input field. Defaults to the translated
format hint 'hh:mm'.
"""


@managedprops('required', 'time', 'locale', 'tzinfo', 'clock')
def datetime_extractor(widget, data):
    time = None
    if attr_value('time', widget, data):
        time = data.request.get(f'{widget.dottedpath}.time')
    if time and is_clock_12(widget, data):
        time = clock_12_to_24(time)
    required = attr_value('required', widget, data)
    if not required and not data.extracted and not time:
        return None
    locale = attr_value('locale', widget, data)
    tzinfo = attr_value('tzinfo', widget, data)
    try:
        return convert(data.extracted, time=time, tzinfo=tzinfo, locale=locale)
    except DateTimeConversionError:
        message = _('input_not_valid_date', default='Not a valid date input.')
        raise ExtractionError(message)


_mapping = {
    'D': 'day',
    'M': 'month',
    'Y': 'year',
}


def format_date(dt, locale, delim):
    pattern = LocalePattern().date(locale)
    ret = ''
    for char in pattern.split(' '):
        ret = f'{ret}{delim}{getattr(dt, _mapping[char])}'
    return ret.strip(delim)


def format_time(dt):
    return f'{dt.hour:02d}:{dt.minute:02d}'


def render_datetime_input(widget, data, date, time):
    tag = data.tag
    timeinput = ''
    if time:
        timeinput = render_time_input(widget, data, time, postfix='time')
    disabled = attr_value('disabled', widget, data)
    attrs = {
        'type': 'text',
        'value': date,
        'name_': widget.dottedpath,
        'id': cssid(widget, 'input'),
        'size': 10,
        'disabled': 'disabled' if disabled else None,
    }
    additional_classes = [attr_value('dateinput_class', widget, data)]
    datepicker = attr_value('datepicker', widget, data)
    if datepicker and not disabled:
        datepicker_class = attr_value('datepicker_class', widget, data)
        additional_classes.append(datepicker_class)
        attrs['data-date-locale'] = attr_value('locale', widget, data)
    attrs['class_'] = cssclasses(widget, data, additional=additional_classes)
    wrapper_class = cssclasses(
        widget, data, classattr='wrapper_class', ignores=['required_class', 'class_add']
    )
    date_wrapper_class = attr_value('datepicker_wrapper_class', widget, data)
    tags = tag('input', **attrs)
    dateinput = data.tag('div', tags, **{'class': date_wrapper_class})
    if dateinput and timeinput:
        return data.tag('div', dateinput + timeinput, **{'class': wrapper_class})
    else:
        return dateinput


@managedprops(
    'locale',
    'delimiter',
    'time',
    'disabled',
    'timepicker',
    'timepicker_class',
    'datepicker',
    'datepicker_class',
    'timepicker_wrapper_class',
    'datepicker_wrapper_class',
    'wrapper_class',
    *css_managed_props,
)
def datetime_edit_renderer(widget, data):
    locale = attr_value('locale', widget, data)
    delim = attr_value('delimiter', widget, data)
    time = attr_value('time', widget, data)
    date = None
    # input of a failed extraction is rendered as entered, not the preset value
    if data.value and isinstance(data.value, datetime) and not data.errors:
        date = format_date(data.value, locale, delim)
        if time:
            time = format_time(data.value)
    if data.extracted and isinstance(data.extracted, datetime):
        date = format_date(data.extracted, locale, delim)
        if time:
            time = format_time(data.extracted)
    if not date:
        date = fetch_value(widget, data)
    return render_datetime_input(widget, data, date, time)


@managedprops('format', 'class', 'unset_display_value')
def datetime_display_renderer(widget, data, value=None):
    """Note: This renderer function optionally accepts value as parameter,
    which is used in favor of data.value if defined. Thus it can be used as
    utility function inside custom blueprints with the need of datetime
    display rendering.
    """
    value = value if value else data.value
    if not value:
        value = attr_value('empty_display_value', widget, data)
        if not value:
            return ''
    else:
        format_ = widget.attrs['format']
        if callable(format_):
            value = format_(widget, data)
        else:
            value = value.strftime(format_)
    display_class = attr_value('display_class', widget, data)
    attrs = {
        'id': cssid(widget, 'display'),
        'class_': f'display-{attr_value("class", widget, data)}'
        + (f' {display_class}' if display_class is not None else ''),
    }
    return data.tag('div', value, **attrs)


factory.register(
    'datetime',
    extractors=[
        generic_extractor,
        generic_required_extractor,
        datetime_extractor,
        generic_emptyvalue_extractor,
    ],
    edit_renderers=[datetime_edit_renderer],
    display_renderers=[datetime_display_renderer],
)

factory.doc['blueprint']['datetime'] = """\
Add-on blueprint `yafowil.widget.datetime
<http://github.com/conestack/yafowil.widget.datetime/>`_ .
"""

factory.defaults['datetime.default'] = ''

factory.defaults['datetime.class'] = 'datetime'

factory.defaults['datetime.required_class'] = 'required'

factory.defaults['datetime.wrapper_class'] = 'datetime-picker'
factory.doc['props']['datetime.wrapper_class'] = """\
CSS class rendered on datetime wrapper.
"""

factory.defaults['datetime.dateinput_class'] = 'dateinput'
factory.doc['props']['datetime.dateinput_class'] = """\
CSS class rendered on date input field.
"""

factory.defaults['datetime.datepicker_class'] = 'datepicker'
factory.doc['props']['datetime.datepicker_class'] = """\
jquery.ui datepicker binds to this class.
"""

factory.defaults['datetime.datepicker_wrapper_class'] = None
factory.doc['props']['datetime.datepicker_wrapper_class'] = """\
CSS class rendered on date wrapper div.
"""

factory.defaults['datetime.timeinput_class'] = 'timeinput'
factory.doc['props']['datetime.timeinput_class'] = """\
CSS class rendered on time input field.
"""

factory.defaults['datetime.timepicker_class'] = 'timepicker'
factory.doc['props']['datetime.timepicker_class'] = """\
jquery.ui timepicker binds to this class.
"""

factory.defaults['datetime.timepicker_wrapper_class'] = None
factory.doc['props']['datetime.timepicker_wrapper_class'] = """\
CSS class rendered on time wrapper div.
"""

factory.defaults['time.timepicker_wrapper_class'] = None
factory.doc['props']['time.timepicker_wrapper_class'] = """\
CSS class rendered on time wrapper div.
"""

factory.defaults['datetime.disabled'] = False

factory.defaults['datetime.datepicker'] = False
factory.doc['props']['datetime.datepicker_class'] = """\
Flag whether date picker is enabled.
"""

factory.defaults['datetime.time'] = False
factory.doc['props']['datetime.time'] = """\
Flag whether time input should be rendered.

``time`` may be a callable taking widget and data as parameters expect to
return a boolean.
"""

factory.defaults['datetime.timepicker'] = False
factory.doc['props']['datetime.timepicker'] = """\
Flag whether time picker is enabled.
"""

factory.defaults['datetime.datepicker'] = False
factory.doc['props']['datetime.datepicker'] = """\
Flag whether date picker is enabled.
"""

factory.defaults['datetime.clock'] = '24'
factory.doc['props']['datetime.clock'] = """\
Defines which clock to use in timepicker and time input. Either `24` for
24-hour-clock or `12` for 12-hour-clock. Defaults to `24`.

See ``time.clock`` for the 12-hour-clock format. Display mode renders
``format``.
"""

factory.defaults['datetime.minutes_step'] = '5'
factory.doc['props']['datetime.minutes_step'] = """\
Defines step between time options. Defaults to 5.
"""

factory.defaults['datetime.tzinfo'] = None
factory.doc['props']['datetime.tzinfo'] = """\
Python datetime tzinfo object.

``tzinfo`` may be a callable taking widget and data as parameters expect to
return a tzinfo instance.
"""

factory.defaults['datetime.locale'] = 'en'
factory.doc['props']['datetime.locale'] = """\
Widget locale. Used for translations, calendar weekday start and date input
format.

``locale`` may be a callable taking widget and data as parameters expect to
return a locale string.

This widget uses
`bda.intellidatetime <http://pypi.python.org/pypi/bda.intellidatetime/>`_ for
input parsing. Take a look at this package for details about the parsing rules.
"""

factory.defaults['datetime.delimiter'] = '.'
factory.doc['props']['datetime.delimiter'] = """\
Delimiter used to render date in input field.

``delimiter`` may be a callable taking widget and data as parameters expect to
return a delimiter string.
"""

factory.defaults['datetime.format'] = '%Y.%m.%d %H:%M'
factory.doc['props']['datetime.format'] = """\
Pattern accepted by ``datetime.strftime`` or callable taking widget and
data as parameters returning unicode or utf-8 string. Used if widget mode is
``display``.
"""

factory.defaults['datetime.empty_display_value'] = None
factory.doc['props']['datetime.empty_display_value'] = """\
Value to display if no datetime value set. Used if widget mode is ``display``.
"""
