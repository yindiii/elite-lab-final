from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired

class ChannelForm(FlaskForm):
    channel_name = StringField('Channel Name', validators=[DataRequired()])
    submit = SubmitField('Enter Chanel')