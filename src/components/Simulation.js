import { Component } from 'react'
import { Board } from './Board'

import { randomNumber } from '../utils/random'

var width = 50, height = 50, that

class Simulation extends Component {
  constructor(){
    super()
    this.state = {
      position1: [],
      position2: []
    }
    that = this
  }

  componentDidMount(){
    var pos1 = that.state.position1
    var pos2 = that.state.position2
    var w1 = randomNumber(0, width/5)
    var h1 = randomNumber(0, height - 1)
    pos1.push({
      width: w1,
      height: h1
    })
    var w2 = randomNumber(width - 1 - (width/5), width - 1)
    var h2 = randomNumber(0, height - 1)
    pos2.push({
      width: w2,
      height: h2
    })

    that.setState({
      position1: pos1,
      position2: pos2
    })
  }

  render(){
    return (
      <div id="game" className="game">
        <Board width={width} height={height} firstAnthillPositions={that.state.position1} secondAnthillPositions={that.state.position2} />
      </div>
    )
  }
}

export { Simulation }