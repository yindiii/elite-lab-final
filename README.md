# Elite Final Project: Your Own Site

## Intro
This project will be your final product from this course. Feel free to reupload this directory as your own github repo after we are done.

We have provided a starter personal portfolio site for you. It includes:
* A hero section
* A sub banner section
* Text blurb
* Project descriptions
* Interests (with hover flip cards)
* Footer with contact info

These are meant to be starters and examples for your own site. Add in your own content, reorder, restructure. Feel free to customize this as much as you want.

Also, the we have provided the framework for a working chat app. This includes:
* Create Channel Form
* Sign in Form
* Channel Page
* Supporting backend components

As always, feel free to reach out to me if you run into issues, or if there is something you want to implement, but don't know where to get started. (I always recommend looking at other sites for inspiration).

Even after this course is over, feel free to contact me for any help web dev related. I'll always find time to help you guys out. ( kevin.koh.dev@gmail.com )


## Chat App Functional Doc
### Key Definitions
* Channel refers to the frontend chatroom. For ex: `/channel/abc123/` will return the HTML page for the chatroom.
* Chat refers to the collection of messages in the backend. For ex: `/chat/123/` is an API that will return the message data for that chat.

### Model Components
The chat app leverages 3 models for data storage. These are:

#### Message
Storage of individual messages used in the chat app. It has a many-to-one relationship to `Chat` (as in MANY messages belong to ONE chat). This is set with the `chat_id` foreign key.

* `Message`
  * `id <Integer>`: The primary key used to identify indivual messages
  * `chat_id <Integer>`: The foreign key used to identify which chat this message belongs to
  * `timestamp <DateTime>`: The timestamp for when this message was created
  * `username <String>`: Username of person that sent the message
  * `content <String>`: Text content of the message

#### Chat
Storage of chats. Used to identify and name chatrooms, and to organize messages. It has a one-to-many relationship to `Message` (as in ONE chat has MANY messages)

* `Message`
  * `id <Integer>`: The primary key used to identify indivual messages
  * `name <String>`: The name for this specific chat
  * `hash_key <String>`: A randomly generated sequence of characters that can be stored in the link URL and identify the chat.

#### Session
Stores a session, mapping a token to a username. When a user "logs in" they create a new session and are given the token. Whenever the user makes a request with that token, we can associate it back to that user.

Keep in mind: There are some obvious security features that we skip over (for sake of simplicity). For example, anyone can sign in with the same username and assume to be that user. Think about how this could be handled.

* `Session`
  * `id <Integer>`: The primary key used to identify indivual sessions
  * `token <String>`: A randomly generated sequence of characters that can be used to ID a session. We try to be long and random here, so we can't have other users "guess" the token
  * `username <String>`: The username that we call the user in this session

### User Flow
(Remember that we use cookies and tokens to create sessions for a user. A user has a single username for that session, which is used between chatrooms).

We have two typical user flows:

#### User Creates Chatroom
* User goes to the create channel page
* Fills in the channel name and hits submit
* User is directed to the channel page
* IF the user is not currently in a session
  * Redirect them to the session create (login) form
  * User gives a username and submits
  * User is given a token that's stored in cookies
  * User is redirected to the channel page
* User is on the channel page, gets initial messages, and can send messages

#### User Joins Chatroom
* User is given a link to a channel page
* User visits channel page
* IF the user is not currently in a session
  * Redirect them to the session create (login) form
  * User gives a username and submits
  * User is given a token that's stored in cookies
  * User is redirected to the channel page
* User is on the channel page, gets initial messages, and can send messages


## Objective
### Task
There are two goals:

* Your goal is to create the Chat model and perform the migration
* Your goal is to create the APIs and JS that the web page can use to create session tokens (this is the same as last week's lab and you can copy the answers)

Lab is complete when you are able to succesfully:
* Create a chatroom
* Create a session with a username
* Send, receive, and share that chatroom

You will be editing these files:
* `app/static/js/session.js`
* `app/controllers.py`
* `app/models.py`

### Context
If you have finished Lab 6, you can copy that solution for the first goal.

The second goal will require you to write the model class. Please use the other model classes as a reference (it will show you how to define your fields).

We have also provided `scripts/util.py` that you can run in the command line. This script can help insert test messages into your database and also delete all messages (so you can start fresh if need be). This is to help you out, but not needed for completion.


## Set Up
* Fork and clone the repository to your local dev environment

* Activate your virtual environment
```
python3 -m venv venv
source venv/bin/activate
```

* Install the dependencies to your virtual environment
```
pip3 install -r requirements.txt
```

* Start up your SQLite database with:
```
FLASK_APP=lab-app.py python3 -m flask db init
FLASK_APP=lab-app.py python3 -m flask db migrate -m "my first migration"
FLASK_APP=lab-app.py python3 -m flask db upgrade
```

* Spin up the local web server with:
```
FLASK_APP=lab-app.py FLASK_ENV=development python3 -m flask run
```

HEADS UP: Depending on your dev environment, you may want to just use `flask` directly.
For example, instead of:
`FLASK_APP=lab-app.py python3 -m flask db init`

You would want to use:
`FLASK_APP=lab-app.py flask db init`


## Lab Steps
Goal 1:
* Look at the docs above to see what fields you need to define in the Chat model

* Put these definitions into code in `app/models.py`

* Now that you've changed the model, you need to perform a migration

* Prepare the migration with this command: `FLASK_APP=lab-app.py python3 -m flask db migrate -m "<Insert name of migration>"`

* Run the migration with: `FLASK_APP=lab-app.py python3 -m flask db upgrade`

* Confirm the migration worked by running the app and checking the site

Goal 2:
* Look through the `app/static/js/session.js` file and read the comments to learn about what it does.

* Look at the Ajax request in this file and notice what it expects in the response.

* Look through `app/models.py` file and notice the manager function `SessionManager.create_session`. Notice what it takes in as an argument and what it returns.

* (Optional) Run the `scripts/util.py` script to seed your database with test messages

* Name your API and implement its handler function

* Complete the javascript code to call that API correctly

* Enter the chatroom and validate that you can start a session

* Send some messages as yourself in this session

* Open the same webpage in a different browser and check if you are still logged in as the same person

Once you're finished, customize the rest of your site.
* Make the chat text looks nicer
* Add some background to the chatrooms
* Add some content to the main page


## Lab Advice
* If your database goes out of sync with your schema, you can run these commands:
```
FLASK_APP=lab-app.py python3 -m flask db stamp head
FLASK_APP=lab-app.py python3 -m flask db migrate
FLASK_APP=lab-app.py python3 -m flask db upgrade
```
