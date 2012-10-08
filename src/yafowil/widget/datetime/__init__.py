import os 
from yafowil.base import factory


resourcedir = os.path.join(os.path.dirname(__file__), 'resources')
js = [{
    'group': 'yafowil.widget.datetime.datepicker',
    'resource': 'jquery-ui-1.8.18.datepicker.min.js',
    'order': 20,
}, {
    'group': 'yafowil.widget.datetime.timepicker',
    'resource': 'jquery.ui.timepicker.js',
    'order': 20,
}, {
    'group': 'yafowil.widget.datetime.common',
    'resource': 'widget.js',
    'order': 21,
}]
default_css = [{
    'group': 'yafowil.widget.datetime.datepicker',
    'resource': 'jquery-ui-1.8.18.datepicker.css',
    'order': 20,
}, {
    'group': 'yafowil.widget.datetime.timepicker',
    'resource': 'jquery.ui.timepicker.css',
    'order': 20,
}]
bootstrap_css = [{
    'group': 'yafowil.widget.datetime.datepicker',
    'resource': 'jquery-ui-1.8.16.datepicker.bootstrap.css',
    'order': 20,
}, {
    'group': 'yafowil.widget.datetime.timepicker',
    'resource': 'jquery.ui.timepicker.bootstrap.css',
    'order': 20,
}]


def register():
    import widget
    factory.register_theme('default', 'yafowil.widget.datetime',
                           resourcedir, js=js, css=default_css)
    factory.register_theme('bootstrap', 'yafowil.widget.datetime',
                           resourcedir, js=js, css=bootstrap_css)