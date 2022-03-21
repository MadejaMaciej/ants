import { Component } from 'react'
import { Board } from './Board'

var width = 50, height = 50

class Game extends Component {
  render(){
    return (
      <div id="game" className="game">
        <Board width={width} height={height} />
      </div>
    )
  }
}

export { Game }
