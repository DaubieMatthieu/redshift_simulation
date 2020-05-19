from flask import Flask, request, render_template, jsonify
import json
from script.redshift import *

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/_get_data/', methods=['GET'])
def _get_data():
    try:
        data = json.loads(request.args.get("data"))
        redshift = getRedshift(data)
        if (isinstance(redshift,complex)):
            response="complex value"
        else:
            response=redshift
        return jsonify(json.dumps(response))
    except Exception as e:
        return jsonify(str(e))


if __name__ == "__main__":
    app.run(debug=True)
