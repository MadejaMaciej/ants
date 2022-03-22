import { Component } from 'react'
import { Board } from './Board'

import { randomNumber } from '../utils/random'

var width = 50, height = 50, that, health = 100
var startingResources = 20, resourcesSpawnTime = 20000, resourcesMaxQuantity = 20, resourcesMinQuantity = 1
var maxPopulationCap = 50, startingPopulation = 20

class Simulation extends Component {
  constructor(){
    super()
    this.state = {
      baseRed: [],
      baseGreen: [],
      resources: []
    }
    that = this
  }

  spawnResources(resourcesToSpawn, baseRed, baseGreen){
    var resource = []
    for(var i = 0; i < resourcesToSpawn; i++){
      do{
        var onBase = false
        var w = randomNumber(0, width - 1)
        var h = randomNumber(0, height - 1)
        var q = randomNumber(resourcesMinQuantity, resourcesMaxQuantity)
        for(var j = 0; j < baseRed.length; j++){
          if(baseRed[j].width == w && baseRed[j].height == h){
            onBase = true
          }
        }

        for(var j = 0; j < baseGreen.length; j++){
          if(baseGreen[j].width == w && baseGreen[j].height == h){
            onBase = true
          }
        }

        if(!onBase){
          resource.push({ width: w, height: h, quantity: q })
        }
      }while(onBase)
    }

    return resource
  }

  componentDidMount(){
    var pos1 = that.state.baseRed
    var pos2 = that.state.baseGreen
    var w1 = randomNumber(0, width/5)
    var h1 = randomNumber(0, height - 1)
    pos1.push({
      width: w1,
      height: h1,
      health: health
    })
    var w2 = randomNumber(width - 1 - (width/5), width - 1)
    var h2 = randomNumber(0, height - 1)
    pos2.push({
      width: w2,
      height: h2,
      health: health
    })

    var combinedResource = that.spawnResources(startingResources, {width: w1, height: h1}, {width: w2, height: h2})

    setInterval(() => {
      var resource = that.spawnResources(1, that.state.baseRed, that.state.baseGreen)
      var newResource = true
      var combinedResource = []

      for(var i = 0; i < that.state.resources.length; i++){
        if(resource[0].width == that.state.resources[i].width && resource[0].height == that.state.resources[i].height){
          newResource = false
          combinedResource.push(resource[0])
        }else{
          combinedResource.push(that.state.resources[i])
        }
      }

      if(newResource){
        combinedResource.push(resource[0])
      }

      that.setState({
        resources: combinedResource
      })

    }, resourcesSpawnTime)

    that.setState({
      baseRed: pos1,
      baseGreen: pos2,
      resources: combinedResource
    })
  }

  render(){
    return (
      <div id="game" className="game">
        <Board width={width} height={height} firstAnthillPositions={that.state.baseRed} secondAnthillPositions={that.state.baseGreen} resources={that.state.resources} />
      </div>
    )
  }
}

export { Simulation }