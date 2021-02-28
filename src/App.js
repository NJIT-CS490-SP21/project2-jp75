import logo from './logo.svg';
import './App.css';
import { Tboard, Name } from './board.js';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

function App() {

    var [board, setBoard] = useState(Array(9).fill(null));
    const [counter, setCount] = useState(0);
    const [connected, setConnect] = useState([]);
    const [shown, setShown] = useState(false);
    const [Player1, setArray1] = useState([]);
    const [Player2, setArray2] = useState([]);
    const [gameEnd, setGameEnd] = useState(false);
    //const [hideSpec, setSpectator] = useState(false);
    const winner = calculateWinner(board);
    const [moves, setMoves] = useState([]);
    const inputRef = useRef(null);


    // const reset = useCallback(() => {
    //     setBoard(Array(9).fill(null))        // Trying to set a reset button
    // }, Array(9).fill(null));


    const [name, setUser] = useState([]);


    function onClickButton(player, index, countNum) {

        
        //console.log("Passed num", countNum);
        console.log("Player turn: ", player);

        if (player == name) { //This seems to work for my names that have a
        
        
            setMoves((prevMove) => [player]);
            
            setCount((prevCount) => (prevCount + 1));
            console.log("counter", counter);

            var letter = "";

            if (counter % 2 == 0) {
                letter = "X";
                board[index] = letter;
                Player1.push(index);
                //console.log(Player1);
                calculateWinner(Player1, player);
                console.log("Winner Player1: ", calculateWinner(Player1), winner);
                //console.log("Winner Player2: ", calculateWinner(Player2));
                if (winner == "winner") {
                    console.log(player, " is the Winner!");
                    socket.emit("Winner", { Winner: player });
                }
                else if (winner == "draw") {
                    console.log("It's a draw...");
                }


            }

            else {
                letter = "O";
                board[index] = letter;
                Player2.push(index);
                //console.log(Player2);
                if (winner == "winner") {
                    console.log(player, " is the Winner!");
                    socket.emit("Winner", { Winner: player });
                }
                else if (winner == "draw") {
                    console.log("Its a draw...");
                }
            }

            //setBoard(board => [...board]);
            setBoard(prevBoard => {
                const newBoard = [...prevBoard];
                newBoard[index] = letter;
                return newBoard;
            });

            //console.log(board[item]);
            console.log(index);
            socket.emit('Play', { index: index, Player: turn, letter: board, count: counter, num: countNum , Move: player });
        }
    }

    function turn(player1, player2) {
        console.log("Counter for turn", counter);
        if (counter % 2 == 0) {
            return player1;
        }
        else {
            return player2;
        }

    }

    function spectators(connected) {
        var i;
        var spectators = []
        for (i = 2; i < connected.length; i++) {
            spectators.push(connected[i]);
        }

        return spectators;
    }


    function loginButton() {
        var username = inputRef.current.value;

        if (username != "") {

            console.log("Current logins:", connected);
            console.log("Length", connected.length);

            socket.emit('Logins', { joined: username });
            showBoard(); // shows the board if you click on login
            setUser(username);
        }
        else {

            console.log("We got a false result");
        }

    }


    function showBoard() {
        setShown(true);

    }

    function resetButton() {
        setBoard(Array(9).fill(null));
        socket.emit("Reset", { Reset: board });
    }


    function finishGame() {
        setGameEnd(true);
    }


    function calculateWinner(player, name) {
        const possible = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < possible.length; i++) {
            const [a, b, c] = possible[i];
            if (player[a] && player[a] === player[b] && player[a] === player[c]) {
                console.log(<board User name={turn}/>, name, " won the game!");
                socket.emit("Winner", { Name: name });
                return "winner";
            }
            else if (!player.includes(null)) {
                return "draw";
            }
        }
        return null;
    }


    useEffect(() => {

        socket.on('Logins', (data) => {
            console.log("New Login");
            console.log(data);
            setConnect(prevConn => [...prevConn, data.joined]);

        });


        socket.on('Play', (data) => {
            console.log('Letter was received!');
            console.log(data);
            // If the server sends a message (on behalf of another client), then we
            // add it to the list of messages to render it on the UI.
            setMoves(prevMove => [...prevMove, data.Move]);
            setCount(data.count + data.num);
            console.log("current count is", data.count);

            board[data.index] = data.letter;
            return setBoard(prevBoard => [...data.letter]);
            //console.log(board);
        });




        socket.on('Reset', (data) => {
            console.log('Reseting game');
            console.log(data);
            // If the server sends a message (on behalf of another client), then we
            // add it to the list of messages to render it on the UI.
            setCount(0);
            console.log("current count is", counter);

            return setBoard(Array(9).fill(null));
            //console.log(board);
        });


    }, []);

    var getSpecs = spectators(connected);

    console.log(getSpecs, " is a spectator");



    console.log("Current connected users", connected);

    console.log("Username: ", name);

    var login = name;
    
    console.log(<board User name={moves[moves.length-2]}/>['props']['name']);

    return (



        <div class="center">
        
        
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
        
         <div class="login" id={login}> username: {login}</div>
         
         <div class="user"> Player1: {connected[0]} = "X" </div>
         <div class="user"> Player2: {connected[1]} = "O" </div>
            
         <div class="Players">It's {turn(connected[0],connected[1])}'s turn</div>
    <div class="board">  
            {
            board.map(
                (itm, idx) => 
                <div class="box">
    
                    <button class="box" onClick={() => onClickButton(turn(connected[0],connected[1]),idx,1)}>click</button>
                    
                    
              
                    <Tboard letter={itm}/>
                    
                    </div>
             )
            }
            </div>
       </div>     ) : null}
       
      
         { winner == "winner"
       ? <div class="winner"> {<board User name={moves[moves.length-1]}/>['props']['name']} is the Winner! </div>
       : null }


        <div class="reset">
        { winner == "winner" 
       ? <button type="submit" onClick={resetButton} class="reset">Restart game?</button> 
       : null }
       
       </div>
       
     


       
    </div>

    );

}

export default App;
