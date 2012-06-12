from yafowil.base import factory

def get_example():
    part1 = factory(u'fieldset', name='yafowilwidgetdatetime.1')
    part1['date'] = factory('field:label:error:datetime', props={
         'label': 'Search or enter a datetime',
         'required': True,
         'locale': 'de', # XXX: iso -> deliver language code in dom for JS
         'datepicker': True})
    part2 = factory(u'fieldset', name='yafowilwidgetdatetime.2')
    part2['datetime'] = factory('field:label:error:datetime', props={
         'label': 'Search or enter a datetime',
         'required': True,
         'locale': 'de', # XXX: iso -> deliver language code in dom for JS
         'datepicker': True,
         'time': True})
    return [{'widget': part1, 'doc': 'TODO 1'},
            {'widget': part2, 'doc': 'TODO 2'}]
