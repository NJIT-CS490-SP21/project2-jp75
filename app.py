import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS

app = Flask(__name__, static_folder='./build/static')

cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)
win = []
loss = []
tie = []


logins = []
Player1 = ""
Player2 = ""
Spectators = []
players = []
users = {"PlayerX":"","PlayerO":"","Spectators":[]}
@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    print('User connected!')

# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')
    
@socketio.on('Logins')
def on_Connection1(data):
    global users
    global players
    global logins
    global Player1
    global Player2
    print(str(data))
    logins.append(str(data['joined']))
    print(logins);
    
    if(Player1 == ""):
        Player1 = logins[0]
        players.append(Player1)
    elif(Player2 == ""):
        Player2 = logins[1]
        players.append(Player2)
        
    for i in logins:
        if i not in players:
            Spectators.append(i)

    print("Players: ", players)
    print("Spectators: ", Spectators)
    
    if(users["PlayerX"] == ""):
        users["PlayerX"] = players[0]
    elif(users["PlayerO"] == ""):
        users["PlayerO"] = players[1]
        
    else:
        users["Spectators"] = Spectators


    print(users)
    
    
    socketio.emit("Logins", data, broadcast=True, include_self=True)
    
    
    print(Player1,"is X")
    print(Player2, "is O")
    print(Spectators, " are spectating the game")


@socketio.on('Reset')
def reset(data):
    print(str(data))
   
    socketio.emit('Reset', data , broadcast=True, include_self=True) 
    
    
@socketio.on('Winner')
def winner(data):
    global win
    global loss
    print(str(data))
    win.append(str(data['winner']))
    print(win)
    loss.append(str(data['loser']))
    print(loss)
    
    socketio.emit('Winner', data, broadcast=True, include_self=False)
    
    
@socketio.on('Draw')
def draw(data):
    global tie
    print(str(data))
    tie.append(str(data['Draw']))
    
    print(tie)
    
    socketio.emit('Draw', data, broadcast=True, include_self=False)
# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
@socketio.on('Play')
def on_click(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    
    
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('Play', data , broadcast=True, include_self=False)

# Note that we don't call app.run anymore. We call socketio.run with app arg
socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    debug = True
)
