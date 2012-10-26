from datetime import datetime
from yafowil.base import (
    factory,
    UNSET,
    ExtractionError,
    fetch_value,
)
from yafowil.common import (
    generic_extractor,
    generic_required_extractor,
)
from yafowil.utils import (
    cssid,
    cssclasses,
    css_managed_props,
    managedprops,
    attr_value,
)
from bda.intellidatetime import (
    convert,
    LocalePattern,
    DateTimeConversionError,
)


def time_data_defs(widget, data):
    format = attr_value('format', widget, data)
    if format not in ['number', 'string', 'tuple']:
        raise ValueError(u"Unknown format '%s'" % format)
    unit = attr_value('unit', widget, data)
    if unit not in ['minutes', 'hours']:
        raise ValueError(u"Unknown unit '%s'" % unit)
    return format, unit


@managedprops('format', 'unit', 'daytime')
def time_extractor(widget, data):
    format, unit = time_data_defs(widget, data)
    extracted = data.extracted
    if extracted == UNSET or extracted == '':
        return UNSET
    if len(extracted) > 5:
        raise ExtractionError(u"Not a valid time input.")
    elif len(extracted) == 5:
        hours = extracted[:2]
        minutes = extracted[3:]
    elif len(extracted) == 4 and extracted.find(':') == -1:
        hours = extracted[:2]
        minutes = extracted[2:]
    else:
        extracted = extracted.split(':')
        if len(extracted) != 2:
            raise ExtractionError(u"Failed to parse time input.")
        hours, minutes = extracted
    try:
        hours = int(hours)
    except ValueError:
        raise ExtractionError(u"Hours not a number.")
    try:
        minutes = int(minutes)
    except ValueError:
        raise ExtractionError(u"Minutes not a number.")
    daytime = attr_value('daytime', widget, data)
    timepicker = attr_value('timepicker', widget, data)
    if daytime or timepicker:
        if hours < 0 or hours > 23:
            raise ExtractionError(u"Hours must be in range 0..23.")
        if minutes < 0 or minutes > 59:
            raise ExtractionError(u"Minutes must be in range 0..59.")
    if format == 'string':
        return '%02i:%02i' % (hours, minutes)
    if format == 'tuple':
        return (hours, minutes)
    if unit == 'hours':
        return hours + (minutes / 60.0)
    return hours * 60 + minutes


def render_time_input(widget, data, value, postfix=None, css_class=False):
    tag = data.tag
    widgetname = widget.dottedpath
    if postfix:
        widgetname = '%s.%s' % (widgetname, postfix)
    if value is True:
        value = ''
    if not value and data.request:
        value = data.request.get(widgetname)
    disabled = attr_value('disabled', widget, data) and 'disabled' or None
    attrs = {
        'type': 'text',
        'value': value,
        'name_': widgetname,
        'id': cssid(widget, 'input', postfix),
        'size': 5,
        'disabled': disabled,
    }
    class_ = ''
    timepicker = attr_value('timepicker', widget, data)
    if timepicker and not disabled:
        class_ = attr_value('timepicker_class', widget, data)
    if css_class:
        additional = class_ and [class_] or list()
        attrs['class_'] = cssclasses(widget, data, additional=additional)
    elif class_:
        attrs['class_'] = class_
    return tag('input', **attrs)


def time_value(format, unit, time):
    if format == 'tuple':
        if not time:
            return ''
        time = '%02i:%02i' % time
    elif format == 'number':
        if time is UNSET or time == '':
            return ''
        if unit == 'hours':
            hours = int(time)
            minutes = int(round((time - int(time)) * 60.0))
            time = '%02i:%02i' % (hours, minutes)
        else:
            hours = time / 60
            minutes = time % 60
            time = '%02i:%02i' % (hours, minutes)
    return time


@managedprops('format', 'unit', 'disabled', 'timepicker',
              'timepicker_class', *css_managed_props)
def time_edit_renderer(widget, data):
    format, unit = time_data_defs(widget, data)
    time = time_value(format, unit, fetch_value(widget, data))
    return render_time_input(widget, data, time, css_class=True)


@managedprops('format', 'unit', 'class')
def time_display_renderer(widget, data):
    format, unit = time_data_defs(widget, data)
    value = data.value
    if not value:
        return u''
    attrs = {
        'id': cssid(widget, 'display'),
        'class_': 'display-%s' % attr_value('class', widget, data)
    }
    return data.tag('div', time_value(format, unit, value), **attrs)


factory.register(
    'time',
    extractors=[generic_extractor, generic_required_extractor,
                time_extractor],
    edit_renderers=[time_edit_renderer],
    display_renderers=[time_display_renderer])

factory.doc['blueprint']['time'] = \
"""Add-on blueprint `yafowil.widget.datetime 
<http://github.com/bluedynamics/yafowil.widget.datetime/>`_ .
"""

factory.defaults['time.default'] = ''

factory.defaults['time.class'] = 'time'

factory.defaults['time.required_class'] = 'required'

factory.defaults['time.timepicker_class'] = 'timepicker'
factory.doc['props']['time.timepicker_class'] = \
"""jquery.ui timepicker binds to this class.
"""

factory.defaults['time.disabled'] = False

factory.defaults['time.timepicker'] = False
factory.doc['props']['time.timepicker'] = \
"""Flag whether time picker is enabled.
"""

factory.defaults['time.format'] = 'string'
factory.doc['props']['time.format'] = \
"""Define widget value and extraction format. Either 'string', 'number' or
'tuple'.
"""

