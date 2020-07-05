from node.utils import UNSET
from yafowil.base import ExtractionError
from yafowil.base import factory
from yafowil.compat import IS_PY2
from yafowil.tests import fxml
from yafowil.tests import YafowilTestCase
import datetime
import unittest
import yafowil.loader  # noqa


if not IS_PY2:
    from importlib import reload


class TestDatetimeWidget(YafowilTestCase):

    def setUp(self):
        super(TestDatetimeWidget, self).setUp()
        from yafowil.widget.datetime import widget
        reload(widget)

    def test_datetime_basics(self):
        # Render very basic widget
        widget = factory(
            'datetime',
            name='dt')
        self.assertEqual(widget(), (
            '<input class="dateinput datetime" id="input-dt" name="dt" '
            'size="10" type="text" value="" />'
        ))

        # Base extraction
        data = widget.extract({})
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['dt', UNSET, '', []]
        )

    def test_datetime_datepicker_class(self):
        # Render datepicker class. Use this to bind a datepicker JS of your
        # choice
        widget = factory(
            'datetime',
            name='dt',
            props={
                'datepicker': True,
            })
        self.assertEqual(widget(), (
            '<input class="dateinput datepicker datetime" id="input-dt" '
            'name="dt" size="10" type="text" value="" />'
        ))

    def test_datetime_without_time_input(self):
        # Widget without time input
        widget = factory(
            'datetime',
            name='dt',
            props={
                'required': 'No date given',
            })
        self.assertEqual(widget(), (
            '<input class="dateinput datetime required" id="input-dt" '
            'name="dt" size="10" type="text" value="" />'
        ))

        # Widget extraction
        request = {'dt': ''}
        data = widget.extract(request)
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['dt', UNSET, '', [ExtractionError('No date given')]]
        )

        # Widget renders empty value
        self.assertEqual(widget(data), (
            '<input class="dateinput datetime required" id="input-dt" '
            'name="dt" size="10" type="text" value="" />'
        ))

        # Widget extraction with non-date input
        request = {'dt': 'xyz'}
        data = widget.extract(request)
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['dt', UNSET, 'xyz', [ExtractionError('Not a valid date input.')]]
        )
        self.assertEqual(widget(data), (
            '<input class="dateinput datetime required" id="input-dt" '
            'name="dt" size="10" type="text" value="xyz" />'
        ))

        # Valid widget extraction. Returns datetime instance
        request = {'dt': '2010.1.1'}
        data = widget.extract(request)
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['dt', UNSET, datetime.datetime(2010, 1, 1, 0, 0), []]
        )
        self.assertEqual(widget(data), (
            '<input class="dateinput datetime required" id="input-dt" '
            'name="dt" size="10" type="text" value="2010.1.1" />'
        ))

    def test_datetime_advanced(self):
        # Widget with more advanced configuration. Widget now renders time
        # input and input converting is locale aware. You can pass ``tzinfo``
        # property as well if you want the conversion to consider timezones
        widget = factory(
            'datetime',
            name='dt',
            props={
                'datepicker': True,
                'required': 'No date given',
                'delimiter': '.',
                'locale': 'de',
                'time': True,
                'timepicker': True,
                'tzinfo': None,
            })
        self.check_output("""
        <div>
          <input class="dateinput datepicker datetime required"
                 id="input-dt" name="dt" size="10" type="text" value=""/>
          <input class="timeinput timepicker" id="input-dt-time" name="dt.time"
                 size="5" type="text" value=""/>
        </div>
        """, fxml('<div>{}</div>'.format(widget())))

        # Widget extraction, no date input was given
        request = {'dt': '', 'dt.time': ''}
        data = widget.extract(request)
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['dt', UNSET, '', [ExtractionError('No date given')]]
        )

        # Widget renders empty value
        self.check_output("""
        <div>
          <input class="dateinput datepicker datetime required" id="input-dt"
                 name="dt" size="10" type="text" value=""/>
          <input class="timeinput timepicker" id="input-dt-time" name="dt.time"
                 size="5" type="text" value=""/>
        </div>
        """, fxml('<div>{}</div>'.format(widget(data))))

        # Widget extraction with non-datetime input
        request = {'dt': 'xyz', 'dt.time': 'x'}
        data = widget.extract(request)
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['dt', UNSET, 'xyz', [ExtractionError('Not a valid date input.')]]
        )
        self.check_output("""
        <div>
          <input class="dateinput datepicker datetime required" id="input-dt"
                 name="dt" size="10" type="text" value="xyz"/>
          <input class="timeinput timepicker" id="input-dt-time" name="dt.time"
                 size="5" type="text" value="x"/>
        </div>
        """, fxml('<div>{}</div>'.format(widget(data))))

        # Valid widget extraction. Returns datetime instance
        request = {'dt': '1.1.2010', 'dt.time': '10:15'}
        data = widget.extract(request)
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['dt', UNSET, datetime.datetime(2010, 1, 1, 10, 15), []]
        )
        self.check_output("""
        <div>
          <input class="dateinput datepicker datetime required" id="input-dt"
                 name="dt" size="10" type="text" value="1.1.2010"/>
          <input class="timeinput timepicker" id="input-dt-time" name="dt.time"
                 size="5" type="text" value="10:15"/>
        </div>
        """, fxml('<div>{}</div>'.format(widget(data))))

    def test_datetime_locale_callable(self):
        # Locale might be a callable
        self.locale_callback_called = False

        def callable_locale(widget, data):
            self.locale_callback_called = True
            return 'de'

        widget = factory(
            'datetime',
            name='dt',
            props={
                'locale': callable_locale
            })
        self.assertEqual(widget(), (
            '<input class="dateinput datetime" id="input-dt" name="dt" '
            'size="10" type="text" value="" />'
        ))
        self.assertTrue(self.locale_callback_called)

        del self.locale_callback_called

    def test_datetime_with_preset_value(self):
        # Test widget with given datetime value
        widget = factory(
            'datetime',
            name='dt',
            value=datetime.datetime(2011, 5, 1),
            props={
                'time': True,
            })
        self.check_output("""
        <div>
          <input class="dateinput datetime" id="input-dt" name="dt" size="10"
                 type="text" value="2011.5.1"/>
          <input class="timeinput" id="input-dt-time" name="dt.time" size="5"
                 type="text" value="00:00"/>
        </div>
        """, fxml('<div>{}</div>'.format(widget())))

    def test_datetime_display(self):
        # display date and time
        widget = factory(
            'datetime',
            name='dt',
            value=datetime.datetime(2011, 5, 1),
            mode='display')
        self.assertEqual(widget(), (
            '<div class="display-datetime" '
            'id="display-dt">2011.05.01 00:00</div>'
        ))

        # display date only
        widget = factory(
            'datetime',
            name='dt',
            value=datetime.datetime(2011, 5, 1),
            props={
                'format': '%Y.%m.%d',
            },
            mode='display')
        self.assertEqual(
            widget(),
            '<div class="display-datetime" id="display-dt">2011.05.01</div>'
        )

        # no value, displays nothing
        widget = factory(
            'datetime',
            name='dt',
            mode='display')
        self.assertEqual(widget(), '')

        # no value, display empty value
        widget = factory(
            'datetime',
            name='dt',
            props={
                'empty_display_value': 'N/A'
            },
            mode='display')
        self.assertEqual(
            widget(),
            '<div class="display-datetime" id="display-dt">N/A</div>'
        )

        # no value, display empty value via callback
        def empty_display_value(widget, data):
            return 'N/A from CB'

        widget = factory(
            'datetime',
            name='dt',
            props={
                'empty_display_value': empty_display_value
            },
            mode='display')
        self.assertEqual(
            widget(),
            '<div class="display-datetime" id="display-dt">N/A from CB</div>'
        )

        # display with formatter callback
        def custom_formatter(widget, data):
            return data.value.strftime('at year %Y at month %m at day %d')

        widget = factory(
            'datetime',
            name='dt',
            value=datetime.datetime(2011, 5, 1),
            props={
                'format': custom_formatter,
            },
            mode='display')
        self.assertEqual(widget(), (
            '<div class="display-datetime" id="display-dt">at year 2011 at '
            'month 05 at day 01</div>'
        ))

    def test_datetime_emptyvalue(self):
        # Test widget with emptyvalue
        emptyvalue = object()
        widget = factory(
            'datetime',
            name='dt',
            props={
                'locale': 'de',
                'time': True,
                'emptyvalue': emptyvalue
            })
        request = {'dt': '1.1.2018', 'dt.time': '12:30'}
        data = widget.extract(request)
        self.assertEqual(data.extracted, datetime.datetime(2018, 1, 1, 12, 30))
        request = {'dt': '', 'dt.time': ''}
        data = widget.extract(request)
        self.assertTrue(data.extracted is emptyvalue)

    def test_time_basics(self):
        # Render base widget
        widget = factory(
            'time',
            name='t')
        self.assertEqual(widget(), (
            '<input class="time timeinput" id="input-t" name="t" size="5" '
            'type="text" value="" />'
        ))

        # Extract empty
        data = widget.extract({})
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['t', UNSET, UNSET, []]
        )

    def test_time_extraction(self):
        widget = factory(
            'time',
            name='t')

        # Invalid time input
        data = widget.extract({'t': 'abcdef'})
        self.assertEqual(
            data.errors,
            [ExtractionError('Not a valid time input.')]
        )

        # Parsing Failure
        data = widget.extract({'t': 'abc'})
        self.assertEqual(
            data.errors,
            [ExtractionError('Failed to parse time input.')]
        )

        # Hours not a number
        data = widget.extract({'t': 'aa00'})
        self.assertEqual(
            data.errors,
            [ExtractionError('Hours not a number.')]
        )

        # Minutes not a number
        data = widget.extract({'t': '00:aa'})
        self.assertEqual(
            data.errors,
            [ExtractionError('Minutes not a number.')]
        )

        # Extract hours and minute without delimiter. Only wotks for
        # 4-character values. Widget format is ``string`` by default
        data = widget.extract({'t': '0101'})
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['t', UNSET, '01:01', []]
        )

        # Extract with delimiter
        data = widget.extract({'t': '1:2'})
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['t', UNSET, '01:02', []]
        )

    def test_time_daytime_extraction(self):
        # Validate day time. triggers if ``daytime`` or ``timepicker``
        # set to ``True``
        widget = factory(
            'time',
            name='t',
            value='02:02',
            props={
                'daytime': True
            })
        data = widget.extract({'t': '25:1'})
        self.assertEqual(
            data.errors,
            [ExtractionError('Hours must be in range 0..23.')]
        )
        data = widget.extract({'t': '1:61'})
        self.assertEqual(
            data.errors,
            [ExtractionError('Minutes must be in range 0..59.')]
        )

        widget = factory(
            'time',
            name='t',
            value='02:02',
            props={
                'timepicker': True
            })
        data = widget.extract({'t': '26:1'})
        self.assertEqual(
            data.errors,
            [ExtractionError('Hours must be in range 0..23.')]
        )
        data = widget.extract({'t': '1:62'})
        self.assertEqual(
            data.errors,
            [ExtractionError('Minutes must be in range 0..59.')]
        )

        # Additional CSS class is rendered for timepicker if ``timepicker`` set
        self.assertEqual(widget(), (
            '<input class="time timeinput timepicker" id="input-t" name="t" '
            'size="5" type="text" value="02:02" />'
        ))

    def test_time_rendering_if_preset_and_extracted(self):
        # Value rendering if preset and extracted
        widget = factory(
            'time',
            name='t',
            value='02:02')
        self.assertEqual(widget(), (
            '<input class="time timeinput" id="input-t" name="t" size="5" '
            'type="text" value="02:02" />'
        ))
        data = widget.extract({'t': '1:12'})
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['t', '02:02', '01:12', []]
        )
        self.assertEqual(widget(data), (
            '<input class="time timeinput" id="input-t" name="t" size="5" '
            'type="text" value="01:12" />'
        ))

    def test_time_display(self):
        # Render display mode without value
        widget = factory('time', 't', mode='display')
        self.assertEqual(widget(), '')

        # Render display mode with value
        widget = factory('time', 't', value='02:02', mode='display')
        self.assertEqual(
            widget(),
            '<div class="display-time" id="display-t">02:02</div>'
        )

    def test_time_invalid_format(self):
        # Invalid ``format``
        widget = factory(
            'time',
            name='t',
            props={
                'format': 'inexistent'
            })
        err = self.expect_error(
            ValueError,
            widget.extract,
            {'t': '1:12'}
        )
        self.assertEqual(str(err), "Unknown format 'inexistent'")

    def test_time_default_format(self):
        # Number ``format``. Default unit is ``hours``
        widget = factory(
            'time',
            name='t',
            props={
                'format': 'number'
            })
        data = widget.extract({'t': '1:12'})
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['t', UNSET, 1.2, []]
        )

    def test_time_format_without_preset_value(self):
        # Number format without preset value
        widget = factory(
            'time',
            name='t',
            props={
                'format': 'number'
            })
        self.assertEqual(widget(), (
            '<input class="time timeinput" id="input-t" name="t" size="5" '
            'type="text" value="" />'
        ))

    def test_time_format_with_preset_value(self):
        # Number format with preset value
        widget = factory(
            'time',
            name='t',
            value=1.2,
            props={
                'format': 'number'
            })
        self.assertEqual(widget(), (
            '<input class="time timeinput" id="input-t" name="t" size="5" '
            'type="text" value="01:12" />'
        ))
        data = widget.extract({'t': '0:12'})
        self.assertEqual('%0.1f' % data.extracted, '0.2')
        self.assertEqual(widget(data), (
            '<input class="time timeinput" id="input-t" name="t" size="5" '
            'type="text" value="00:12" />'
        ))

        widget = factory(
            'time',
            name='t',
            value=0,
            props={
                'format': 'number'
            })
        self.assertEqual(widget(), (
            '<input class="time timeinput" id="input-t" name="t" size="5" '
            'type="text" value="00:00" />'
        ))
        data = widget.extract({'t': ''})
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['t', 0, UNSET, []]
        )
        data = widget.extract({'t': '0:0'})
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['t', 0, 0.0, []]
        )
        self.assertEqual(widget(data), (
            '<input class="time timeinput" id="input-t" name="t" size="5" '
            'type="text" value="00:00" />'
        ))

    def test_time_format_display(self):
        widget = factory(
            'time',
            name='t',
            value=1.2,
            mode='display',
            props={
                'format': 'number'
            })
        self.assertEqual(
            widget(),
            '<div class="display-time" id="display-t">01:12</div>'
        )

    def test_time_format_invalid_unit(self):
        # Invalid ``unit``
        widget = factory(
            'time',
            name='t',
            props={
                'format': 'number',
                'unit': 'inexistent'
            })
        err = self.expect_error(
            ValueError,
            widget.extract,
            {'t': '1:12'}
        )
        self.assertEqual(str(err), "Unknown unit 'inexistent'")

    def test_time_format_minutes_unit(self):
        # Minutes ``unit``
        widget = factory(
            'time',
            name='t',
            props={
                'format': 'number',
                'unit': 'minutes'
            })
        data = widget.extract({'t': '1:12'})
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['t', UNSET, 72, []]
        )

    def test_time_format_unit_with_preset_value(self):
        # Minutes unit with preset value
        widget = factory(
            'time',
            name='t',
            value=12,
            props={
                'format': 'number',
                'unit': 'minutes'
            })
        self.assertEqual(widget(), (
            '<input class="time timeinput" id="input-t" name="t" size="5" '
            'type="text" value="00:12" />'
        ))
        data = widget.extract({'t': '2:30'})
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['t', 12, 150, []]
        )
        self.assertEqual(widget(data), (
            '<input class="time timeinput" id="input-t" name="t" size="5" '
            'type="text" value="02:30" />'
        ))

    def test_time_display_format_unit_with_preset_value(self):
        widget = factory(
            'time',
            name='t',
            value=12,
            mode='display',
            props={
                'format': 'number',
                'unit': 'minutes'
            })
        self.assertEqual(
            widget(),
            '<div class="display-time" id="display-t">00:12</div>'
        )

    def test_time_format_tuple(self):
        # Format tuple. Preset and extraction value is (hh, mm)
        widget = factory(
            'time',
            name='t',
            props={
                'format': 'tuple'
            })
        self.assertEqual(widget(), (
            '<input class="time timeinput" id="input-t" name="t" '
            'size="5" type="text" value="" />'
        ))
        data = widget.extract({'t': '2:30'})
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['t', UNSET, (2, 30), []]
        )

        widget = factory(
            'time',
            name='t',
            value=(5, 30),
            props={
                'format': 'tuple'
            })
        self.assertEqual(widget(), (
            '<input class="time timeinput" id="input-t" name="t" size="5" '
            'type="text" value="05:30" />'
        ))
        data = widget.extract({'t': '2:30'})
        self.assertEqual(widget(data=data), (
            '<input class="time timeinput" id="input-t" name="t" size="5" '
            'type="text" value="02:30" />'
        ))

        widget = factory(
            'time',
            name='t',
            value=(0, 0),
            props={
                'format': 'tuple'
            })
        self.assertEqual(widget(), (
            '<input class="time timeinput" id="input-t" name="t" size="5" '
            'type="text" value="00:00" />'
        ))
        data = widget.extract({'t': ''})
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['t', (0, 0), UNSET, []]
        )
        data = widget.extract({'t': '1:0'})
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['t', (0, 0), (1, 0), []]
        )

    def test_time_emptyvalue(self):
        # Test widget with emptyvalue
        emptyvalue = object()
        widget = factory(
            'time',
            name='t',
            props={
                'format': 'tuple',
                'emptyvalue': emptyvalue
            })
        request = {'t': '12:30'}
        data = widget.extract(request)
        self.assertEqual(data.extracted, (12, 30))
        request = {'t': ''}
        data = widget.extract(request)
        self.assertTrue(data.extracted is emptyvalue)


if __name__ == '__main__':
    unittest.main()
