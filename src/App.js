import logo from './logo.svg';
import './App.css';
import { Tboard } from './board.js';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

function App() {
    const [board, setBoard] = useState(Array(9).fill(null));


    function onClickButton(index) {
        board[index] = 'X';
        //setBoard(board => [...board]);
        setBoard(prevBoard => {
            const newBoard = [...prevBoard];
            newBoard[index] = 'X';
            return newBoard;
        });
        //console.log(board[item]);
        console.log(index);
        socket.emit('Play', { index: index, letter: board });
    }
    
   useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('Play', (data) => {
      console.log('X was received!');
      console.log(data);
      // If the server sends a message (on behalf of another client), then we
      // add it to the list of messages to render it on the UI.
      board[data.index] = data.letter; 
      return setBoard(prevBoard => [...data.letter]);
      //console.log(board);
    });
   },[]);


    //<button onClick={onClickButton}>Click</button></div>
    return (

    <div class="board">
    
        {
        board.map(
            (itm, idx) => 
            <div class="box">
                <button onClick={() => onClickButton(idx)}> Click </button>
                <Tboard letter={itm}/>
            </div>  
            )
        }
    </div>
    );

}

export default App;
