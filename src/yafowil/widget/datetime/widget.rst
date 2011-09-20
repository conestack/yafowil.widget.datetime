Datetime widget
===============

Features
--------

- Use ``bda.intellidatetime`` for extraction

- Render with or without time input

Load requirements::

    >>> import yafowil.loader
    >>> import yafowil.widget.datetime

Test widget::

    >>> from yafowil.base import factory

Render very basic widget::

    >>> widget = factory('datetime', 'dt')
    >>> widget()
    u'<input id="input-dt" name="dt" size="10" type="text" value="" />'

Base extraction::

    >>> data = widget.extract({})
    >>> data.printtree()
    <RuntimeData dt, value=<UNSET>, extracted='' at ...>

Render datepicker class. Use this to bind a datepicker JS of your choice::
  
    >>> widget = factory(
    ...     'datetime',
    ...     'dt',
    ...     props = {
    ...         'datepicker': True,
    ...     })
    >>> widget()
    u'<input class="datepicker" id="input-dt" name="dt" size="10" 
    type="text" value="" />'

Widget without time input::

    >>> widget = factory(
    ...     'datetime',
    ...     'dt',
    ...     props = {
    ...         'required': 'No date given',
    ...     })
    >>> widget()
    u'<input class="required" id="input-dt" name="dt" size="10" 
    type="text" value="" />'

Widget extraction::

    >>> request = {'dt': ''}
    >>> data = widget.extract(request)
    >>> data.errors
    [ExtractionError('No date given',)]

    >>> data.extracted
    ''

Widget renders empty value::

    >>> widget(data)
    u'<input class="required" id="input-dt" name="dt" size="10" 
    type="text" value="" />'

Widget extraction with non-date input::

    >>> request = {'dt': 'xyz'}
    >>> data = widget.extract(request)
    >>> data.errors
    [ExtractionError('Not a valid date input.',)]
    
    >>> data.extracted
    'xyz'
    
    >>> widget(data)
    u'<input class="required" id="input-dt" name="dt" size="10" type="text" 
    value="xyz" />'

Valid widget extraction. Returns datetime instance::

    >>> request = {'dt': '2010.1.1'}
    >>> data = widget.extract(request)
    >>> data.errors
    []
    
    >>> data.extracted
    datetime.datetime(2010, 1, 1, 0, 0)
    
    >>> # widget(data) XXX: required renderer invalid
    u'<input class="required" id="input-dt" name="dt" type="text" 
    value="2010.1.1" />'    

Widget with more advanced configuration. Widget now renders time input and
input converting is locale aware. You can pass ``tzinfo`` property as well if
you want the conversion to consider timezones::

    >>> widget = factory(
    ...     'datetime',
    ...     'dt',
    ...     props = {
    ...         'datepicker': True,
    ...         'required': 'No date given',
    ...         'locale': 'de',
    ...         'time': True,
    ...         'tzinfo': None,
    ...     })
    >>> widget()
    u'<input class="datepicker required" id="input-dt" name="dt" size="10" 
    type="text" value="" /><input id="input-dt-time" name="dt.time" size="5" 
    type="text" value="" />'
    
Widget extraction::

    >>> request = {'dt': '', 'dt.time': ''}
    >>> data = widget.extract(request)

No input was given::

    >>> data.errors
    [ExtractionError('No date given',)]

Empty string in extracted data::

    >>> data.extracted
    ''

Widget renders empty value::

    >>> widget(data)
    u'<input class="datepicker required" id="input-dt" name="dt" size="10" 
    type="text" value="" /><input id="input-dt-time" name="dt.time" size="5" 
    type="text" value="" />'

Widget extraction with non-datetime input::

    >>> request = {'dt': 'xyz', 'dt.time': 'x'}
    >>> data = widget.extract(request)
    >>> data.errors
    [ExtractionError('Not a valid date input.',)]
    
    >>> data.extracted
    'xyz'
    
    >>> widget(data)
    u'<input class="datepicker required" id="input-dt" name="dt" size="10" 
    type="text" value="xyz" /><input id="input-dt-time" name="dt.time" 
    size="5" type="text" value="x" />'

Valid widget extraction. Returns datetime instance::

    >>> request = {'dt': '1.1.2010', 'dt.time': '10:15'}
    >>> data = widget.extract(request)
    >>> data.errors
    []
    
    >>> data.extracted
    datetime.datetime(2010, 1, 1, 10, 15)
    
    >>> widget(data)
    u'<input class="datepicker required" id="input-dt" name="dt" size="10" 
    type="text" value="1.1.2010" /><input id="input-dt-time" name="dt.time" 
    size="5" type="text" value="10:15" />'
    
Locale might be a callable::
    
    >>> def callable_locale(widget, data):
    ...     print "locale called"
    ...     return 'de'
    >>> widget = factory('datetime', 'dt',
    ...     props = { 'locale': callable_locale })
    >>> widget()
    locale called
    u'<input id="input-dt" name="dt" size="10" type="text" value="" />'

Test widget with given datetime value::

    >>> import datetime
    >>> widget = factory(
    ...     'datetime',
    ...     'dt',
    ...     value=datetime.datetime(2011, 5, 1),
    ...     props = {
    ...         'time': True,
    ...     })
    >>> widget()
    u'<input id="input-dt" name="dt" size="10" type="text" value="2011.5.1" 
    /><input id="input-dt-time" name="dt.time" size="5" type="text" 
    value="00:00" />'

Test widget in display mode::

    >>> widget = factory(
    ...     'datetime',
    ...     'dt',
    ...     value=datetime.datetime(2011, 5, 1),
    ...     mode='display')
    >>> widget()
    '2011.05.01 - 00:00'
    
    >>> widget = factory(
    ...     'datetime',
    ...     'dt',
    ...     value=datetime.datetime(2011, 5, 1),
    ...     props = {
    ...         'format': '%Y.%m.%d',
    ...     },
    ...     mode='display')
    >>> widget()
    '2011.05.01'
    
    >>> widget = factory(
    ...     'datetime',
    ...     'dt',
    ...     mode='display')
    >>> widget()
    u''
