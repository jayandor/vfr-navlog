#!/usr/bin/python3

import logging
import sys

sys.path.insert(0, '/var/www/html/vfr-navlog')

import env

logging.basicConfig(stream=sys.stderr)

from app import app as application

application.secret_key = 'MY_SECRET_KEY'