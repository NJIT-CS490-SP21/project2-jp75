import logo from './logo.svg';
import './App.css';
import { Tboard } from './board.js';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

function App() {
    var player1moves = new Array;
    var player2moves = new Array;
    var loggedin = false;
    const [board, setBoard] = useState(Array(9).fill(null));
    const [counter, setCount] = useState(0);
    const [connected, setConnect] = useState([]);
    const [shown, setShown] = useState(false);
    const [showButton, setButton] = useState(false);
    const [Player1, setArray1] = useState([]);
    const [Player2, setArray2] = useState([]);
    const [hideSpec, setSpectator] = useState(true);
    const inputRef = useRef(null);


    function onClickButton(player,index, itmNum) {
        console.log("Players turn");
        console.log("Player 1",player1,"Player2", player2);
        console.log(player);
        console.log(spectators);

        setCount((prevCount) => prevCount + itmNum);
        var letter = "";
        

        if(counter % 2 == 0) {
            letter = "X";
            board[index] = letter;
            setArray1((prevArray) => [...prevArray, index]);
            console.log(Player1);
            //player1moves.push(index);
        }
        else{
            letter = "O";
            board[index] = letter;
            setArray2((prevArray1) => [...prevArray1, index]);
            //calculateWinner(Player2);
            console.log(Player2);
            //player2moves.push(index)
            }
        console.log(counter);
        //setBoard(board => [...board]);
        setBoard(prevBoard => {
            const newBoard = [...prevBoard];
            newBoard[index] = letter;
            return newBoard;
        });
        //console.log(board[item]);
        console.log(index);
        socket.emit('Play', { index: index, letter: board, count: counter, num: itmNum, player1: Player1, player2: Player2 });
    }
    
    function turn(player1,player2){
        if(counter % 2 == 0){
            return player1;
        }
        else{
            return player2;
        }
        
    }
    
    function spectators(connected){
        var i;
        var spectators = []
        for(i=2; i < connected.length;i++){
            spectators.push(connected[spectators]);
        }
        
        for(i=0; i < spectators.length; i++){
        setSpectator(prevSpec => spectators[i]);
        isSpectator(hideSpec);
        
        return spectators;
        }
    }

    function loginButton() {
        const username = inputRef.current.value;
        if (username != "") {
            loggedin = true;
            setConnect(prevConn => [...prevConn,username]);
            socket.emit('Logins', { joined: username });
            showBoard(); // shows the board if you click on login
            console.log(username);

        }
        else {
            loggedin = false;
            console.log("We got a false result");
        }
    }

    function showBoard() {
        setShown(true);

    }
    
    function isSpectator(spectator){
        setSpectator(true);
    }
    
    function playerButtons(){
        setButton(true);
    }

    function calculateWinner(player) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (player[a] && player[a] === player[b] && player[a] === player[c]) {
                return player[a];
            }
        }
        
        return null;
    }
    useEffect(() => {
        // Listening for a chat event emitted by the server. If received, we
        // run the code in the function that is passed in as the second arg
        socket.on('Logins', (data) => {
            console.log('Players');
            //console.log(data.connected[0]);
            setConnect(prevConn => 
                [...prevConn,data.joined]);
        });


        socket.on('Play', (data) => {
            console.log('Letter was received!');
            console.log(data);
            // If the server sends a message (on behalf of another client), then we
            // add it to the list of messages to render it on the UI.
            setCount((prevCount) => (data.num + data.count));
            console.log("current count is", data.count);

            board[data.index] = data.letter;
            return setBoard(prevBoard => [...data.letter]);
            //console.log(board);
        });
    }, []);

        const player1 = connected[0]; //player 1 = first name
        const player2 = connected[1];
        

    console.log(player1, player2);
    //console.log(hideSpec);

    return (



        <div>
        {shown === false ? (
    <div class="login">
            <label for="name">Player Name:</label>
                <br/>
            <input ref={inputRef} type="text" placeholder="username" />
            <button type="submit" onClick={loginButton} class="buttn">Login</button>
        </div>
        ) : null}
        {shown === true ? (
        <div>
         <div class="Players">It's {turn(player1,player2)}'s turn</div>
    <div class="board">  
            {
            board.map(
                (itm, idx) => 
                <div class="box">
                    <button onClick={() => onClickButton(turn(player1,player2),idx,1)}> Click </button>
                    <Tboard letter={itm}/>
                </div>
             )
            }
            </div>
       </div>     ) : null}
    </div>
    
    );

}

export default App;
