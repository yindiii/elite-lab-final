from datetime import datetime
from app import db

from .utils import get_token


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    username = db.Column(db.String(64), index=True)
    content = db.Column(db.String(256))

    # Foreign Key
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id'), nullable=False, index=True)

    def __repr__(self):
        return '<Message {} from {}'.format(self.id, self.chat_id)

    def to_dict(self):
        return {
            "id": self.id,
            "chat_id": self.chat_id,
            "timestamp": str(self.timestamp),
            "username": self.username,
            "content": self.content
        }


class MessageManager:

    @staticmethod
    def get_all_messages():
        return Message.query.all()

    @staticmethod
    def get_message_by_id(message_id):
        return Message.query.get(message_id)

    @staticmethod
    def create_message(message_dict):
        message_username = message_dict.get('username', "")
        message_content = message_dict.get('content', "")
        message_chat_id = message_dict.get('chat_id', "")
        message = Message(
            username=message_username,
            content=message_content,
            chat_id=message_chat_id
        )
        db.session.add(message)
        db.session.commit()
        return message

    @staticmethod
    def delete_message(message_id):
        message = Message.query.get(message_id)
        if message:
            db.session.delete(message)
            db.session.commit()
        else:
            raise ValueError(
                "Could not find Message with ID: " + str(message_id)
            )
        return True


class Session(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(16), index=True, unique=True)
    username = db.Column(db.String(64), index=True)

    def __repr__(self):
        return '<Session {} for: {}'.format(self.token, self.username)


class SessionManager:

    @staticmethod
    def create_session(username):
        token = get_token(24)
        session = Session(
            token=token,
            username=username
        )
        db.session.add(session)
        db.session.commit()
        return token

    @staticmethod
    def get_username(token):
        session = Session.query.filter(Session.token == token).first()
        return session.username


class Chat(db.Model):

    # DEFINE YOUR FIELDS HERE

    # This represents the other side of the many-to-one relationship
    # This is not defined in the database, so don't worry about this
    messages = db.relationship('Message', backref='message', lazy='dynamic')


class ChatManager:

    @staticmethod
    def create_chat(name):
        hash_key = get_token(6)
        chat = Chat(
            hash_key=hash_key,
            name=name
        )
        db.session.add(chat)
        db.session.commit()
        return chat

    @staticmethod
    def get_chat_from_hash(hash_key):
        chat = Chat.query.filter(Chat.hash_key == hash_key).first()
        return chat

    @staticmethod
    def get_all_chat_messages(chat_id):
        chat = Chat.query.get(chat_id)
        return chat.messages

    @staticmethod
    def get_chat_messages(chat_id, num_messages=100):
        chat = Chat.query.get(chat_id)
        # chat.messages refers to all messages that belong to this chat
        # we slice the last amount of messages
        messages = chat.messages[:num_messages]
        return messages

    @staticmethod
    def get_chat_updates(chat_id, last_id):
        """
        Get the messages in a chat that have occurred since the 
        message with last_id was created
        """
        chat = Chat.query.get(chat_id)
        messages = chat.messages.filter(Message.id > last_id).order_by(Message.timestamp.asc())
        return messages
