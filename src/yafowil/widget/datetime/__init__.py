import os 
from yafowil.base import factory


resourcedir = os.path.join(os.path.dirname(__file__), 'resources')

js = [{
    'resource': 'jquery-ui-1.8.18.datepicker.min.js',
    'thirdparty': True,
    'order': 20,
}, {
    'resource': 'widget.js',
    'thirdparty': False,
    'order': 21,
}]

default_css = [{
    'resource': 'jquery-ui-1.8.18.datepicker.css',
    'thirdparty': False,
    'order': 20,
}]

bootstrap_css = [{
    'resource': 'jquery-ui-1.8.16.datepicker.bootstrap.css',
    'thirdparty': False,
    'order': 20,
}]


def register():
    import widget
    factory.register_theme('default', 'yafowil.widget.datetime',
                           resourcedir, js=js, css=default_css)
    factory.register_theme('bootstrap', 'yafowil.widget.datetime',
                           resourcedir, js=js, css=bootstrap_css)