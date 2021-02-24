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
    const [counter,setCount] = useState(0);
    const [connected, setConnect] = useState([]);
    const [Player1, setArray1] = useState([]);
    const [Player2, setArray2] = useState([]);
    const inputRef = useRef(null);


    function onClickButton(index,itmNum) {
        setCount((prevCount) => prevCount + itmNum);
        var letter = "";
        
        if(counter % 2 == 0){
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
            console.log(Player2);
            //player2moves.push(index);
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
        socket.emit('Play', { index: index, letter: board, count : counter, num : itmNum, player1: Player1, player2: Player2});
    }
    
        function loginButton(){
        const username = inputRef.current.value;
        console.log("username= ",username);

        if(username != ""){
             loggedin = true;
             setConnect((prevConn) => [...prevConn, username]);
            console.log(connected);
             
        }
        else{
             loggedin = false;
             console.log("We got a false result");
        }
        socket.emit('Logins', { joined : connected});
    }
    
   useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('Logins', (data) =>{
        console.log('Players');
        console.log(data.connected[0]);
        return setConnect((prevConn) =>  [...prevConn, data.joined] );
    });
    
     
    socket.on('Play', (data) => {
      console.log('Letter was received!');
      console.log(data);
      // If the server sends a message (on behalf of another client), then we
      // add it to the list of messages to render it on the UI.
      setCount((prevCount) => (data.num + data.count));
      console.log("current count is",data.count);
      
      board[data.index] = data.letter;
      return setBoard(prevBoard => [...data.letter]);
      //console.log(board);
    });
   },[]);
   
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    
   const player1 = connected[0];  //player 1 = first name
   const player2 = connected[1];  //player 2 = second name
   
   console.log(player1,player2);
  
  
    return (
            
        
    
    <div>
    
    <div class="login">
            <label for="name">Player Name:</label>
                <br/>
            <input ref={inputRef} type="text" placeholder="username" />
            <button type="submit" onClick={loginButton} class="buttn">Login</button>
        </div>
        
    <div class="board">
            {
            board.map(
                (itm, idx) => 
                <div class="box">
                    <button onClick={() => onClickButton(idx,1)}> Click </button>
                    <Tboard letter={itm}/>
                </div>
             )
            }
            </div>
    </div>
    );

}

export default App;
