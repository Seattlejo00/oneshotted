from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/editor")
def editor():
    return render_template("index.html", start_in_editor=True)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
