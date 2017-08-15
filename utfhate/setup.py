from setuptools import setup

setup(name='utfhate',
      version='1.0.6',
      author='Mikael Kohlmyr',
      author_email='mikael@kohlmyr.com',
      description=('Doing BAD THINGSTM to UTF-8 '
                   'byte strings and unicode strings'),
      url='https://github.com/kmyr/utfhate',
      license='LICENSE',
      packages=['utfhate'],
      install_requires=['six'])
