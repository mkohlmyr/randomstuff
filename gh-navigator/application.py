from flask import Flask, request, render_template

import pretty
import datetime
import urllib2
import urllib
import heapq
import json

app = Flask(__name__)

@app.template_filter()
def format_date(str):
    dt = datetime.datetime.strptime(str, "%Y-%m-%dT%H:%M:%SZ")
    return pretty.date(dt)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/search")
def search():
    term = request.args.get("search_term")
    url = "https://api.github.com/search/repositories?"
    url = url + urllib.urlencode({"q": term.encode("utf-8")})
    try:
        req = urllib2.Request(url)
        res = json.loads(urllib2.urlopen(req).read())
        lim = heapq.nlargest(5, res.get("items"), key=lambda r: r.get("created_at"))
        return render_template("results.html", term=term, results=lim)
    except urllib2.HTTPError as e:
        message = json.loads(e.read()).get("message")
        return render_template("dialog.html", code=e.code, reason=e.reason, message=message), e.code
    except ValueError as e:
        return render_template("dialog.html", code=500, reason="Internal Server Error", message="Failed to parse response from GitHub"), 500
    except Exception as e:
        return render_template("dialog.html", code=500, reason="Internal Server Error", message="Unknown error: %s" % e.message)

if __name__ == "__main__":
    app.run(host='0.0.0.0')