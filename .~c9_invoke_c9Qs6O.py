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
logins = []
Player1 = ""
Player2 = ""
Spectators = []
players = []
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
    
    socketio.emit("Logins", data ,broadcast=True, include_self=False)
    


# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
@socketio.on('Play')
def on_click(players): # data is whatever arg you pass in your emit call on client
    print(str(players))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('Play', players  , broadcast=True, include_self=False)

# Note that we don't call app.run anymore. We call socketio.run with app arg
socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    debug = True
)