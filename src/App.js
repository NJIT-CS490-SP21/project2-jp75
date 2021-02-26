import logo from './logo.svg';
import './App.css';
import { Tboard } from './board.js';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

function App() {


    const [board, setBoard] = useState(Array(9).fill(null));
    const [counter, setCount] = useState(0);
    const [connected, setConnect] = useState([]);
    const [shown, setShown] = useState(false);
    const [Player1, setArray1] = useState([]);
    const [Player2, setArray2] = useState([]);
    //const [hideSpec, setSpectator] = useState(false);
    const winner = calculateWinner(board);
    const inputRef = useRef(null);
    const [logCount, setLogCount] = useState(0);
    
    

    function onClickButton(player, index, countNum , Spectators) {
        console.log("Player turn: ", player);
        //console.log(player);
        //console.log(spectators);
        console.log("Spectators",Spectators);
        
        console.log("Watch: ",isSpectator(player));
      
      if(player == ['b']){              //This seems to work for my names that have a
          
       
        setCount((prevCount) => prevCount + countNum);
        var letter = "";
        
        console.log(isSpectator(player));
       if(isSpectator(player) == false){
            
        if (counter % 2 == 0) {
            letter = "X";
            board[index] = letter;
            Player1.push(index);
            //console.log(Player1);
            calculateWinner(Player1);
            //player1moves.push(index);
        }

        else {
            letter = "O";
            board[index] = letter;
            Player2.push(index);
            //console.log(Player2);
            calculateWinner(Player2);
            //player2moves.push(index)
        }
        
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
        socket.emit('Play', { index: index, letter: board, count: counter, player1: Player1, player2: Player2 });
      }
    }

    

    function turn(player1, player2) {
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
        
            setConnect(prevConn => [...prevConn, username]);
            setLogCount((prevLog) => prevLog + 1 );
            console.log(connected);
            console.log("Length", connected.length);
            //watch = ;
            socket.emit('Logins', { joined: username, index: logCount });
            showBoard(); // shows the board if you click on login
 



        }
        else {

            console.log("We got a false result");
        }
    }

    function showBoard() {
        setShown(true);

    }

    function isSpectator(username) {
        var i;
        var specs = spectators(connected);
        
        for(i = 0; i < specs.length; i++){
            console.log("Connected Array:", specs);
            console.log("Array name:",specs[i]);
            console.log("User Name:",username);
            if(specs[i] == username){
            return true;
            }
        
            return false;
        }
    }
    


    function calculateWinner(player) {
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
                console.log("You are a winner");
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
            setConnect(prevConn => [...prevConn, data.joined]);
            setLogCount((prevLog) => (data.index + 1));

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
    

    var getSpecs = spectators(connected);
    console.log(getSpecs, " is a spectator");

    console.log(player1, player2);
    
    //console.log(hideSpec);
   // const username = inputRef.current.value;
   //console.log("current username",username);

    return (



        <div>
        {shown === false ? (
    <div class="login">
            <label for="name">Player Name:</label>
                <br/>
            <input ref={inputRef} type="text" placeholder="username" />
            <button type="submit" onClick={ () => loginButton(0)} class="buttn">Login</button>
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
                    <button onClick={() => onClickButton(turn(player1,player2),idx,1, getSpecs)}> Click </button>
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
