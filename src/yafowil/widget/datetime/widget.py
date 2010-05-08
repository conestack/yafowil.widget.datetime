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
    DateTimeConversionError,
)

def datetime_extractor(widget, data):
    try:
        # XXX not only 'de' date. read from widget attrs.
        return convert(data.extracted, time=None, tzinfo=None, locale='de')
    except DateTimeConversionError:
        raise ExtractionError('Not a valid date input.')

def datetime_renderer(widget, data):
    classes = list()
    if widget.attrs.get('datepicker'):
        classes.append('datepicker')
    value = None
    if data.value and isinstance(data.value, datetime):
        value = '%s.%s.%s' % (data.value.day,
                              data.value.month,
                              data.value.year)
    if data.extracted and isinstance(data.extracted, datetime):
        value = '%s.%s.%s' % (data.extracted.day,
                              data.extracted.month,
                              data.extracted.year)
    if not value:
        value = _value(widget, data)
    input_attrs = {
        'type': 'text',
        'value':  value,
        'name_': widget.dottedpath,
        'id': cssid(widget, 'input'),    
        'class_': cssclasses(widget, data, *classes),    
    }
    return tag('input', **input_attrs)

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