import logo from './logo.svg';
import './App.css';
import { Tboard } from './board.js';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();
function App() {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [counter,setCount] = useState(0);
    const [connected, setConnect] = useState([]);


    function onClickButton(index,itmNum) {
        setCount((prevCount) => prevCount + itmNum);
        var letter = "";
        
        if(counter % 2 == 0){
            letter = "X";
            
        }
        else{
            letter="O";
        }
        board[index] = letter;

        console.log(counter);
        //setBoard(board => [...board]);
        setBoard(prevBoard => {
            const newBoard = [...prevBoard];
            newBoard[index] = letter;
            return newBoard;
        });
        //console.log(board[item]);
        console.log(index);
        socket.emit('Play', { index: index, letter: board, count : counter, num : itmNum });
    }
    
        function loginButton(name){
        console.log("entered login button");
        if(name != ""){
             loggedin = true;
             //setConnect((prevConn) => ([...connected])
             console.log("We got a true result");
             
        }
        else{
             loggedin = false;
             console.log("We got a false result");
        }
        
    }
    
   useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('player1', (data) =>{
        
        
    }
    );
    
     socket.on('player2', (data) =>{
        
        
    }
    );
    
     socket.on('Spectator', (data) =>{
        
        
    }
    );
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
   
   var player1 = new Array;
   var player2 = new Array;
   
  
   let image;
   var loggedin = true;
     
   if(loggedin){
       
        image = <div class="board">
            {
            board.map(
                (itm, idx) => 
                <div class="box">
                    <button onClick={() => onClickButton(idx,1)}> Click </button>
                    <Tboard letter={itm}/>
                </div>
             )
            }
            </div>;
     
   }
   
   else{
   
        image =  <div class="login">
            <label for="name">Player Name:</label>
                <br/>
            <input type="text" placeholder="username" id="name"/>
            <button type="submit" onClick={() => loginButton(document.getElementById('name').value)} class="buttn">Login</button>
        </div>;
   }
    return (
            
        
    
    <div>
    { image }
    </div>
    );

}

export default App;
