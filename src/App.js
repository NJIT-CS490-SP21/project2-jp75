import logo from './logo.svg';
import './App.css';
import { Tboard, User} from './board.js';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

function App() {

    var [board, setBoard] = useState(Array(9).fill(null));
    const [counter, setCount] = useState(0);
    const [connected, setConnect] = useState([]);
    const [shown, setShown] = useState(false);
    const [Player1] = useState([]);
    const [Player2] = useState([]);
    const winner = calculateWinner(board);
    const [moves, setMoves] = useState([]);
    const inputRef = useRef(null);
    const [userList,setUserList] = useState([]);
    const [userScore,setUserScore] = useState([]);
    const [shownList,setShowList] = useState(true);


    // const reset = useCallback(() => {
    //     setBoard(Array(9).fill(null))        // Trying to set a reset button
    // }, Array(9).fill(null));


    const [name, setUser] = useState([]);


    function onClickButton(player, index, countNum) {

        //console.log("Did they win on the click?",winner);
        //console.log("Passed num", countNum);
        console.log("Player turn: ", player);

        if (player == name) { //This seems to work for my names that have a

            console.log("board: ", board[index]);

            if (board[index] == null) {

                setMoves((prevMove) => [player]);

                setCount((prevCount) => (prevCount + 1));
                //console.log("counter", counter);

                var letter = "";
                if (counter % 2 == 0) {
                    letter = "X";
                    board[index] = letter;
                    Player1.push(index);
                    //console.log(Player1);

                }

                else {
                    letter = "O";
                    board[index] = letter;
                    Player2.push(index);

                }


                //setBoard(board => [...board]);
                setBoard(prevBoard => {
                    const newBoard = [...prevBoard];
                    newBoard[index] = letter;
                    return newBoard;
                });

                //console.log("Winner", calculateWinner(Player1));
                //console.log("Winner:", winner);
                //var win = calculateWinner(Player1, player);

                //if(win == "winner"){
                //setWinner(prevWinner => [...prevWinner, win]);
                //socket.emit("Winner", {Winner: win, Player: player});
                //}
            }


            const currentWinner = calculateWinner(board);
            
            console.log("Winner: ", calculateWinner(Player1));
            console.log("Winner: ", calculateWinner(Player2));

            //console.log(board[item]);
            console.log(index);
            socket.emit('Play', { index: index, Player: turn, letter: board, count: counter, num: countNum, Move: player, Player1_Winner: calculateWinner(Player1, player), Player2_Winner: calculateWinner(Player2, player) });
            if (currentWinner == "winner") {
                socket.emit("Winner", { winner: player, loser: <board User name={moves[moves.length-1]}/> ['props']['name'], score:1 });  //this might not be accurate for wins, maybe try the if statement that I tired last time
            }
            
            else if (clickedBoxes(board) == true && winner != 'winner') { //emits that there was a draw
                console.log("Its a draw...");
                socket.emit("Draw", { Draw: 'draw' , score:0 });
            }

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
        var spectators = [];
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
    
    function showList(){
        setShowList((prevList) => {
            return !prevList;
            
        });
    }

    function resetButton() {
        setBoard(Array(9).fill(null));
        socket.emit("Reset", { Reset: board });
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
                return "winner";
            }

        }
    }

    function clickedBoxes(board) {
        // Declare variable to store number of clicked boxes.
        var count = 0;

        // Iterate over all boxes
        board.forEach(function(item) {
            // Check if box is clicked (not null)
            if (item !== null) {
                // If yes, increase the value of count by 1
                count++;
            }
        });

        // Check if all boxes are clicked (filled)
        if (count === 9) {
            return true;
        }
        else {
            return false;
        }
    }

    useEffect(() => {

        socket.on('Logins', (data) => {
            console.log("New Login");
            console.log(data);
            setConnect(prevConn => [...prevConn, data.joined]);

        });
        
        
        socket.on('User_List', (data) => {
            console.log("user list data was received!");
            console.log(data);
            
            setUserList(data.users);
            setUserScore(data.score);
            
            //console.log("List of users",userList);                //This works
            //console.log("List of user Scores",userScore);
            
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

    //console.log(<board User name={moves[moves.length-2]}/>['props']['name']);

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
         <div> Spectators: {getSpecs} </div>
         
         <br/>
         
         {winner == "winner"
         ? null  
         :<div class="Players">It's {turn(connected[0],connected[1])}'s turn</div>}
    <div class="board">  
            {
            board.map(
                (itm, idx) => 
                <div class="box">
                    { winner == "winner"
                    ? null 
                    :<button class="square" onClick={() => onClickButton(turn(connected[0],connected[1]),idx,1)}></button> }
              
                    <Tboard letter={itm}/>
                    
                    </div>
             )
            }
            </div>
       
      
         { winner == "winner"
       ? <div class="winner"> {<board User name={moves[moves.length-1]}/>['props']['name']} is the Winner! </div>
       : null }

         {clickedBoxes(board) == true && winner != "winner"
         ?<div class="winner"> Draw! Game Over... </div>
         : null}
         
         <div class="reset">
        { clickedBoxes(board) == true && winner != "winner" 
       ? <button type="submit" onClick={resetButton} class="reset">Restart game?</button> 
       : null }
       
       </div>

        <div class="reset">
        { winner == "winner" 
       ? <button type="submit" onClick={resetButton} class="reset">Restart game?</button> 
       : null }
       
       </div> 
       
       </div> ) : null}
     
     
        {shown === true ? (
        <div align="right">
        <button onClick={() => showList()}>Show Leaderboard</button>
        
        {shownList === true ?
        <div>
        <table class="name" align="right">
            <thead>
                <tr>
                    <th colspan="2">Leaderboard:</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td> Names:
                    {userList.map((user,index) => <User key={index} name={user}/>)}
                    </td>
                    <td> Scores:
                    {userScore.map((user,index) => <User key={index} name={user}/>)}
                    </td>
                </tr>
            </tbody>
        </table>
        </div>  : null}
        </div>
        ) : null}
  
       
    </div>
    

    );

}

export default App;
