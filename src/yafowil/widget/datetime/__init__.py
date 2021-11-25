from yafowil.base import factory
from yafowil.utils import entry_point
import os


resourcedir = os.path.join(os.path.dirname(__file__), 'resources')
js = [{
    'group': 'yafowil.widget.datetime.common',
    'resource': 'datetime.js',
    'order': 21,
}]
default_css = [{
    'group': 'yafowil.widget.datetime.common',
    'resource': 'datepicker.css',
    'order': 21,
}]
bootstrap_css = [{
    'group': 'yafowil.widget.datetime.common',
    'resource': 'datepicker-bs4.css',
    'order': 21,
}]
plone5_css = [{
    'group': 'yafowil.widget.datetime.common',
    'resource': 'widget-plone5.css',
    'order': 21,
}]


@entry_point(order=10)
def register():
    from yafowil.widget.datetime import widget  # noqa
    factory.register_theme('default', 'yafowil.widget.datetime',
                           resourcedir, js=js, css=default_css)
    factory.register_theme('bootstrap', 'yafowil.widget.datetime',
                           resourcedir, js=js, css=bootstrap_css)
    factory.register_theme('plone5', 'yafowil.widget.datetime',
                           resourcedir, js=js, css=plone5_css)
