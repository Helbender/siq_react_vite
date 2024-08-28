from flask import Blueprint
from routes.flight_blueprint import flights

# Main Blueprint ro register with application
api = Blueprint("api", __name__)

# register user with api blueprint
# api.register_blueprint(users, url_prefix="/users")

# register flight blueprints with api blueprint
api.register_blueprint(flights, url_prefix="/flights")
