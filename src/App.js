import { useState } from 'react';

//Cada casilla del 3 en linea
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

//El tablero
function Board({ xIsNext, squares, onPlay, position }) {
  //si se ha ganado la partida o la casilla ya esta llena no pasa turno
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i] || position===10) { //porque tiene que ser triple ===?
      return;
    }
    //en caso contrario guarda hace una copia de squares y la envia a onPlay
    //ademas cambia el jugador pero no entiendo bien como hace las 2 cosas
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }


  // tal vez el sistema de control la verificacion de ganador y el aviso escrito deberia ser todo una unica funcion? 
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } 
  else if (position === 10) {
    status = 'Empate' ;
  } 
  else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

//es la funcion "main" y controla la etapa del juego que moviento vamos y el jugador que toca
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  // la funcion si no entiendo mal guarda un moviento  cuando clicamos una casilla
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    // Recorta el historial hasta el movimiento seleccionado es un añadido mio intente que en vez de usar el recorted llamara de nuevo al hanlePlay pero peto muy fuerte
    const recortedHistory = history.slice(0, nextMove + 1);
    setHistory(recortedHistory);
    
    // Actualiza el movimiento actual
    setCurrentMove(nextMove);
  }
  
    // Porque no se puede aprobechar el squares si ya nos da la config actual?  una constante igual a otra constante con un metodo que es una funcion que da un return? Que narizes???
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
    // esta forma de poner el codigo se me hace un poco liosa se chilla. No hay algun combenio como para ordenar las cosas dentro de la funcion?
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} position={moves.length}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
