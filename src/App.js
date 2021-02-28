import logo from './logo.svg';
import './App.css';
import { Tboard, Name } from './board.js';
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
    
    const [name,setUser] = useState([]);
    

    function onClickButton(player, index, countNum) {

        console.log("Passed num", countNum);
        console.log("Player turn: ", player);

      if(player ==  name){              //This seems to work for my names that have a
        
        setCount((prevCount) => (prevCount + 1));
        console.log("counter", counter);
       
        var letter = "";
        
        if (counter % 2 == 0) {
            letter = "X";
            board[index] = letter;
            Player1.push(index);
            //console.log(Player1);

            if(calculateWinner(Player1) == true){
                alert(name," is the Winner!");
            }
            

        }

        else {
            letter = "O";
            board[index] = letter;
            Player2.push(index);
            //console.log(Player2);
            if(calculateWinner(Player2) == true){
                alert(name," is the Winner!");
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
        socket.emit('Play', { index: index, Player: turn, letter: board, count: counter, num: countNum });
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
                return true;
            }
            else{
                return false;
            }
        }

        return null;
    }
    
    useEffect(() => {

        socket.on('Logins', (data) => {
            console.log("New Login");
            console.log(data);
            setConnect(prevConn => [...prevConn,data.joined]);

        });


        socket.on('Play', (data) => {
            console.log('Letter was received!');
            console.log(data);
            // If the server sends a message (on behalf of another client), then we
            // add it to the list of messages to render it on the UI.
            setCount(data.count + data.num);
            console.log("current count is", data.count);

            board[data.index] = data.letter;
            return setBoard(prevBoard => [...data.letter]);
            //console.log(board);
        });
    }, []);

    var getSpecs = spectators(connected);
    
    console.log(getSpecs, " is a spectator");

    
  
   console.log("Current connected users", connected);
   
   console.log("Username: ",name);
 
    var login = name;
   
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
        
         <div class="login" id={login}> username: {login}</div>
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
       
       
       
    </div>

    );

}

export default App;
