from yafowil.base import factory
from yafowil.utils import entry_point
import os
import webresource as wr


resources_dir = os.path.join(os.path.dirname(__file__), 'resources')


##############################################################################
# Default
##############################################################################

# webresource ################################################################

scripts = wr.ResourceGroup(
    name='yafowil-datetime-scripts',
    path='yafowil.widget.datetime'
)
scripts.add(wr.ScriptResource(
    name='datepicker-js',
    directory=resources_dir,
    resource='datepicker.js',
    compressed='datepicker.min.js'
))
scripts.add(wr.ScriptResource(
    name='datepicker-de-js',
    depends='datepicker-js',
    directory=os.path.join(resources_dir, 'locales'),
    resource='de.js'
))
scripts.add(wr.ScriptResource(
    name='yafowil-datetime-js',
    depends=['jquery-js', 'datepicker-js'],
    directory=resources_dir,
    resource='widget.js',
    compressed='widget.min.js'
))

styles = wr.ResourceGroup(
    name='yafowil-datetime-styles',
    path='yafowil.widget.datetime'
)
styles.add(wr.StyleResource(
    name='yafowil-datepicker-css',
    directory=resources_dir,
    resource='datepicker.css'
))
styles.add(wr.StyleResource(
    name='yafowil-timepicker-css',
    directory=resources_dir,
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

    # Default
    factory.register_theme(
        'default', 'yafowil.widget.datetime', resources_dir,
        js=js, css=css
    )
    factory.register_scripts('default', 'yafowil.widget.datetime', scripts)
    factory.register_styles('default', 'yafowil.widget.datetime', styles)
