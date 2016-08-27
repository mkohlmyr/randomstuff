

class Chat(object):

    def __init__(self, data):
        self.data = data
        pass

    def __getattr__(self, prop):
        return self.data[prop]

    def __gt__(self, other):
        return self.created_at > other.created_at

    def __lt__(self, other):
        return self.created_at < other.created_at

    def __eq__(self, other):
        return self.id == other.id

    def __ne__(self, other):
        return not self.__eq__(other)