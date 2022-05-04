from yafowil.base import factory


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
        'timepicker': True,
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
        'timepicker': True,
    })
    return {
        'widget': form,
        'doc': DOC_DATETIME,
        'title': 'Datetime',
    }


def get_example():
    return [
        date_example(),
        time_example(),
        datetime_example()
    ]
