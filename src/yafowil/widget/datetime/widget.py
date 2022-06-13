from bda.intellidatetime import DateTimeConversionError
from bda.intellidatetime import LocalePattern
from bda.intellidatetime import convert
from datetime import datetime
from node.utils import UNSET
from yafowil.base import ExtractionError
from yafowil.base import factory
from yafowil.base import fetch_value
from yafowil.common import generic_emptyvalue_extractor
from yafowil.common import generic_extractor
from yafowil.common import generic_required_extractor
from yafowil.compat import IS_PY2
from yafowil.tsf import TSF
from yafowil.utils import attr_value
from yafowil.utils import css_managed_props
from yafowil.utils import cssclasses
from yafowil.utils import cssid
from yafowil.utils import managedprops


_ = TSF('yafowil.widget.datetime')


def time_data_defs(widget, data):
    format_ = attr_value('format', widget, data)
    if format_ not in ['number', 'string', 'tuple']:
        raise ValueError(u"Unknown format '{}'".format(format_))
    unit = attr_value('unit', widget, data)
    if unit not in ['minutes', 'hours']:
        raise ValueError(u"Unknown unit '{}'".format(unit))
    return format_, unit


@managedprops('format', 'unit', 'daytime', 'clock')
def time_extractor(widget, data):
    format_, unit = time_data_defs(widget, data)
    extracted = data.extracted
    if extracted == UNSET or extracted == '':
        return UNSET
    if len(extracted) > 5:
        message = _('input_not_valid_time', default=u'Not a valid time input.')
        raise ExtractionError(message)
    elif len(extracted) == 5:
        hours = extracted[:2]
        minutes = extracted[3:]
    elif len(extracted) == 4 and extracted.find(':') == -1:
        hours = extracted[:2]
        minutes = extracted[2:]
    else:
        extracted = extracted.split(':')
        if len(extracted) != 2:
            message = _(
                'failed_to_parse_time',
                default=u'Failed to parse time input.'
            )
            raise ExtractionError(message)
        hours, minutes = extracted
    try:
        hours = int(hours)
    except ValueError:
        message = _(
            'hours_not_a_number',
            default=u'Hours not a number.'
        )
        raise ExtractionError(message)
    try:
        minutes = int(minutes)
    except ValueError:
        message = _(
            'minutes_not_a_number',
            default=u'Minutes not a number.'
        )
        raise ExtractionError(message)
    daytime = attr_value('daytime', widget, data)
    timepicker = attr_value('timepicker', widget, data)
    if daytime or timepicker:
        if hours < 0 or hours > 23:
            message = _(
                'invalid_hours_range',
                default=u'Hours must be in range 0..23.'
            )
            raise ExtractionError(message)
        if minutes < 0 or minutes > 59:
            message = _(
                'invalid_minutes_range',
                default=u'Minutes must be in range 0..59.'
            )
            raise ExtractionError(message)
    if format_ == 'string':
        return '{:02d}:{:02d}'.format(hours, minutes)
    if format_ == 'tuple':
        return (hours, minutes)
    if unit == 'hours':
        return hours + (minutes / 60.0)
    return hours * 60 + minutes


def render_time_input(widget, data, value, postfix=None, css_class=False):
    tag = data.tag
    widgetname = widget.dottedpath
    if postfix:
        widgetname = '{}.{}'.format(widgetname, postfix)
    if value is True:
        value = ''
    if not value and data.request:
        value = data.request.get(widgetname)
    disabled = 'disabled' if attr_value('disabled', widget, data) else None
    attrs = {
        'type': 'text',
        'value': value,
        'name_': widgetname,
        'id': cssid(widget, 'input', postfix),
        'size': 5,
        'disabled': disabled
    }
    class_ = [attr_value('timeinput_class', widget, data)]
    timepicker = attr_value('timepicker', widget, data)
    if timepicker and not disabled:
        class_.append(attr_value('timepicker_class', widget, data))
        attrs['data-time-locale'] = attr_value('locale', widget, data)
        attrs['data-time-clock'] = attr_value('clock', widget, data)
        attrs['data-time-minutes_step'] = attr_value(
            'minutes_step',
            widget,
            data
        )
    if css_class:
        attrs['class_'] = cssclasses(widget, data, additional=class_)
    else:
        attrs['class_'] = ' '.join(class_)
    return tag('input', **attrs)


def time_value(format_, unit, time):
    if format_ == 'tuple':
        if not time:
            return ''
        time = '{:02d}:{:02d}'.format(*(int(time[0]), int(time[1])))
    elif format_ == 'number':
        if time is UNSET or time == '':
            return ''
        if unit == 'hours':
            hours = int(time)
            minutes = int(round((time - int(time)) * 60.0))
            time = '{:02d}:{:02d}'.format(hours, minutes)
        else:
            if IS_PY2:
                hours = time / 60
            else:
                hours = time // 60
            minutes = time % 60
            time = '{:02d}:{:02d}'.format(hours, minutes)
    return time


