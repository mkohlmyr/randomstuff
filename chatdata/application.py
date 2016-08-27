from flask import Flask, request, render_template, abort
from textblob import TextBlob
from collections import namedtuple
from datetime import datetime

from models.agent import Agent
from models.chat import Chat

import time
import numpy
import json

agents = {}
chats = {}

with open("chatdata.json", "r") as fp:
    for chat in json.load(fp):
        transcript = chat.get("transcript", [])
        url = chat.get("page_url")
        created_at = chat.get("created_at")

        if not len(transcript) or not url:
            continue

        agent = None
        for record in transcript:
            if record.get("id"):
                agent = chat["agent"] = agents.setdefault(record["id"], Agent(record["id"], record.get("alias")))

        if not agent:
            continue

        x, y = [], []
        for index in range(len(transcript)):
            record = transcript[index]
            message = record.get("message")
            if message and not record.get("id"):
                blob = TextBlob(message)
                record["polarity"] = sum(map(lambda sentence: sentence.sentiment.polarity, blob.sentences)) / float(len(blob.sentences))
                x.append(index)
                y.append(record["polarity"])

        # we will treat agent messages as empty data points in the scatter points?
        # so count them as x values in the graph but leave blank in terms of y data.
        # best fit will then show up or down across those messages!

        # NUMPY DOES NOT LIKE SINGLE VALUE [x] and [y] FOR OBVIOUS REASONS
        k, m = 0, y[0]
        if len(x) > 1 and len(y) > 1:
            k, m = numpy.polyfit(x, y, 1) # sometimes comes out as nan
        chat["k_polarity"] = k
        chat["m_polarity"] = m

        chats[chat["id"]] = Chat(chat)
        agent.insort_chat(chats[chat["id"]])

app = Flask(__name__)


@app.template_filter()
def pretty_timestamp(timestamp):
    now = int(time.time())
    if timestamp > (now * 10):
        # the timestamp appear to be in ms not s since epoch,
        # we can safely assume this is the case if significantly larger than current timestamp in s
        timestamp = timestamp / 1000
    dt = datetime.fromtimestamp(timestamp)
    return dt.strftime("%x %X")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/agents/")
def agent_list():
    def map_agent_data(agent_id):
        return agents[agent_id]

    context = sorted(map(lambda agent_id: agents[agent_id], agents.keys()), key=lambda agent: agent.average_k_polarity(), reverse=True)
    return render_template("agents.html", agents=context)

@app.route("/agents/<agent_id>")
def agent_view(agent_id):
    if not agent_id in agents:
        abort(404)
    return render_template("agent.html", agent=agents[agent_id])

@app.route("/chats/")
def chat_list():
    ChatExtract = namedtuple('ChatExtract', ['id', 'created_at', 'requested_by', 'agent', 'k_polarity'])

    def map_chat_data(chat_id):
        return ChatExtract(chat_id, chats[chat_id].created_at, chats[chat_id].requested_by, chats[chat_id].agent, chats[chat_id].k_polarity)

    context = sorted(map(map_chat_data, chats.keys()), key=lambda c: c.created_at, reverse=True)
    return render_template("chats.html", chats=context)

@app.route("/chats/<chat_id>")
def chat_view(chat_id):
    if not chat_id in chats:
        abort(404)
    return render_template("chat.html", chat=chats[chat_id])



if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)