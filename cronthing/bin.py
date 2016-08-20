#!/usr/bin/env python

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
    while True:
        line = line = sys.stdin.readline().rstrip("\r\n")
        if not len(line):
            break
        entry = Entry(*line.split())
        runtime = calculate_runtime(entry, now)
        print "%s %s - %s" % (timefmt(runtime), "tomorrow" if tomorrow(runtime, now) else "today", entry.cmd)
