from setuptools import find_packages
from setuptools import setup
import os


def read_file(name):
    with open(os.path.join(os.path.dirname(__file__), name)) as f:
        return f.read()


version = '1.13'
shortdesc = 'Datetime Widget for YAFOWIL'
longdesc = '\n\n'.join([read_file(name) for name in [
    'README.rst',
    'CHANGES.rst',
    'LICENSE.rst'
]])
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
    author='Yafowil Contributors',
    author_email='dev@conestack.org',
    url=u'http://github.com/conestack/yafowil.widget.datetime',
    license='Simplified BSD',
    packages=find_packages('src'),
    package_dir={'': 'src'},
    namespace_packages=['yafowil', 'yafowil.widget'],
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'setuptools',
        'yafowil>2.1.99',
        'bda.intellidatetime>1.2.99',
    ],
    tests_require=tests_require,
    extras_require=dict(
        test=tests_require,
    ),
    test_suite="yafowil.widget.datetime.tests",
    entry_points="""
    [yafowil.plugin]
    register = yafowil.widget.datetime:register
    example = yafowil.widget.datetime.example:get_example
    """
)
