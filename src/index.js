import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      // When someone wins, highlight the three squares that caused the win.
      style={{backgroundColor:`${props.winner? 'red' : 'white'}`}}
    >
        {props.value}
    </button>
  );
}

class Board extends React.Component {
  
  renderSquare(i) {
    return (
      <Square 
        key={i}
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
        winner={this.props.winner.indexOf(i) > -1 ? true : false}
      />
    );
  }

  renderBoard() {
    const board = [];
    for (var i = 0; i < 3; i++) {
      let row = [];
      for (var j = i * 3; j < (i + 1) * 3; j++) {
        row.push(this.renderSquare(j));
      }
      board.push(<div className="board-row" key={i}>{row}</div>);
    }
    return board;
  }

  render() {
    return (
      <div>
        {this.renderBoard()}
        {/* Implemented by anonymous function self-executed
        {
          (() => {
            const x = [];
            for(var i = 0; i < 3; i++) {
              x.push(<div className="board-row">{
                ((i) => {
                  let y = []
                  for(var j = i * 3; j < (i + 1) * 3; j++) {
                    y.push(this.renderSquare(j));
                  }
                  return y;
                })(i)
              }</div>);
            }
            console.log(x);
            return x;
          })()
        } */}
      </div>
    );
  }
}

class Game extends React.Component {
  static defaultProps = { 
    locations: [
      [1, 1], [1, 2], [1, 3],
      [2, 1], [2, 2], [2, 3],
      [3, 1], [3, 2], [3, 3],
    ]
  }

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        move: null
      }],
      stepNumber: 0,
      xIsNext: true,
      ascending: true // sort the moves in either ascending or descending order
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).length || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        move: this.props.locations[i]
      }]), 
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }
  
  render() {
    const history = this.state.history;
    const stepNumber = this.state.stepNumber;
    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' (' + step.move + ')' :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} style={{fontWeight: `${move === stepNumber ? 700 : 300}`}}>{desc}</button>
        </li>
      );
    });

    const ascending = this.state.ascending;
    const sorted_moves = (ascending ? moves : moves.reverse());

    let status;
    if (winner.length) {
      status = 'Winner: ' + (this.state.xIsNext ? 'O' : 'X');
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div><button onClick={() => this.setState({ascending: !ascending})}>Sort orders in {ascending ? 'descending' : 'ascending'}</button></div>
          <ol>{sorted_moves}</ol>
        </div>
      </div>
    );
  }
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
      // When someone wins, return the array with value
      return [a, b, c];
    }
  }
  // While the game, just return the empty array
  return [];
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);