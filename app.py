# Flask entry point
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("login.html")

# @app.route('/register')
# def register():
#     return render_template("register.html")

# Add more routes for dashboard, exam, etc.

if __name__ == '__main__':
    app.run(debug=True)
