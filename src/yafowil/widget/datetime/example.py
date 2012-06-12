from yafowil.base import factory


def get_example():
    part = factory(u'fieldset', name='yafowilwidgetdatetime')
    part['date'] = factory('field:label:error:datetime', props={
        'label': 'Search or enter a datetime',
        'required': True,
        'locale': 'de', # XXX: iso -> deliver language code in dom for JS
        'datepicker': True})
    part['datetime'] = factory('field:label:error:datetime', props={
        'label': 'Search or enter a datetime',
        'required': True,
        'locale': 'de', # XXX: iso -> deliver language code in dom for JS
        'datepicker': True,
        'time': True})
    return {'widget': part, 'routes': {}}