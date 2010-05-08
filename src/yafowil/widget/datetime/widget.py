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
        # XXX not only 'iso' date.
        return convert(data.extracted, time=None, tzinfo=None, locale='iso')
    except DateTimeConversionError:
        raise ExtractionError('Not a valid date input.')

def datetime_renderer(widget, data):
    classes = list()
    if widget.attrs.get('datepicker'):
        classes.append('datepicker')
    input_attrs = {
        'type': 'text',
        'value':  _value(widget, data),
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