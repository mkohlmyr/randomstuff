import ConfigParser
import os
import re

integer_regex = re.compile('^(0|[1-9]{1}[0-9]*)$')
boolean_regex = re.compile('^(yes|no)$')

class SettingsError(Exception):
    pass

class Namespace(object):
    pass

class Settings(object):
    def __init__(self):
        self.cwd = os.getcwd()
        self.dir = os.path.join(os.getcwd(), 'settings')
        self.files = map(lambda x: os.path.join(self.dir, x), os.listdir(self.dir))
        
        self._load()

    def _section(self, section):
        if not hasattr(self, section):
            setattr(self, section, Namespace())
        elif not isinstance(getattr(self, section), Namespace):
            raise SettingsError('Not a valid section name "%s"' % section)

    def _parse(self, section, option):
        value = self.config.get(section, option)
        if integer_regex.search(value):
            return self.config.getint(section, option)
        if boolean_regex.search(value):
            return self.config.getboolean(section, option)
        return value

    def _load(self):
        self.config = ConfigParser.RawConfigParser()
        self.config.read(self.files)
        for section in config.sections():
            self._section(section)
            for option in config.options(section):
                setattr(_section, option, self._parse(section, option))

settings = Settings()
