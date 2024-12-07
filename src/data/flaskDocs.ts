export const FLASK_DOCUMENTATION = `Flask Documentation

Basic Application Structure:
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run()

Key Concepts:
1. Routes and Views
- Use @app.route() decorator to bind functions to URLs
- Support for variable rules in URLs using <variable_name>
- HTTP methods specified via methods=['GET', 'POST']

2. Templates
- Uses Jinja2 templating engine
- Render templates with render_template()
- Template inheritance supported
- Access variables using {{ variable }}

3. Request Handling
- Access form data via request.form
- Get URL parameters with request.args
- Handle file uploads with request.files
- Access JSON data through request.json

4. Response Objects
- Return strings, dictionaries, or Response objects
- Set status codes and headers
- Support for jsonify() for API responses

5. Database Integration
- No built-in database support
- Easily integrates with SQLAlchemy
- Support for most SQL and NoSQL databases

6. Configuration
- Config from files or objects
- Environment variables
- Instance folders

7. Error Handling
- Custom error pages with @app.errorhandler()
- Built-in debugging mode
- Logging support

8. Extensions
- Large ecosystem of extensions
- Flask-SQLAlchemy for databases
- Flask-Login for user sessions
- Flask-WTF for forms

Best Practices:
- Use application factories
- Organize code into blueprints
- Keep configuration separate
- Handle errors gracefully
- Use virtual environments
- Follow RESTful principles
- Implement proper security measures

Common Patterns:
1. Application Factory:
def create_app():
    app = Flask(__name__)
    # configuration and extensions
    return app

2. Blueprints:
from flask import Blueprint
bp = Blueprint('auth', __name__)

3. Database Models:
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)

4. Form Handling:
from flask_wtf import FlaskForm
class LoginForm(FlaskForm):
    username = StringField('Username')

5. User Authentication:
from flask_login import LoginManager
login_manager = LoginManager()

Development Server:
- Debug mode: app.run(debug=True)
- Host configuration: app.run(host='0.0.0.0')
- Port selection: app.run(port=5000)

Deployment:
- Use production WSGI server (Gunicorn, uWSGI)
- Set up reverse proxy (Nginx, Apache)
- Configure environment variables
- Handle static files efficiently
- Implement proper logging
- Use HTTPS in production`;
