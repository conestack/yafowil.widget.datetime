from setuptools import find_packages
from setuptools import setup
import os


version = '1.10'
shortdesc = 'Datetime Widget for YAFOWIL'
longdesc = open(os.path.join(os.path.dirname(__file__), 'README.rst')).read()
longdesc += open(os.path.join(os.path.dirname(__file__), 'CHANGES.rst')).read()
longdesc += open(os.path.join(os.path.dirname(__file__), 'LICENSE.rst')).read()
tests_require = ['yafowil[test]']


setup(
    name='yafowil.widget.datetime',
    version=version,
    description=shortdesc,
    long_description=longdesc,
    classifiers=[
        'License :: OSI Approved :: BSD License',
        'Environment :: Web Environment',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
    ],
    keywords='',
    author='BlueDynamics Alliance',
    author_email='dev@bluedynamics.com',
    url=u'http://pypi.python.org/pypi/yafowil.widget.datetime',
    license='Simplified BSD',
    packages=find_packages('src'),
    package_dir = {'': 'src'},
    namespace_packages=['yafowil', 'yafowil.widget'],
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'setuptools',
        'yafowil>2.1.99',
        'bda.intellidatetime>1.2.99',
    ],
    tests_require=tests_require,
    extras_require = dict(
        test=tests_require,
    ),
    test_suite="yafowil.widget.datetime.tests",
    entry_points="""
    [yafowil.plugin]
    register = yafowil.widget.datetime:register
    example = yafowil.widget.datetime.example:get_example
    """)
