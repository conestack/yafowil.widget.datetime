from yafowil.base import factory
from yafowil.utils import entry_point
import os
import webresource as wr


resources_dir = os.path.join(os.path.dirname(__file__), 'resources')


##############################################################################
# Default
##############################################################################

# webresource ################################################################

resources = wr.ResourceGroup(
    name='yafowil.widget.datetime',
    directory=resources_dir,
    path='yafowil-datetime'
)
resources.add(wr.ScriptResource(
    name='datepicker-js',
    resource='datepicker.js',
    compressed='datepicker.min.js'
))
resources.add(wr.ScriptResource(
    name='datepicker-de-js',
    depends='datepicker-js',
    directory=os.path.join(resources_dir, 'locales'),
    path='yafowil-datetime/locales',
    resource='de.js'
))
resources.add(wr.ScriptResource(
    name='yafowil-datetime-js',
    depends=['jquery-js', 'datepicker-js'],
    resource='widget.js',
    compressed='widget.min.js'
))
resources.add(wr.StyleResource(
    name='yafowil-datepicker-css',
    resource='datepicker.css'
))
resources.add(wr.StyleResource(
    name='yafowil-timepicker-css',
    resource='timepicker.css'
))

# B/C resources ##############################################################

js = [{
    'group': 'yafowil.widget.datetime.common',
    'resource': 'datepicker.js',
    'order': 20,
}, {
    'group': 'yafowil.widget.datetime.common',
    'resource': 'locales/de.js',
    'order': 20,
}, {
    'group': 'yafowil.widget.datetime.common',
    'resource': 'widget.js',
    'order': 20,
}]
css = [{
    'group': 'yafowil.widget.datetime.common',
    'resource': 'datepicker.css',
    'order': 20,
}, {
    'group': 'yafowil.widget.datetime.common',
    'resource': 'timepicker.css',
    'order': 20,
}]


##############################################################################
# Registration
##############################################################################

@entry_point(order=10)
def register():
    from yafowil.widget.datetime import widget  # noqa

    widget_name = 'yafowil.widget.datetime'

    # Default
    factory.register_theme(
        'default',
        widget_name,
        resources_dir,
        js=js,
        css=css
    )
    factory.register_resources('default', widget_name, resources)
