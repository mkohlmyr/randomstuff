from flask import Flask, request, render_template, abort

app = Flask(__name__)

"""
Please write a small web application that models an address book.
Your solution should present a simple user-interface and should persist the data,
so that is available after restarting any processes.

 Your address book should list organisations and people.  It should allow the user
 to see the names and contact details of people in organisations, and to manage the
 people who are in an organisation. It should store a name and contact details for
 each organisation.

 Your address book should allow organisations and people to be created, edited and
 deleted.

 The address book is for use by a single person; there is no need to build
 authentication and authorization in your submission.
"""


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/organisations/")
def organisations():
    return render_template("organisations.html")

@app.route("/organisations/<oid>")
def organisation(oid):
    return render_template("organisation.html", oid=oid)

@app.route("/people/")
def people():
    return render_template("people.html")

@app.route("/people/<pid>")
def person(pid):
    return render_template("person.html", pid=pid)

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
