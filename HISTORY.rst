
History
=======

1.4
------

- Adopt resource providing
  [rnix, 2012-06-12]

- Add example widget
  [rnix, 2012-06-12]

1.3
---

- Sanitize formatting of date: iso always uses dash now, defaults to
  international iso format using dash.
  [jensens, 2012-05-09]

- property ``format`` can be callable now. Expect to returns formatted date.
  properties ``delimiter``, ``time``, ``tzinfo`` or ``locale`` can be callables 
  too now. All callables taking ``widget, data`` as parameters.
  [jensens, 2012-05-09]

- Add documentation for ``datetime`` blueprint properties.
  [rnix, 2012-04-17]

- Add ``delimiter`` blueprint property.
  [rnix, 2012-04-17]

1.2
---

- Add ``render_datetime_input`` and ``render_datetime_display`` helper
  functions. Useful for custom widgets with different data preperation.
  [rnix, 2012-03-06]

- Modified to work with YAFOWIL 1.3
  [agitator, 2012-02-19]

- Extend display renderer to wrap value like ``generic_display_renderer``.
  [rnix, 2011-12-18]

- Add default css class to datetime blueprint.
  [rnix, 2011-12-18]

- Add datepicker binder function to ``yafowil.widget.array`` hooks if found.
  [rnix, 2011-10-05]

1.1
---

- Adopt to yafowil 1.2.
  [jensens, 2011-09-20]

- Make ready for z2c.autoinclude+Plone (only if available).
  [jensens, 2011-09-20]

1.0
---

- Add display renderer.
  [rnix, 2011-08-04]

- Adopt to yafowil 1.1.
  [rnix, 2011-07-08]

0.9.1
-----

- Test coverage.
  [rnix, 2011-05-07]

0.9
---

- Made it work.
  [rnix]
