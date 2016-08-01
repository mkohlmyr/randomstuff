class Averager(object):
    def __init__(self):
        self.store = []

    def add_value(self, value):
        self.store.append(value)

    def get_moving_average(self, n):
        return sum(self.store[-n:]) / float(n)

a = Averager()
a.add_value(1)
a.add_value(3)
assert a.get_moving_average(1) == 3
assert a.get_moving_average(2) == 2
a.add_value(2)
assert a.get_moving_average(3) == 2
assert a.get_moving_average(2) == 2.5
print "Success"
