"""
Importing features to allow usage of OS, Flask,SocketIO,SQLAlchemy,Dotenv files for server.
"""
import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
import models

load_dotenv(find_dotenv())

BUILD_APP = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
BUILD_APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
BUILD_APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

DB = SQLAlchemy(BUILD_APP)
DB.create_all()

CORS = CORS(BUILD_APP, resources={r"/*": {"origins": "*"}})

SOCKETIO = SocketIO(BUILD_APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)

WIN = []
LOSS = []
TIE = []
LOGINS = []
PLAYER1 = ""
PLAYER2 = ""
SPECTATORS = []
PLAYERS = []
USERS = {"PlayerX": "", "PlayerO": "", "Spectators": []}


@BUILD_APP.route('/', defaults={"filename": "index.html"})
@BUILD_APP.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)


# When a client connects from this Socket connection, this function is run
@SOCKETIO.on('connect')
def on_connect():
    print('User connected!')

# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('disconnect')
def on_disconnect():
    print('User disconnected!')


@SOCKETIO.on('Logins')
def on_connection1(data):
    global USERS
    global PLAYERS
    global LOGINS
    global PLAYER1
    global PLAYER2
    print(str(data))
    LOGINS.append(str(data['joined']))
    print(LOGINS)
    db_names = []
    db_scores = []
    new_user = models.Joined(username=data['joined'], score=100)
    print("New user", new_user)
    #we need to see if the user already exists in the database
    exists = bool(
        models.Joined.query.filter_by(username=data['joined']).first())
    #print(exists)
    if exists != True:  #gets if user is already in db
        DB.session.add(new_user)
        DB.session.commit()

    all_people = models.Joined.query.all()
    all_people = models.Joined.query.order_by(models.Joined.score.desc()).all()
    for People in all_people:
        db_names.append(People.username)  #appends username to database
        db_scores.append(People.score)
    SOCKETIO.emit("User_List", {
        'users': db_names,
        'score': db_scores
    })  #this might be a problem everytime

    if PLAYER1 == "":
        PLAYER1 = LOGINS[0]
        PLAYERS.append(PLAYER1)
    elif PLAYER2 == "":
        PLAYER2 = LOGINS[1]
        PLAYERS.append(PLAYER2)

    for i in LOGINS:
        if i not in PLAYERS:
            SPECTATORS.append(i)

    print("Players: ", PLAYERS)
    print("Spectators: ", SPECTATORS)

    if USERS["PlayerX"] == "":
        USERS["PlayerX"] = PLAYERS[0]
    elif USERS["PlayerO"] == "":
        USERS["PlayerO"] = PLAYERS[1]
    else:
        USERS["Spectators"] = SPECTATORS
    print(USERS)

    SOCKETIO.emit("Logins", data, broadcast=True, include_self=True)

    print(PLAYER1, "is X")
    print(PLAYER2, "is O")
    print(SPECTATORS, " are spectating the game")


@SOCKETIO.on('Reset')
def reset(data):
    print(str(data))
    SOCKETIO.emit('Reset', data, broadcast=True, include_self=True)


@SOCKETIO.on('Winner')
def winner(data):
    global WIN
    global LOSS
    print(str(data))
    users = []
    scores = []

    #winner = models.Joined.query.filter_by(username=data['winner']).first()
    #loser = models.Joined.query.filter_by(username=data['loser']).first()

    winner = DB.session.query(
        models.Joined).filter_by(username=data['winner']).first()
    loser = DB.session.query(
        models.Joined).filter_by(username=data['loser']).first()

    print("This is the winner", winner)
    print("This is the loser", loser)

    print("Winner username: ", winner.username, " Score: ", winner.score)
    print("Loser username: ", loser.username, " Score: ", loser.score)

    winner.score += 1
    loser.score -= 1
    DB.session.commit()

    print("New Winner username: ", winner.username, " Score: ", winner.score)
    print("New Loser username: ", loser.username, " Score: ", loser.score)

    all_people = models.Joined.query.all()
    all_people = models.Joined.query.order_by(models.Joined.score.desc()).all()
    for people in all_people:
        users.append(people.username)
        scores.append(people.score)
    SOCKETIO.emit("User_List", {'users': users, 'score': scores})

    print(users)
    print(scores)

    WIN.append(str(data['winner']))
    print(WIN)
    LOSS.append(str(data['loser']))
    print(LOSS)

    SOCKETIO.emit('Winner', data, broadcast=True, include_self=False)


@SOCKETIO.on('Draw')
def draw(data):
    global TIE
    print(str(data))
    TIE.append(str(data['Draw']))
    #print(TIE)
    SOCKETIO.emit('Draw', data, broadcast=True, include_self=False)


# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
@SOCKETIO.on('Play')
def on_click(
        data):  # data is whatever arg you pass in your emit call on client
    print(str(data))

    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    SOCKETIO.emit('Play', data, broadcast=True, include_self=False)


if __name__ == '__main__':
    # Note that we don't call app.run anymore. We call socketio.run with app arg
    SOCKETIO.run(
        BUILD_APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
        debug=True)
