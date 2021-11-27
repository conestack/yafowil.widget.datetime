from yafowil.base import factory
from yafowil.utils import entry_point
import os


resourcedir = os.path.join(os.path.dirname(__file__), 'resources')
js = [{
    'group': 'yafowil.widget.datetime.common',
    'resource': 'datepicker.js',
    'order': 20,
}, {
    'group': 'yafowil.widget.datetime.common',
    'resource': 'datetime.js',
    'order': 20,
}]
default_css = [{
    'group': 'yafowil.widget.datetime.common',
    'resource': 'datepicker.css',
    'order': 20,
}, {
    'group': 'yafowil.widget.datetime.common',
    'resource': 'timepicker.css',
    'order': 20,
}]


@entry_point(order=10)
def register():
    from yafowil.widget.datetime import widget  # noqa
    factory.register_theme(
        'default',
        'yafowil.widget.datetime',
        resourcedir,
        js=js,
        css=default_css
    )
