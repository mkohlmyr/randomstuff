import bisect

class Agent(object):

    def __init__(self, id, alias):
        self.id = id
        self.alias = alias
        self.chats = []
        pass

    def insort_chat(self, chat):
        bisect.insort(self.chats, chat)
        pass

    def average_wait(self):
        return sum(map(lambda chat: chat.chat_waittime, self.chats)) / float(len(self.chats))

    def average_duration(self):
        return sum(map(lambda chat: chat.chat_duration, self.chats)) / float(len(self.chats))

    def average_score(self):
        return sum(map(lambda chat: chat.survey_score, self.chats)) / float(len(self.chats))

    def average_k_polarity(self):
        return sum(map(lambda chat: chat.k_polarity, self.chats)) / float(len(self.chats))

    def __eq__(self, other):
        return other and self.id == other.id

    def __ne__(self, other):
        return not self.__eq__(other)