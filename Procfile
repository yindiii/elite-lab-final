web: gunicorn lab-app:app
init: FLASK_APP=lab-app.py python3 -m flask db init
migrate: FLASK_APP=lab-app.py python3 -m flask db migrate
upgrade: FLASK_APP=lab-app.py python3 -m flask db upgrade