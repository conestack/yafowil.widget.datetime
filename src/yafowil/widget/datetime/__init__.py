from yafowil.base import factory
from yafowil.utils import entry_point
import os
import webresource as wr


resources_dir = os.path.join(os.path.dirname(__file__), 'resources')


##############################################################################
# Default
##############################################################################

# webresource ################################################################

scripts = wr.ResourceGroup(name='scripts')
scripts.add(wr.ScriptResource(
    name='datepicker-js',
    # actually it not depends on jquery, but yafowil-datetime-js does
    # think about multiple depends values in webresource
    depends='jquery-js',
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
    depends='datepicker-js',
    directory=resources_dir,
    resource='widget.js',
    compressed='widget.min.js'
))

styles = wr.ResourceGroup(name='styles')
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

resources = wr.ResourceGroup(name='datetime-resources')
resources.add(scripts)
resources.add(styles)

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
        js=js, css=css, resources=resources
    )