factory.defaults['time.unit'] = 'hours'
factory.doc['props']['time.unit'] = \
"""Only considered if 'format' is 'number'. If unit is 'hours' value is float,
otherwise integer.
"""

factory.defaults['time.daytime'] = False
factory.doc['props']['time.daytime'] = \
"""Flag whether value is day of time. Setting this property or 'timepicker'
property above to True results in day time range validation.
"""


@managedprops('required', 'time', 'locale', 'tzinfo')
def datetime_extractor(widget, data):
    time = None
    if attr_value('time', widget, data):
        time = data.request.get('%s.time' % widget.dottedpath)
    required = attr_value('required', widget, data)
    if not required and not data.extracted and not time:
        return ''
    locale = attr_value('locale', widget, data)
    tzinfo = attr_value('tzinfo', widget, data)
    try:
        return convert(data.extracted, time=time, tzinfo=tzinfo, locale=locale)
    except DateTimeConversionError:
        raise ExtractionError('Not a valid date input.')


_mapping = {
    'D': 'day',
    'M': 'month',
    'Y': 'year',
}


def format_date(dt, locale, delim):
    pattern = LocalePattern().date(locale)
    ret = ''
    for char in pattern.split(' '):
        ret = '%s%s%s' % (ret, delim, getattr(dt, _mapping[char]))
    return ret.strip(delim)


def format_time(dt):
    return '%02i:%02i' % (dt.hour, dt.minute)


def render_datetime_input(widget, data, date, time):
    tag = data.tag
    timeinput = ''
    if time:
        timeinput = render_time_input(widget, data, time, 'time')
    additional_classes = []
    datepicker = attr_value('datepicker', widget, data)
    disabled = attr_value('disabled', widget, data)
    if datepicker and not disabled:
        datepicker_class = attr_value('datepicker_class', widget, data)
        additional_classes.append(datepicker_class)
    attrs = {
        'type': 'text',
        'value':  date,
        'name_': widget.dottedpath,
        'id': cssid(widget, 'input'),
        'class_': cssclasses(widget, data, additional=additional_classes),
        'size': 10,
        'disabled': disabled and 'disabled' or None,
    }
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


@managedprops('format', 'class')
def datetime_display_renderer(widget, data, value=None):
    """Note: This renderer function optionally accepts value as parameter,
    which is used in favor of data.value if defined. Thus it can be used as
    utility function inside custom blueprints with the need of datetime
    display rendering.
    """
    value = value and value or data.value
    if not value:
        return u''
    format = widget.attrs['format']
    if callable(format):
        value = format(widget, data)
    else:
        value = value.strftime(format)
    attrs = {
        'id': cssid(widget, 'display'),
        'class_': 'display-%s' % attr_value('class', widget, data)
    }
    return data.tag('div', value, **attrs)


factory.register(
    'datetime',
    extractors=[generic_extractor, generic_required_extractor,
                datetime_extractor],
    edit_renderers=[datetime_edit_renderer],
    display_renderers=[datetime_display_renderer])

factory.doc['blueprint']['datetime'] = \
"""Add-on blueprint `yafowil.widget.datetime 
<http://github.com/bluedynamics/yafowil.widget.datetime/>`_ .
"""

factory.defaults['datetime.default'] = ''

factory.defaults['datetime.class'] = 'datetime'

factory.defaults['datetime.required_class'] = 'required'

factory.defaults['datetime.datepicker_class'] = 'datepicker'
factory.doc['props']['datetime.time'] = \
"""jquery.ui datepicker binds to this class.
"""

factory.defaults['datetime.timepicker_class'] = 'timepicker'
factory.doc['props']['datetime.timepicker_class'] = \
"""jquery.ui timepicker binds to this class.
"""

factory.defaults['datetime.disabled'] = False

factory.defaults['datetime.datepicker'] = False
factory.doc['props']['datetime.datepicker_class'] = \
"""Flag whether date picker is enabled.
"""

factory.defaults['datetime.time'] = False
factory.doc['props']['datetime.time'] = \
"""Flag whether time input should be rendered.

``time`` may be a callable taking widget and data as parameters expect to
return a boolean.
"""

factory.defaults['datetime.timepicker'] = False
factory.doc['props']['datetime.timepicker'] = \
"""Flag whether time picker is enabled.
"""

factory.defaults['datetime.datepicker'] = False
factory.doc['props']['datetime.datepicker'] = \
"""Flag whether date picker is enabled.
"""

factory.defaults['datetime.tzinfo'] = None
factory.doc['props']['datetime.tzinfo'] = \
"""Python datetime tzinfo object.

``tzinfo`` may be a callable taking widget and data as parameters expect to 
return a tzinfo instance.
"""

factory.defaults['datetime.locale'] = 'iso'
factory.doc['props']['datetime.locale'] = \
"""Date input format locale. ``yafowil.widget.datetime`` uses
`bda.intellidatetime <http://pypi.python.org/pypi/bda.intellidatetime/>`_ for
input parsing. Take a look at this package for available locales.

``locale`` may be a callable taking widget and data as parameters expect to 
return a locale string.
"""

factory.defaults['datetime.delimiter'] = '-'
factory.doc['props']['datetime.delimiter'] = \
"""Delimiter used to render date in input field.

``delimiter`` may be a callable taking widget and data as parameters expect to 
return a delimiter string.
"""

factory.defaults['datetime.format'] = '%Y-%m-%d %H:%M'
factory.doc['props']['datetime.format'] = \
"""Pattern accepted by ``datetime.strftime`` or callable taking widget and 
data as parameters returning unicode or utf-8 string. Used if widget mode is 
``display``.
"""
