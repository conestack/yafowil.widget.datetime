from yafowil.base import (
    factory,
    UNSET,
    ExtractionError,
)

def datetime_extractor(widget, data):
    import pdb;pdb.set_trace()

def datetime_renderer(widget, data):
    import pdb;pdb.set_trace()
    return tag('input', **input_attrs)

factory.defaults['%s.required_class' % subtype] = 'required'
factory.defaults['%s.default' % subtype] = ''
factory.register(
    'datetime', 
    [
        generic_extractor,
        generic_required_extractor,
        datetime_extractor,
    ], 
    [
        input_generic_renderer,
        datetime_renderer
    ],
)