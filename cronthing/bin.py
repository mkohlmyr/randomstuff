#!/usr/bin/env python
"""
To execute the python code, either:
 1. Make bin.py executable with chmod and run ./bin.py 16:10
 2. Run python bin.py 16:10

Approach:
If we can fix the the wildcard hours and minutes then we can
simply do a time comparison to determine if the command should
execute today or tomorrow.
"""

import sys

from collections import namedtuple
from datetime import time, timedelta

Entry = namedtuple("Entry", ["mm", "hh", "cmd"])

def wildcard_hour(entry, now):
    increment = 1 if entry.mm.isdigit() and int(entry.mm) < now.minute else 0
    return (now.hour + increment) % 24

def wildcard_minute(entry, now):
    return 0 if entry.hh.isdigit() and int(entry.hh) != now.hour else now.minute

def calculate_runtime(entry, now):
    return time(int(entry.hh) if entry.hh.isdigit() else wildcard_hour(entry, now),
                int(entry.mm) if entry.mm.isdigit() else wildcard_minute(entry, now))

def tomorrow(runtime, now):
    return timedelta(hours=now.hour, minutes=now.minute) > timedelta(hours=runtime.hour, minutes=runtime.minute)

def timefmt(time):
    strtime = time.strftime("%H:%M")
    if strtime.startswith("0"):
        strtime = strtime[1:]
    return strtime

if __name__ == "__main__":
    hh, mm = sys.argv[1].split(":")
    now = time(int(hh), int(mm))
    with open("config") as config:
        for line in config:
            entry = Entry(*line.split())
            runtime = calculate_runtime(entry, now)
            print "%s %s - %s" % (timefmt(runtime), "tomorrow" if tomorrow(runtime, now) else "today", entry.cmd)
