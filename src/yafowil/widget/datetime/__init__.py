from yafowil.base import factory
from yafowil.utils import entry_point
import os
import webresource as wr


resources_dir = os.path.join(os.path.dirname(__file__), 'resources')


##############################################################################
# vanillajs-datepicker
##############################################################################

# webresource ################################################################

vanillajs_datepicker_js = wr.ScriptResource(
    name='datepicker-js',
    directory=os.path.join(resources_dir, 'vanillajs-datepicker'),
    path='yafowil-datetime/vanillajs-datepicker',
    resource='datepicker.js',
    compressed='datepicker.min.js'
)


##############################################################################
# locale
##############################################################################

# webresource ################################################################

locale_de = wr.ScriptResource(
    name='datepicker-de-js',
    depends='datepicker-js',
    directory=os.path.join(resources_dir, 'locales'),
    path='yafowil-datetime/locales',
    resource='de.js'
)


##############################################################################
# Default
##############################################################################

# webresource ################################################################

resources = wr.ResourceGroup(
    name='yafowil.widget.datetime',
    directory=resources_dir,
    path='yafowil-datetime'
)
resources.add(vanillajs_datepicker_js)
resources.add(locale_de)
resources.add(wr.ScriptResource(
    name='yafowil-datetime-js',
    directory=os.path.join(resources_dir, 'default'),
    path='yafowil-datetime/default',
    depends=['jquery-js', 'datepicker-js'],
    resource='widget.js',
    compressed='widget.min.js'
))
resources.add(wr.StyleResource(
    name='yafowil-datepicker-css',
    directory=os.path.join(resources_dir, 'default'),
    path='yafowil-datetime/default',
    resource='datepicker.min.css'
))
resources.add(wr.StyleResource(
    name='yafowil-timepicker-css',
    directory=os.path.join(resources_dir, 'default'),
    path='yafowil-datetime/default',
    resource='timepicker.min.css'
))

# B/C resources ##############################################################

js = [{
    'group': 'yafowil.widget.datetime.common',
    'resource': 'vanillajs-datepicker/datepicker.js',
    'order': 20,
}, {
    'group': 'yafowil.widget.datetime.common',
    'resource': 'locales/de.js',
    'order': 20,
}, {
    'group': 'yafowil.widget.datetime.common',
    'resource': 'default/widget.js',
    'order': 20,
}]
css = [{
    'group': 'yafowil.widget.datetime.common',
    'resource': 'default/datepicker.min.css',
    'order': 20,
}, {
    'group': 'yafowil.widget.datetime.common',
    'resource': 'default/timepicker.min.css',
    'order': 20,
}]


##############################################################################
# Bootstrap 5
##############################################################################

# webresource ################################################################

bootstrap5_resources = wr.ResourceGroup(
    name='yafowil.widget.datetime',
    directory=resources_dir,
    path='yafowil-datetime'
)
bootstrap5_resources.add(vanillajs_datepicker_js)
bootstrap5_resources.add(locale_de)
bootstrap5_resources.add(wr.ScriptResource(
    name='yafowil-datetime-js',
    directory=os.path.join(resources_dir, 'bootstrap5'),
    path='yafowil-datetime/bootstrap5',
    depends=['jquery-js', 'datepicker-js'],
    resource='widget.js',
    compressed='widget.min.js'
))
bootstrap5_resources.add(wr.StyleResource(
    name='yafowil-datepicker-css',
    directory=os.path.join(resources_dir, 'bootstrap5'),
    path='yafowil-datetime/bootstrap5',
    resource='datepicker.min.css'
))
bootstrap5_resources.add(wr.StyleResource(
    name='yafowil-timepicker-css',
    directory=os.path.join(resources_dir, 'bootstrap5'),
    path='yafowil-datetime/bootstrap5',
    resource='timepicker.min.css'
))
# B/C resources ##############################################################

bootstrap5_js = [{
    'group': 'yafowil.widget.datetime.common',
    'resource': 'vanillajs-datepicker/datepicker.js',
    'order': 20,
}, {
    'group': 'yafowil.widget.datetime.common',
    'resource': 'locales/de.js',
    'order': 20,
}, {
    'group': 'yafowil.widget.datetime.common',
    'resource': 'bootstrap5/widget.js',
    'order': 20,
}]
bootstrap5_css = [{
    'group': 'yafowil.widget.datetime.common',
    'resource': 'bootstrap5/datepicker.min.css',
    'order': 20,
}, {
    'group': 'yafowil.widget.datetime.common',
    'resource': 'bootstrap5/timepicker.min.css',
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

    # Bootstrap 5
    factory.register_theme(
        ['bootstrap5'],
        widget_name,
        resources_dir,
        js=bootstrap5_js,
        css=bootstrap5_css
    )

    factory.register_resources(
        ['bootstrap5'],
        widget_name,
        bootstrap5_resources
    )
