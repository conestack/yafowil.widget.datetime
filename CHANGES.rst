Changes
=======

2.0.3 (unreleased)
------------------

- Fix spellchecking not being disabled on the timepicker input. With jQuery 4
  ``.attr('spellcheck', false)`` removes the attribute instead of setting
  ``spellcheck="false"``.
  [rnix]

- Fix typing a 12 o'clock time into a 12-hour timepicker. ``12:30pm`` raised a
  ``TypeError`` on keyup, ``12:30am`` selected the P.M. hour and rewrote the
  input to ``00:30PM``. 12 o'clock selects the ``00`` hour of its period now.
  [rnix]

- Fix the default timepicker ``destroy`` leaving its window resize handler
  bound.
  [rnix]

- Fix the datepicker ``destroy`` leaving its trigger button in the DOM. The
  bootstrap5 datepicker no longer removes the server rendered input on
  ``destroy``.
  [rnix]

- Add ``@popperjs/core`` as dev dependency for testing the bootstrap5 widget.
  [rnix]

- Extend the JS tests to 100 % coverage, all modules including bundles are
  loaded by the tests now.
  [rnix]

- Lint and format the JS code with biome. ``make check`` runs ``biome check``,
  ``make format`` runs ``biome check --write`` (see ``include.mk``). Behavior
  unchanged.
  [rnix]

- JS tooling: Commit ``pnpm-lock.yaml``. Upgrade ``@web/test-runner`` to 1.0
  and run the JS tests headless in Chromium via Playwright, installed in the JS
  CI workflow. Drop the accidental ``install`` dev dependency. Pin patched
  versions of vulnerable transitive dependencies via ``pnpm.overrides``.
  [rnix]

- Modernise the code ruff flags as outdated: ``u''`` prefixes and ``.format()``
  over f-strings. Behaviour unchanged. ``super(Class, self)`` is kept, see
  ``cone.app``.
  [rnix]

- Sort the imports with ruff (one per line, ``from`` imports first, no
  sections) and format the code with ``ruff format`` (90 characters per line,
  single quotes).
  [rnix]

- Add ``qa.ruff`` domain to Makefile and pin the ruff configuration in
  ``pyproject.toml``, ``make check`` runs ``ruff check``.
  [rnix]

- Drop the Python 2 remnants: ``yafowil.compat`` usage and ``IS_PY2`` branches.
  [rnix]

- Declare ``requires-python = ">=3.10"``.
  [rnix]


2.0.2 (2026-10-24)
------------------

- Ignore a second ``initialize`` on an element that already carries a widget.
  ``initialize`` takes a context, and a context is commonly a parent - an ajax
  reload that replaces one element re-binds its parent, so every input beside
  the replaced one arrives a second time. The widget stored itself under
  ``elem.data('yafowil-datepicker')`` / ``'yafowil-timepicker'`` already; only
  the check was missing. Without it a field collects another trigger button on
  every reload and its handlers are bound repeatedly.
  [rnix]


2.0.1 (2026-04-28)
------------------

- Add placeholder to widget.
  [lenadax]


2.0.0 (2026-02-03)
------------------

- Refactor package layout to use ``pyproject.toml`` and implicit namespace packages.
  [rnix]

- Use ``empty_display_value`` and ``display_class`` widget properties in display
  renderers.
  [lenadax]

- Update jQuery to version ``4.0.0-beta.2``.
  [lenadax]

- Introduce ``datetime.wrapper_class``, ``datetime.datepicker_wrapper_class`` and
  ``datetime.timepicker_wrapper_class`` widget properties for bootstrap5 styling.

- Implement dark theme for ``Bootstrap5`` dark theme mode.
  [lenadax]

- Use rollup for bundling scss. Use ``make rollup`` to compile js and scss.
  [lenadax]

- Use ``webtestrunner`` instead of ``karma`` for js tests. Use ``make wtr`` to run tests.
  [lenadax]

- Use ``pnpm`` as package manager.
  [lenadax]

- Create Bootstrap5 widget version.
  [lenadax]


2.0a2 (2023-09-28)
------------------

- ``datetime_extractor`` returns ``None`` instead of empty string if widget is
  present in form but no value given.
  [rnix]


2.0a1 (2023-05-15)
------------------

- Add ``webresource`` support.
  [rnix]

- Prevent initialize if widget is part of array template.
  [lenadax]

- Extend JS by:
  ``datepicker_on_array_add``,
  ``timeepicker_on_array_add``,
  ``register_datepicker_array_subscribers``,
  ``register_timepicker_array_subscribers``
  to enable usage in ``yafowil.widget.array``.
  [lenadax]

- Get rid of JQuery UI.
  [lenadax]

- Rewrite JavaScript using ES6. Utilize vanillajs-datepicker


1.14 (2025-11-03)
-----------------

- Pin upper versions of dependencies.
  [lenadax]


1.13 (2022-10-06)
-----------------

- Add support for usage in ``yafowil.widget.array`` - remove date/timepicker
  related css classes ``hasDatepicker, hasTimepicker`` before initialize.
  [lenadax]

- Fix case time value is no tuple in ``time_value``.
  [lenadax]


1.12 (2020-07-09)
-----------------

- Add ``datetime.empty_display_value`` property.
  [rnix]

- Cast hour and minute values to int in ``time_value`` if ``format`` is
  ``tuple``.
  [rnix]

- Do not mask built-in ``format`` function in ``widget`` module.
  [rnix]


1.11 (2018-11-07)
-----------------

- Add ``yafowil.common.generic_emptyvalue_extractor`` to ``time`` and
  ``datetime`` blueprints.
  [rnix]


1.10 (2018-07-16)
-----------------

- Python 3 compatibility.
  [rnix]

- Convert doctests to unittests.
  [rnix]


1.9 (2017-03-10)
----------------

- Add dedicated Plone 5 related CSS.
  [rnix, 2017-03-06]

- Introduce dedicated ``timeinput_class`` and ``dateinput_class`` widget
  properties. Used for CSS styling. Styling was previously bound to
  ``datepicker_class`` and ``timepicker_class`` class, but these are skipped
  if no date and timepicker widgets should be displayed.
  [rnix, 2017-03-06]

- Change default ``datetime.delimiter`` to ``.``.
  [rnix, 2017-03-06]

- Change default ``datetime.format`` to ``%Y.%m.%d %H:%M``.
  [rnix, 2017-03-06]


1.8 (2017-03-01)
----------------

- Add dedicated CSS for ``plone5`` theme provided by ``yafowil.plone``.
  [rnix, 2016-06-28]

- Use ``yafowil.utils.entry_point`` decorator.
  [rnix, 2016-06-28]


1.7.1 (2015-06-25)
------------------

- Resolve JSHint errors and warnings.
  [thet]


1.7 (2015-01-23)
----------------

- Remove calendar icon.
  [rnix, 2014-07-29]

- Update jquery UI datepicker to 1.10.3 and use latest jquery ui boostrap
  styles.
  [rnix, 2014-07-05]


1.6 (2014-06-03)
----------------

- Add translations, package depends now ``yafowil`` >= 2.1
  [rnix, 2014-04-30]


1.5.2
-----

- Restrict timepicker binding to context
  [rnix, 2014-03-19]

1.5.1
-----

- Time blueprint example.
  [rnix, 2012-11-03]

1.5
---

- use ``yafowil.utils.attr_value`` wherever possible.
  [rnix, 2012-10-25]

- Add ``time`` blueprint.
  [rnix, 2012-10-23]

1.4
---

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
