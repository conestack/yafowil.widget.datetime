from yafowil.base import (
    factory,
    UNSET,
    ExtractionError,
)
from yafowil.common import (
    generic_extractor,
    generic_required_extractor,
    input_generic_renderer,
    InputGenericPreprocessor,
)
from yafowil.utils import (
    tag,
    cssclasses,
)

def datetime_extractor(widget, data):
    import pdb;pdb.set_trace()

def datetime_renderer(widget, data):
    attrs = {
        'src': widget.attrs.icon,
        'alt': widget.attrs.alt,
        'title': widget.attrs.title,
        'class_': cssclasses(widget, data, widget.attrs.class_)
    }
    return data.rendered + tag('img', **attrs)

factory.defaults['datetime.required_class'] = 'required'
factory.defaults['datetime.default'] = ''
factory.defaults['datetime.icon'] = '/calendar16_16.png'
factory.defaults['datetime.alt'] = 'Calendar'
factory.defaults['datetime.title'] = 'Choose Date'
factory.defaults['datetime.class_'] = 'triggerdatepicker'
factory.register(
    'datetime', 
    [
        generic_extractor,
        generic_required_extractor,
        datetime_extractor,
    ], 
    [
        input_generic_renderer,
        datetime_renderer,
    ],
    [
        InputGenericPreprocessor('text'),
    ],
)