import os
import sys

from config.wsgi import application

# cPanel/Passenger might require this fallback depending on the setup
# but typically importing application from config.wsgi is sufficient.
