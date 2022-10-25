from flask import Flask, render_template
import requests
import urllib.parse
import os
import json
import zulu
import time
import re
import sys

# ------------------------------------------------------------------------------

app = Flask(__name__)

DEBUG = True

CHECKWX_HOST="https://api.checkwx.com/"
CHECKWX_API_KEY = os.environ["CHECKWX_API_KEY"]

METAR_CACHE_DIR = "metar_cache"

SCRIPT_DIR = os.path.dirname(__file__)

# ------------------------------------------------------------------------------

def pathRelativeToScript(path):
    return os.path.join(SCRIPT_DIR, path)

def checkWXGet(endpoint, headers = {}):
    req_headers = {
        "X-API-Key": CHECKWX_API_KEY
    }

    req_headers.update(headers)

    url = urllib.parse.urljoin(CHECKWX_HOST, endpoint)
    response = requests.get(url, headers=req_headers)

    return response

def sanitizeICAO(s):
    return re.sub(r'[^\w]', '', s.lower())[:4]

def getMetarData(icao):
    icao = sanitizeICAO(icao)

    metar_path = pathRelativeToScript("%s/metar_%s.json" % (METAR_CACHE_DIR, icao))

    if os.path.exists(metar_path):
        with open(metar_path, 'r') as f:
            cached_data = json.load(f)

        observed_datetime_string = cached_data["data"]["observed"]
        observed_datetime = zulu.parse(observed_datetime_string)

        timestamp = cached_data["timestamp"]

        # Expire either one hour after cached file created, or if
        # METAR observed date is older than one hour
        if not (time.time() > timestamp + (60 * 60) or zulu.now() > observed_datetime.shift(hours=1)):
            print("Cached METAR data found for ICAO \"%s\"" % (icao), file=sys.stderr)
            # Cached data is still valid, return it
            return cached_data["data"]
        else:
            # Cached data is expired
            print("Cached METAR data found for ICAO \"%s\" but it is expired, retrieving from CheckWX.com" % (icao), file=sys.stderr)
    else:
        print("No cached METAR data found for ICAO \"%s\", retrieving from CheckWX.com" % (icao), file=sys.stderr)

    # No valid cached data found, retrieve it from external API
    response = checkWXGet("/metar/%s/decoded" % (icao))
    metar_json = response.json()
    metar_data = metar_json["data"][0]


    with open(metar_path, 'w') as f:
        cached_data = {
            "timestamp": int(time.time()),
            "data": metar_data,
        }
        json.dump(cached_data, f)

    return metar_data

# ==============================================================================

@app.route("/api/metar/<icao>")
def getMetar(icao):
    metar_data = getMetarData(icao)
    return metar_data

@app.route("/")
def home():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=DEBUG)