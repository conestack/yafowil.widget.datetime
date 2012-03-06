from datetime import datetime
from yafowil.base import (
    factory,
    UNSET,
    ExtractionError,
    fetch_value
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
)
from bda.intellidatetime import (
    convert,
    LocalePattern,
    DateTimeConversionError,
)


def datetime_extractor(widget, data):
    time = None
    if widget.attrs.get('time'):
        time = data.request.get('%s.time' % widget.dottedpath)
    if not widget.attrs.get('required') and not data.extracted and not time:
        return ''
    try:
        locale = widget.attrs.get('locale', 'iso')
        tzinfo = widget.attrs.get('tzinfo', None)
        return convert(data.extracted, time=time, tzinfo=tzinfo, locale=locale)
    except DateTimeConversionError:
        raise ExtractionError('Not a valid date input.')


_mapping = {
    'D': 'day',
    'M': 'month',
    'Y': 'year',
}

def format_date(dt, locale):
    pattern = LocalePattern().date(locale)
    ret = ''
    for char in pattern.split(' '):
        ret = '%s.%s' % (ret, getattr(dt, _mapping[char]))
    return ret.strip('.')


def format_time(dt):
    return '%02i:%02i' % (dt.hour, dt.minute)


def render_datetime_input(widget, data, date, time):
    tag = data.tag
    timeinput = ''
    if time:
        if time is True:
            time = ''
        if not time and data.request:
            time = data.request.get('%s.time' % widget.dottedpath)
        timeinput = tag('input', **{
            'type': 'text',
            'value': time,
            'name_': '%s.time' % widget.dottedpath,
            'id': cssid(widget, 'input', 'time'),
            'size': 5,
        })
    additional_classes = []
    if widget.attrs.get('datepicker'):
        additional_classes.append(widget.attrs.get('datepicker_class'))
    attrs = {
        'type': 'text',
        'value':  date,
        'name_': widget.dottedpath,
        'id': cssid(widget, 'input'),    
        'class_': cssclasses(widget, data, additional=additional_classes),  
        'size': 10,
    }        
    return tag('input', **attrs) + timeinput


@managedprops('locale', *css_managed_props)
def datetime_edit_renderer(widget, data):
    locale = widget.attrs.get('locale', 'iso')
    if callable(locale):
        locale = locale(widget, data)
    date = None
    time = widget.attrs.get('time')
    if data.value and isinstance(data.value, datetime):
        date = format_date(data.value, locale)
        if time:
            time = format_time(data.value)
    if data.extracted and isinstance(data.extracted, datetime):
        date = format_date(data.extracted, locale)
        if time:
            time = format_time(data.extracted)
    if not date:
        date = fetch_value(widget, data)
    return render_datetime_input(widget, data, date, time)


def render_datetime_display(widget, data, value):
    if not value:
        return u''
    format = widget.attrs['format']
    attrs = {
        'id': cssid(widget, 'display'),
        'class_': 'display-%s' % widget.attrs['class']
    }
    return data.tag('div', value.strftime(format), **attrs)


def datetime_display_renderer(widget, data):
    return render_datetime_display(widget, data, data.value)


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

factory.defaults['datetime.class'] = 'datetime'

factory.defaults['datetime.required_class'] = 'required'

factory.defaults['datetime.datepicker_class'] = 'datepicker'

factory.defaults['datetime.default'] = ''

factory.defaults['datetime.format'] = '%Y.%m.%d - %H:%M'
factory.doc['props']['datetime.format'] = \
"""Pattern accepted by ``datetime.strftime``.
"""