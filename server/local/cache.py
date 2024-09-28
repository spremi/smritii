#
# smritii
#
# (c) Copyright 2024. Sanjeev Premi <spremi@ymail.com>
#
# BSD-3-Clause
#

import time

from collections import OrderedDict
from threading import Lock

TTL_MINUTES = 60
"""
Time-to-live in minutes (validity of cache entry).
"""

TTL_SECONDS = TTL_MINUTES * 60
"""
Time-to-live in seconds (calculates from minutes).
"""

DIR_CACHE_SIZE = 20
"""
Maximum keys in directory cache
"""

class Cache:
    """
    Simple LRU cache implementation.
    """
    def __init__(self):
        self.cache = OrderedDict()
        self.lock = Lock()

    def get(self, key):
        """
        Get value corresponding to key, if still valid.
        """
        if key in self.cache:
            value, validity = self.cache[key]

            if int(time.time()) < validity:
                self.cache.move_to_end(key)
                return value

            else:
                del self.cache[key]

        return None

    def set(self, key, value):
        """
        Add key-value pair to the cache.
        """
        global TTL_SECONDS, DIR_CACHE_SIZE

        with self.lock:
            validity = int(time.time()) + TTL_SECONDS

            self.cache[key] = (value, validity)

            if len(self.cache) > DIR_CACHE_SIZE:
                self.cache.popitem(last=False)

    def clear(self, key, value):
        """
        clear entire cache.
        """
        self.cache.clear()
