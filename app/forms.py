from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired

class ChatroomForm(FlaskForm):
    chatroom_name = StringField('Chatroom Name', validators=[DataRequired()])
    submit = SubmitField('Enter Chanel')