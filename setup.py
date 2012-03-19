from setuptools import setup, find_packages
import sys, os

version = '1.2'
shortdesc = 'Datetime Widget for YAFOWIL'
longdesc = open(os.path.join(os.path.dirname(__file__), 'README.rst')).read()
longdesc += open(os.path.join(os.path.dirname(__file__), 'HISTORY.rst')).read()
longdesc += open(os.path.join(os.path.dirname(__file__), 'LICENSE.rst')).read()
tests_require = ['interlude', 'lxml']

setup(name='yafowil.widget.datetime',
      version=version,
      description=shortdesc,
      long_description=longdesc,
      classifiers=[
            'License :: OSI Approved :: BSD License',
            'Environment :: Web Environment',
            'Operating System :: OS Independent',
            'Programming Language :: Python', 
            'Topic :: Internet :: WWW/HTTP :: Dynamic Content',        
      ],
      keywords='',
      author='BlueDynamics Alliance',
      author_email='dev@bluedynamics.com',
      url=u'https://github.com/bluedynamics/yafowil.widget.datetime',
      license='Simplified BSD',
      packages=find_packages('src'),
      package_dir = {'': 'src'},
      namespace_packages=['yafowil', 'yafowil.widget'],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'setuptools',
          'yafowil',
          'bda.intellidatetime',
      ],
      tests_require=tests_require,
      extras_require = dict(
          test=tests_require,
      ),
      test_suite="yafowil.widget.datetime.tests.test_suite",
      entry_points="""
      [yafowil.plugin]
      register = yafowil.widget.datetime:register
      resourcedir = yafowil.widget.datetime:get_resource_dir
      javascripts = yafowil.widget.datetime:get_js
      stylesheets = yafowil.widget.datetime:get_css
      """,
      )
