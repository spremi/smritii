#
# smritii
#
# (c) Copyright 2024. Sanjeev Premi <spremi@ymail.com>
#
# BSD-3-Clause
#

from flask import Flask, abort, jsonify, render_template, request, send_file

import os


BASE_ALBUM = ''
"""
Base directory of album
"""


def create_app(config=None):
    """
    Factory method used by 'flask run'.
    """
    global BASE_ALBUM

    app = Flask(__name__)

    BASE_ALBUM = os.environ.get('BASE_ALBUM')

    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/image/<path:location>', methods=['GET'])
    def get_photo(location):
        """
        Returns image at specified location, if it exists.
        Else, return static error image.

        Ensures that final path is located under BASE_ALBUM.
        """
        global BASE_ALBUM

        full_path = os.path.abspath(os.path.join(BASE_ALBUM, location))

        if full_path.startswith(BASE_ALBUM) and os.path.isfile(full_path):
            return send_file(full_path)
        else:
            return send_file('static/images/404.png')

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
