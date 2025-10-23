from yafowil.base import factory
import datetime


DOC_DATE = """
Date Picker
-----------

Date input.

.. code-block:: python

    date = factory('#field:datetime', props={
        'label': 'Enter date or use date picker',
        'required': 'Date Field is required',
        'datepicker': True,
    })
"""


def date_example():
    form = factory('fieldset', name='yafowil.widget.datetime.date')
    form['date'] = factory('#field:datetime', props={
        'label': 'Enter date or use date picker',
        'required': 'Date Field is required',
        'datepicker': True,
    })
    return {
        'widget': form,
        'doc': DOC_DATE,
        'title': 'Date',
    }


DOC_TIME = """
Time Picker
-----------

Time input.

Set the 'clock' property to either 12 or 24 hours format (defaults to 24).

.. code-block:: python

    time = factory('#field:time', props={
        'label': 'Select time',
        'required': 'Time Field is required',
        'timepicker': True,
        'clock': '12'
    })
"""


def time_example():
    form = factory('fieldset', name='yafowil.widget.datetime.time')
    form['time'] = factory('#field:time', props={
        'label': 'Select time',
        'required': 'Time Field is required',
        'timepicker': True,
        'clock': '12'
    })
    return {
        'widget': form,
        'doc': DOC_TIME,
        'title': 'Time',
    }


DOC_MINUTES = """
Minutes
-------

Sets the interval for minute cells.

Set the 'minutes_step' property to a number between 1 and 60 (defaults to 5).

.. code-block:: python

    time = factory('#field:time', props={
        'label': 'Select time',
        'required': 'Time Field is required',
        'timepicker': True,
        'clock': '24',
        'minutes_step': '15'
    })
"""


def minutes_example():
    form = factory('fieldset', name='yafowil.widget.datetime.minutes_step')
    form['time'] = factory('#field:time', props={
        'label': 'Select time',
        'required': 'Time Field is required',
        'timepicker': True,
        'clock': '24',
        'minutes_step': '15'
    })
    return {
        'widget': form,
        'doc': DOC_MINUTES,
        'title': 'Minutes'
    }


DOC_DATETIME = """
Datetime Picker
---------------

Date and time input.

.. code-block:: python

    datetime = factory('#field:datetime', props={
        'label': 'Enter date and time',
        'required': 'Datetime Field is required',
        'locale': 'de',
        'datepicker': True,
        'time': True,
        'timepicker': True
    })
"""


def datetime_example():
    form = factory('fieldset', name='yafowil.widget.datetime.datetime')
    form['datetime'] = factory('#field:datetime', props={
        'label': 'Enter date and time',
        'required': 'Datetime Field is required',
        'locale': 'de',
        'datepicker': True,
        'time': True,
        'timepicker': True
    })
    return {
        'widget': form,
        'doc': DOC_DATETIME,
        'title': 'Datetime'
    }


DOC_DISPLAY = """
Display Mode
------------

The widget's display mode renders the widget value inside an uneditable div.

The wrapper div can receive additional classes via the ``display_class``
widget attribute.

.. code-block:: python

    value = datetime.datetime.now()

    datetime = factory('#field:datetime', value=value, mode='display', props={
        'label': 'Datetime Picker in Display Mode',
        'locale': 'de',
        'datepicker': True,
        'time': True,
        'timepicker': True,
        # 'display_class': 'my-additional-class'
    })
"""


def display_example():
    value = datetime.datetime.now()
    form = factory('fieldset', name='yafowil.widget.datetime.display')
    form['datetime'] = factory('#field:datetime', value=value, mode='display', props={
        'label': 'Datetime Picker in Display Mode',
        'locale': 'de',
        'datepicker': True,
        'time': True,
        'timepicker': True
    })
    return {
        'widget': form,
        'doc': DOC_DISPLAY,
        'title': 'Display Mode'
    }


def get_example():
    return [
        date_example(),
        time_example(),
        minutes_example(),
        datetime_example(),
        display_example()
    ]
