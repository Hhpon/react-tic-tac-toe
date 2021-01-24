import React from "react"
import ReactDOM from "react-dom"
import "./index.css"

function Square(props) {
  const style = { color: props.isIt ? "red" : "" }
  return (
    <button className='square' style={style} onClick={props.onClick}>
      {props.value}
    </button>
  )
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
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        lineSquares: lines[i],
      }
    }
  }
  return null
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square isIt={this.props.lineSquares.includes(i)} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />
  }

  render() {
    const boardItem = Array(3)
      .fill(null)
      .map((row, rowIndex) => {
        const rowItem = Array(3)
          .fill(null)
          .map((col, colIndex) => {
            return this.renderSquare(rowIndex * 3 + colIndex)
          })
        return <div className='board-row'>{rowItem}</div>
      })
    return <div>{boardItem}</div>
  }
}

class Game extends React.Component {
  constructor() {
    super()
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      xIsNext: true,
      stepNumber: 0,
      isPositiveOrder: true,
      lineSquares: [],
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? "X" : "O"
    // 坐标系 以左上角为原点 向右向下为正方向
    this.setState({
      history: history.concat([
        {
          squares: squares,
          coordinate: `(  ${i % 3},${Math.floor(i / 3)}  )`,
        },
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    })
  }

  changeOrder() {
    this.setState({
      isPositiveOrder: !this.state.isPositiveOrder,
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    let winner = ""
    let lineSquares = []
    const calRes = calculateWinner(current.squares)
    if (calRes) {
      winner = calRes.winner
      lineSquares = calRes.lineSquares
    }
    const isMore = current.squares.some((square) => !square)

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + step.coordinate : "Go to game start"
      const style = { fontWeight: move === this.state.stepNumber ? "bold" : "" }
      return (
        <li key={move}>
          <button style={style} onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      )
    })

    let status
    if (winner) {
      status = "Winner: " + winner
    } else if (!isMore) {
      status = "平局"
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O")
    }

    return (
      <div className='game'>
        <div className='game-board'>
          <Board
            lineSquares={lineSquares}
            squares={current.squares}
            onClick={(i) => {
              this.handleClick(i)
            }}
          />
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <div>
            <button onClick={() => this.changeOrder()}>切换顺序</button>
          </div>
          <ol>{this.state.isPositiveOrder ? moves : moves.reverse()}</ol>
        </div>
      </div>
    )
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"))
