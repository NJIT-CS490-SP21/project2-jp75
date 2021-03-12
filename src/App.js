// import logo from './logo.svg';
import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import { Tboard, User } from './board';

const socket = io();

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [counter, setCount] = useState(0);
  const [connected, setConnect] = useState([]);
  const [shown, setShown] = useState(false);
  const [Player1] = useState([]);
  const [Player2] = useState([]);
  const [moves, setMoves] = useState([]);
  const inputRef = useRef(null);
  const [userList, setUserList] = useState([]);
  const [userScore, setUserScore] = useState([]);
  const [shownList, setShowList] = useState(true);

  // const reset = useCallback(() => {
  //     setBoard(Array(9).fill(null))        // Trying to set a reset button
  // }, Array(9).fill(null));

  const [name, setUser] = useState([]);

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
    for (let i = 0; i < possible.length; i += 1) {
      const [a, b, c] = possible[i];
      if (player[a] && player[a] === player[b] && player[a] === player[c]) {
        return 'winner';
      }
    }
    return null;
  }

  const winner = calculateWinner(board);

  function turn(player1, player2) {
    console.log('Counter for turn', counter);
    if (counter % 2 === 0) {
      return player1;
    }
    return player2;
  }

  function spectators(connec) {
    let i;
    const specs = [];
    for (i = 2; i < connec.length; i += 1) {
      specs.push(connec[i]);
    }

    return specs;
  }

  function showBoard() {
    setShown(true);
  }

  function showList() {
    setShowList((prevList) => !prevList);
  }

  function resetButton() {
    setBoard(Array(9).fill(null));
    socket.emit('Reset', { Reset: board });
  }

  function loginButton() {
    const username = inputRef.current.value;

    if (username !== '') {
      console.log('Current logins:', connected);
      console.log('Length', connected.length);

      socket.emit('Logins', { joined: username });
      showBoard(); // shows the board if you click on login
      setUser(username);
    } else {
      console.log('We got a false result');
    }
  }

  function clickedBoxes(brd) {
    // Declare variable to store number of clicked boxes.
    let count = 0;

    // Iterate over all boxes
    brd.forEach((item) => {
      // Check if box is clicked (not null)
      if (item !== null) {
        // If yes, increase the value of count by 1
        count += 1;
      }
    });

    // Check if all boxes are clicked (filled)
    if (count === 9) {
      return true;
    }
    return false;
  }
  function onClickButton(player, index, countNum) {
    // console.log("Did they win on the click?",winner);
    // console.log("Passed num", countNum);
    console.log('Player turn: ', player);

    if (player === name) {
      // This seems to work for my names that have a

      console.log('board: ', board[index]);

      if (board[index] === null) {
        setMoves((prevMove) => [...prevMove, player]);
        // console.log("MOVES:", moves);

        setCount((prevCount) => prevCount + 1);
        // console.log("counter", counter);

        let letter = '';
        if (counter % 2 === 0) {
          letter = 'X';
          board[index] = letter;
          Player1.push(index);
          // console.log(Player1);
        } else {
          letter = 'O';
          board[index] = letter;
          Player2.push(index);
        }

        // setBoard(board => [...board]);
        setBoard((prevBoard) => {
          const newBoard = [...prevBoard];
          newBoard[index] = letter;
          return newBoard;
        });

        // console.log("Winner", calculateWinner(Player1));
        // console.log("Winner:", winner);
        // var win = calculateWinner(Player1, player);

        // if(win == "winner"){
        // setWinner(prevWinner => [...prevWinner, win]);
        // socket.emit("Winner", {Winner: win, Player: player});
        // }
      }
      const currentWinner = calculateWinner(board);

      console.log('Winner: ', calculateWinner(Player1));
      console.log('Winner: ', calculateWinner(Player2));

      // console.log(board[item]);
      console.log(index);
      socket.emit('Play', {
        index,
        Player: turn,
        letter: board,
        count: counter,
        num: countNum,
        Move: player,
        Player1_Winner: calculateWinner(Player1, player),
        Player2_Winner: calculateWinner(Player2, player),
      });
      if (currentWinner === 'winner') {
        socket.emit('Winner', {
          winner: player,
          loser: (<board User name={moves[moves.length - 1]} />).props.name,
          score: 1,
        });
      } else if (clickedBoxes(board) === true && winner !== 'winner') {
        // emits that there was a draw
        console.log('Its a draw...');
        socket.emit('Draw', { Draw: 'draw', score: 0 });
      }
    }
  }

  useEffect(() => {
    socket.on('Logins', (data) => {
      console.log('New Login');
      console.log(data);
      setConnect((prevConn) => [...prevConn, data.joined]);
    });

    socket.on('User_List', (data) => {
      console.log('user list data was received!');
      console.log(data);

      setUserList(data.users);
      setUserScore(data.score);

      // console.log("List of users",userList);                //This works
      // console.log("List of user Scores",userScore);
    });

    socket.on('Play', (data) => {
      console.log('Letter was received!');
      console.log(data);
      // If the server sends a message (on behalf of another client), then we
      // add it to the list of messages to render it on the UI.
      setMoves((prevMove) => [...prevMove, data.Move]);
      setCount(data.count + data.num);
      console.log('current count is', data.count);

      // board[data.index] = data.letter;
      return setBoard(() => ([...data.letter]));
    });

    socket.on('Reset', (data) => {
      console.log('Reseting game');
      console.log(data);
      // If the server sends a message (on behalf of another client), then we
      // add it to the list of messages to render it on the UI.
      setCount(0);

      return setBoard(Array(9).fill(null));
    });
  }, []);

  const getSpecs = spectators(connected);

  console.log(getSpecs, ' is a spectator');

  console.log('Current connected users', connected);

  console.log('Username: ', name);

  const login = name;

  // console.log(<board User name={moves[moves.length-2]}/>['props']['name']);

  return (
    <div className="center">
      {shown === false ? (
        <div className="login">
          <div>Player Login: </div>
          <input name="name" ref={inputRef} type="text" placeholder="username" />
          <button type="submit" onClick={loginButton} className="buttn">
            Login
          </button>
        </div>
      ) : null}

      {shown === true ? (
        <div>
          <div className="login" id={login}>
            {' '}
            username:
            {' '}
            {login}
          </div>

          <div className="user">
            {' '}
            Player1:
            {connected[0]}
            {' '}
            = &quot;X&quot;
            {' '}
          </div>
          <div className="user">
            {' '}
            Player2:
            {connected[1]}
            {' '}
            = &quot;O&quot;
            {' '}
          </div>
          <div>
            {' '}
            Spectators:
            {getSpecs}
          </div>

          <br />

          {winner === 'winner' ? null : (
            <div className="Players">
              It&rsquo;s
              {' '}
              {turn(connected[0], connected[1])}
              &rsquo;s turn
            </div>
          )}
          <div className="board">
            {board.map((itm, idx) => (
              <div className="box">
                {winner === 'winner' ? null : (
                  <button
                    type="button"
                    aria-label="board"
                    className="square"
                    onClick={() => onClickButton(turn(connected[0], connected[1]), idx, 1)}
                  />
                )}

                <Tboard letter={itm} />
              </div>
            ))}
          </div>

          {winner === 'winner' ? (
            <div className="winner">
              {' '}
              {
                (<board User name={moves[moves.length - 1]} />).props.name
              }
              {' '}
              is the Winner!
              {' '}
            </div>
          ) : null}

          {clickedBoxes(board) === true && winner !== 'winner' ? (
            <div className="winner"> Draw! Game Over... </div>
          ) : null}

          <div className="reset">
            {clickedBoxes(board) === true && winner !== 'winner' ? (
              <button type="submit" onClick={resetButton} className="reset">
                Restart game?
              </button>
            ) : null}
          </div>

          <div className="reset">
            {winner === 'winner' ? (
              <button type="submit" onClick={resetButton} className="reset">
                Restart game?
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {shown === true ? (
        <div align="right">
          <button type="button" className="leaderboard" onClick={() => showList()}>
            Show Leaderboard
          </button>

          {shownList === true ? (
            <div>
              <table className="name" align="right">
                <thead>
                  <tr>
                    <th colSpan="2">Leaderboard:</th>
                  </tr>
                </thead>
                <tbody className="table">
                  <tr>
                    <td>
                      {userList.map((user, index) => (
                        <User index={index} name={user} />
                      ))}
                    </td>
                    <td>
                      {userScore.map((user, index) => (
                        <User index={index} name={user} />
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default App;
