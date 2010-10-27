from datetime import datetime
from yafowil.base import (
    factory,
    UNSET,
    ExtractionError,
)
from yafowil.common import (
    _value,
    generic_extractor,
    generic_required_extractor,
)
from yafowil.utils import (
    tag,
    cssid,
    cssclasses,
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

def datetime_renderer(widget, data):
    classes = list()
    if widget.attrs.get('datepicker'):
        classes.append('datepicker')
    locale = widget.attrs.get('locale', 'iso')
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
        date = _value(widget, data)
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
            'id': '%s-time' % cssid(widget, 'input'),
            'size': 5,
        })
    return tag('input', **{
        'type': 'text',
        'value':  date,
        'name_': widget.dottedpath,
        'id': cssid(widget, 'input'),    
        'class_': cssclasses(widget, data, *classes),  
        'size': 10,
    }) + timeinput

factory.defaults['datetime.required_class'] = 'required'
factory.defaults['datetime.default'] = ''
factory.register(
    'datetime', 
    [
        generic_extractor,
        generic_required_extractor,
        datetime_extractor,
    ], 
    [
        datetime_renderer,
    ],
)