@managedprops(
    'format', 'unit', 'disabled', 'timepicker', 'timepicker_class', 'clock',
    'minutes_step', 'locale', *css_managed_props
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
        return u''
    attrs = {
        'id': cssid(widget, 'display'),
        'class_': 'display-{}'.format(attr_value('class', widget, data))
    }
    return data.tag('div', time_value(format_, unit, value), **attrs)


factory.register(
    'time',
    extractors=[
        generic_extractor,
        generic_required_extractor,
        time_extractor,
        generic_emptyvalue_extractor
    ],
    edit_renderers=[time_edit_renderer],
    display_renderers=[time_display_renderer])

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
Defines which clock to use in timepicker. Either `24` for 24-hour-clock or `12`
for 12-hour-clock. Defaults to `24`
"""

factory.defaults['time.locale'] = 'en'
factory.doc['props']['time.locale'] = """\
Widget locale. Used for translations in timepicker widget.
"""

factory.defaults['time.minutes_step'] = '5'
factory.doc['props']['time.minutes_step'] = """\
Defines step between time options. Used in timepicker widget.
"""


@managedprops('required', 'time', 'locale', 'tzinfo', 'clock')
def datetime_extractor(widget, data):
    time = None
    if attr_value('time', widget, data):
        time = data.request.get('{}.time'.format(widget.dottedpath))
    required = attr_value('required', widget, data)
    if not required and not data.extracted and not time:
        return ''
    locale = attr_value('locale', widget, data)
    tzinfo = attr_value('tzinfo', widget, data)
    try:
        return convert(data.extracted, time=time, tzinfo=tzinfo, locale=locale)
    except DateTimeConversionError:
        message = _('input_not_valid_date',
                    default=u'Not a valid date input.')
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
        ret = '{}{}{}'.format(ret, delim, getattr(dt, _mapping[char]))
    return ret.strip(delim)


def format_time(dt):
    return '{:02d}:{:02d}'.format(dt.hour, dt.minute)


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
        'disabled': 'disabled' if disabled else None
    }
    additional_classes = [attr_value('dateinput_class', widget, data)]
    datepicker = attr_value('datepicker', widget, data)
    if datepicker and not disabled:
        datepicker_class = attr_value('datepicker_class', widget, data)
        additional_classes.append(datepicker_class)
        attrs['data-date-locale'] = attr_value('locale', widget, data)
    attrs['class_'] = cssclasses(widget, data, additional=additional_classes)
    return tag('input', **attrs) + timeinput


@managedprops('locale', 'delimiter', 'time', 'disabled', 'timepicker',
              'timepicker_class', 'datepicker', 'datepicker_class',
              *css_managed_props)
def datetime_edit_renderer(widget, data):
    locale = attr_value('locale', widget, data)
    delim = attr_value('delimiter', widget, data)
    time = attr_value('time', widget, data)
    date = None
    if data.value and isinstance(data.value, datetime):
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
            return u''
    else:
        format_ = widget.attrs['format']
        if callable(format_):
            value = format_(widget, data)
        else:
            value = value.strftime(format_)
    attrs = {
        'id': cssid(widget, 'display'),
        'class_': 'display-{}'.format(attr_value('class', widget, data))
    }
    return data.tag('div', value, **attrs)


factory.register(
    'datetime',
    extractors=[
        generic_extractor,
        generic_required_extractor,
        datetime_extractor,
        generic_emptyvalue_extractor
    ],
    edit_renderers=[datetime_edit_renderer],
    display_renderers=[datetime_display_renderer])

factory.doc['blueprint']['datetime'] = """\
Add-on blueprint `yafowil.widget.datetime
<http://github.com/conestack/yafowil.widget.datetime/>`_ .
"""

factory.defaults['datetime.default'] = ''

factory.defaults['datetime.class'] = 'datetime'

factory.defaults['datetime.required_class'] = 'required'

factory.defaults['datetime.dateinput_class'] = 'dateinput'
factory.doc['props']['datetime.dateinput_class'] = """\
CSS class rendered on date input field.
"""

factory.defaults['datetime.datepicker_class'] = 'datepicker'
factory.doc['props']['datetime.datepicker_class'] = """\
jquery.ui datepicker binds to this class.
"""

factory.defaults['datetime.timeinput_class'] = 'timeinput'
factory.doc['props']['datetime.timeinput_class'] = """\
CSS class rendered on time input field.
"""

factory.defaults['datetime.timepicker_class'] = 'timepicker'
factory.doc['props']['datetime.timepicker_class'] = """\
jquery.ui timepicker binds to this class.
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
Defines which clock to use in timepicker. Either `24` for 24-hour-clock or `12`
for 12-hour-clock. Defaults to `24`
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
