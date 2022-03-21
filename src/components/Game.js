import { Component } from 'react'
import { Board } from './Board'

class Game extends Component {
  render(){
    return (
      <div id="game" className="game">
        <Board width={50} height={50} />
      </div>
    )
  }
}

export { Game }
