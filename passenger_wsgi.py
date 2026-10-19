import sys
import os

# Add application directory to python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Import Flask app and expose as 'application' for LiteSpeed / Phusion Passenger WSGI
from app import app as application

if __name__ == "__main__":
    application.run()
