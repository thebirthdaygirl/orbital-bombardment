import os
from flask import Flask, send_from_directory, render_template

app = Flask(__name__, static_folder='build')

# Serve static files from the React build directory
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    print(f"Requested path: {path}")
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    # Custom 404 handler: serve index.html for all other routes
    print(f"404 for path: {e}")
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/favicon.ico')
def favicon():
    print("Serving favicon.ico")
    return send_from_directory(app.static_folder, 'favicon.ico')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
