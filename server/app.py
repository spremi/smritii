#
# smritii
#
# (c) Copyright 2024. Sanjeev Premi <spremi@ymail.com>
#
# BSD-3-Clause
#

from flask import Flask, abort, jsonify, render_template, request, send_file


def create_app(config=None):
    """
    Factory method used by 'flask run'.
    """
    app = Flask(__name__)

    @app.route('/')
    def index():
        return render_template('index.html')

    #
    # Return application object.
    #
    return app


#
# Entry point for 'regular' python application.
#
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
