import { Component } from 'react'
import { Board } from './Board'
import { Ant } from './Ant'
import { Anthill } from './Anthill'
import { Resource } from './Resource'
import { Stats } from './Stats'

import { randomNumber, getRandomName, getRandomItem, getRandomItemBasedOnValue } from '../utils/random'

var width = 50, height = 50, that, health = 100
var startingResources = 20, resourcesSpawnTime = 20000, resourcesMaxQuantity = 20, resourcesMinQuantity = 1, spawnResourceInterval
var maxPopulationCap = 50, starting = 1
var geneticalExchangeCost = 30, birthModifier = 0.5, twoBirthsChanceModifier = 0.2, lvlExperienceFirst = 1000, lvlExperienceModifier = 1.5
var speedOfAnim = 1000, moveInterval
var feromoneDissapearInterval = 5000, feromoneInterval

class Simulation extends Component {
  constructor(){
    super()
    this.state = {
      baseRed: {width: null, height: null, health: 100},
      baseGreen: {width: null, height: null, health: 100},
      resources: [],
      redStats: {
        population: starting,
        currentPopulation: starting,
        ants: [],
        resource: startingResources,
        averageStats: {
          health: 0,
          attack: 0
        },
        generation: 1
      },
      greenStats: {
        population: starting,
        currentPopulation: starting,
        ants: [],
        resource: startingResources,
        averageStats: {
          health: 0,
          attack: 0
        },
        generation: 1
      },
      map : []
    }
    that = this
  }

  geneticalExchange(){

  }

  fight(){

  }

  showAnts(){
    var toRender = []

    for(let i = 0; i < that.state.redStats.ants.length; i++){
      let key = `red-${i}`
      toRender.push(<Ant color='red' classes='ant red-ant position-absolute clickable z-index-100' ant={that.state.redStats.ants[i]} key={key} width={width} height={height} />)
    }
    
    for(let i = 0; i < that.state.greenStats.ants.length; i++){
      let key = `green-${i}`
      toRender.push(<Ant color='green' classes='ant green-ant position-absolute clickable z-index-100' ant={that.state.greenStats.ants[i]} key={key} width={width} height={height} />)
    }

    return toRender
  }

  showAnthills(){
    var toRender = []
    toRender.push(<Anthill anthill={that.state.baseRed} color="red" classes='z-index-99 anthill props-red position-absolute clickable' key='redAnthill' width={width} height={height} />)
    toRender.push(<Anthill anthill={that.state.baseGreen} color='green' classes='z-index-99 anthill props-green position-absolute clickable' key='greenAnthill' width={width} height={height} />)

    return toRender
  }

  showResources(){
    var toRender = []

    for(let i = 0; i < that.state.resources.length; i++){
      let key = `res-${i}`
      toRender.push(<Resource classes='resource position-absolute clickable z-index-98' resource={that.state.resources[i]} key={key} width={width} height={height} />)
    }

    return toRender
  }

  chooseWhereToMove(base, starting, isRed, to){
    var possibilities = []
    if(starting){
      if(base.width - 1 > 0){
        possibilities.push({ width: base.width - 1, height: base.height })
      }
      if(base.width + 1 < width){
        possibilities.push({ width: base.width + 1, height: base.height })
      }
      if(base.height - 1 >= 0){
        possibilities.push({ width: base.width, height: base.height - 1 })
      }
      if(base.height + 1 < height){
        possibilities.push({ width: base.width, height: base.height + 1 })
      }
      if(base.width - 1 >= 0 && base.height - 1 >= 0){
        possibilities.push({ width: base.width - 1, height: base.height - 1 })
      }
      if(base.width + 1 < width && base.height - 1 >= 0){
        possibilities.push({ width: base.width + 1, height: base.height - 1 })
      }
      if(base.width - 1 >= 0 && base.height + 1 < height){
        possibilities.push({ width: base.width - 1, height: base.height + 1 })
      }
      if(base.width + 1 < width && base.height + 1 < height){
        possibilities.push({ width: base.width + 1, height: base.height + 1 })
      }
      
      return getRandomItem(possibilities)
    }else{
      // Add here checking if some resource is in range of ant
      if(base.width - 1 > 0){
        if(isRed){
          if(to){
            possibilities.push({ width: base.width - 1, height: base.height, value: that.state.map[base.width - 1][base.height].feromonsWorkerRed })
          }else{
            possibilities.push({ width: base.width - 1, height: base.height, value: that.state.map[base.width - 1][base.height].feromonsWorkerBackRed })
          }
        }else{
          if(to){
            possibilities.push({ width: base.width - 1, height: base.height, value: that.state.map[base.width - 1][base.height].feromonsWorkerGreen })
          }else{
            possibilities.push({ width: base.width - 1, height: base.height, value: that.state.map[base.width - 1][base.height].feromonsWorkerBackGreen })
          }
        }
      }
      
      if(base.width + 1 < width){
        if(isRed){
          if(to){
            possibilities.push({ width: base.width + 1, height: base.height, value: that.state.map[base.width + 1][base.height].feromonsWorkerRed })
          }else{
            possibilities.push({ width: base.width + 1, height: base.height, value: that.state.map[base.width + 1][base.height].feromonsWorkerBackRed })
          }
        }else{
          if(to){
            possibilities.push({ width: base.width + 1, height: base.height, value: that.state.map[base.width + 1][base.height].feromonsWorkerGreen })
          }else{
            possibilities.push({ width: base.width + 1, height: base.height, value: that.state.map[base.width + 1][base.height].feromonsWorkerBackGreen })
          }
        }
      }

      if(base.height - 1 >= 0){
        if(isRed){
          if(to){
            possibilities.push({ width: base.width, height: base.height - 1, value: that.state.map[base.width][base.height - 1].feromonsWorkerRed })
          }else{
            possibilities.push({ width: base.width, height: base.height - 1, value: that.state.map[base.width][base.height - 1].feromonsWorkerBackRed })
          }
        }else{
          if(to){
            possibilities.push({ width: base.width, height: base.height - 1, value: that.state.map[base.width][base.height - 1].feromonsWorkerGreen })
          }else{
            possibilities.push({ width: base.width, height: base.height - 1, value: that.state.map[base.width][base.height - 1].feromonsWorkerBackGreen })
          }
        }
      }

      if(base.height + 1 < height){
        if(isRed){
          if(to){
            possibilities.push({ width: base.width, height: base.height + 1, value: that.state.map[base.width][base.height + 1].feromonsWorkerRed })
          }else{
            possibilities.push({ width: base.width, height: base.height + 1, value: that.state.map[base.width][base.height + 1].feromonsWorkerBackRed })
          }
        }else{
          if(to){
            possibilities.push({ width: base.width, height: base.height + 1, value: that.state.map[base.width][base.height + 1].feromonsWorkerGreen })
          }else{
            possibilities.push({ width: base.width, height: base.height + 1, value: that.state.map[base.width][base.height + 1].feromonsWorkerBackGreen })
          }
        }
      }

      if(base.width - 1 >= 0 && base.height - 1 >= 0){
        if(isRed){
          if(to){
            possibilities.push({ width: base.width - 1, height: base.height - 1, value: that.state.map[base.width - 1][base.height - 1].feromonsWorkerRed })
          }else{
            possibilities.push({ width: base.width - 1, height: base.height - 1, value: that.state.map[base.width - 1][base.height - 1].feromonsWorkerBackRed })
          }
        }else{
          if(to){
            possibilities.push({ width: base.width - 1, height: base.height - 1, value: that.state.map[base.width - 1][base.height - 1].feromonsWorkerGreen })
          }else{
            possibilities.push({ width: base.width - 1, height: base.height - 1, value: that.state.map[base.width - 1][base.height - 1].feromonsWorkerBackGreen })
          }
        }
      }

      if(base.width + 1 < width && base.height - 1 >= 0){
        if(isRed){
          if(to){
            possibilities.push({ width: base.width + 1, height: base.height - 1, value: that.state.map[base.width + 1][base.height - 1].feromonsWorkerRed })
          }else{
            possibilities.push({ width: base.width + 1, height: base.height - 1, value: that.state.map[base.width + 1][base.height - 1].feromonsWorkerBackRed })
          }
        }else{
          if(to){
            possibilities.push({ width: base.width + 1, height: base.height - 1, value: that.state.map[base.width + 1][base.height - 1].feromonsWorkerGreen })
          }else{
            possibilities.push({ width: base.width + 1, height: base.height - 1, value: that.state.map[base.width + 1][base.height - 1].feromonsWorkerBackGreen })
          }
        }
      }

      if(base.width - 1 >= 0 && base.height + 1 < height){
        if(isRed){
          if(to){
            possibilities.push({ width: base.width - 1, height: base.height + 1, value: that.state.map[base.width - 1][base.height + 1].feromonsWorkerRed })
          }else{
            possibilities.push({ width: base.width - 1, height: base.height + 1, value: that.state.map[base.width - 1][base.height + 1].feromonsWorkerBackRed })
          }
        }else{
          if(to){
            possibilities.push({ width: base.width - 1, height: base.height + 1, value: that.state.map[base.width - 1][base.height + 1].feromonsWorkerGreen })
          }else{
            possibilities.push({ width: base.width - 1, height: base.height + 1, value: that.state.map[base.width - 1][base.height + 1].feromonsWorkerBackGreen })
          }
        }
      }

      if(base.width + 1 < width && base.height + 1 < height){
        if(isRed){
          if(to){
            possibilities.push({ width: base.width + 1, height: base.height + 1, value: that.state.map[base.width + 1][base.height + 1].feromonsWorkerRed })
          }else{
            possibilities.push({ width: base.width + 1, height: base.height + 1, value: that.state.map[base.width + 1][base.height + 1].feromonsWorkerBackRed })
          }
        }else{
          if(to){
            possibilities.push({ width: base.width + 1, height: base.height + 1, value: that.state.map[base.width + 1][base.height + 1].feromonsWorkerGreen })
          }else{
            possibilities.push({ width: base.width + 1, height: base.height + 1, value: that.state.map[base.width + 1][base.height + 1].feromonsWorkerBackGreen })
          }
        }
      }
      
      return getRandomItemBasedOnValue(possibilities)
    }
  }

  moveAnts(){
    var redAnts = []
    var greenAnts = []
    var map = that.state.map

    for(let i = 0; i < that.state.redStats.ants.length; i++){
      let ant = that.state.redStats.ants[i]
      ant.position = ant.nextPosition
      if(!ant.inFight){
        if(ant.comingBack){
          let increaseMap = true
          for(let j = 0; j < ant.feromonFromLeft.length; j++){
            if(ant.feromonFromLeft[j].width == ant.position.width && ant.feromonFromLeft[j].height == ant.position.height){
              increaseMap = false
            }
          }
          if(increaseMap){
            var el = map[ant.position.width][ant.position.height]
            if(el){
              el.feromonsWorkerBackRed += 1
              ant.feromonFromLeft.push({width: ant.position.width, height: ant.position.height})
              map[ant.position.width][ant.position.height] = el
            }
          }
        }else{
          let increaseMap = true
          for(let j = 0; j < ant.feromonToLeft.length; j++){
            if(ant.feromonToLeft[j].width == ant.position.width && ant.feromonToLeft[j].height == ant.position.height){
              increaseMap = false
            }
          }
          if(increaseMap){
            var el = map[ant.position.width][ant.position.height]
            if(el){
              el.feromonsWorkerRed += 1
              ant.feromonToLeft.push({width: ant.position.width, height: ant.position.height})
              map[ant.position.width][ant.position.height] = el
            }
          }
        }
      }else{
        that.fight()
      }
      ant.nextPosition = that.chooseWhereToMove(ant.position, false, true, true, true)
      redAnts.push(ant)
    }

    for(let i = 0; i < that.state.greenStats.ants.length; i++){
      let ant = that.state.greenStats.ants[i]
      ant.position = ant.nextPosition
      if(!ant.inFight){
        if(ant.comingBack){
          let increaseMap = true
          for(let j = 0; j < ant.feromonFromLeft.length; j++){
            if(ant.feromonFromLeft[j].width == ant.position.width && ant.feromonFromLeft[j].height == ant.position.height){
              increaseMap = false
            }
          }
          if(increaseMap){
            var el = map[ant.position.width][ant.position.height]
            if(el){
              el.feromonsWorkerBackGreen += 1
              ant.feromonFromLeft.push({width: ant.position.width, height: ant.position.height})
              map[ant.position.width][ant.position.height] = el
            }
          }
        }else{
          let increaseMap = true
          for(let j = 0; j < ant.feromonToLeft.length; j++){
            if(ant.feromonToLeft[j].width == ant.position.width && ant.feromonToLeft[j].height == ant.position.height){
              increaseMap = false
            }
          }
          if(increaseMap){
            var el = map[ant.position.width][ant.position.height]
            if(el){
              el.feromonsWorkerGreen += 1
              ant.feromonToLeft.push({width: ant.position.width, height: ant.position.height})
              map[ant.position.width][ant.position.height] = el
            }
          }
        }
      }else{
        that.fight()
      }
      ant.nextPosition = that.chooseWhereToMove(ant.position, false, false, true, true)
      greenAnts.push(ant)
    }

    that.setState({
      redStats: {
        population: that.state.redStats.population,
        currentPopulation: that.state.redStats.currentPopulation,
        averageStats: that.getAverageStats(redAnts),
        generation: that.state.redStats.generation,
        resource: that.state.redStats.resource,
        ants: redAnts
      },
      greenStats: {
        population: that.state.greenStats.population,
        currentPopulation: that.state.greenStats.currentPopulation,
        averageStats: that.getAverageStats(greenAnts),
        generation: that.state.greenStats.generation,
        resource: that.state.greenStats.resource,
        ants: greenAnts
      },
      map: map
    })
  }

  generateAnts(quantity, basePosition){
    var ants = []
    
    for(let i = 0; i < quantity; i++){
      let nameRand = getRandomName()
      let health = randomNumber(0, 1023)
      ants.push({
        name: nameRand[0],
        surname: nameRand[1]+nameRand[2],
        class: 'Ant',
        health: health,
        attack: randomNumber(0, 1023),
        currentHealth: health,
        position: basePosition,
        nextPosition: that.chooseWhereToMove(basePosition, true),
        feromonToLeft: [],
        feromonFromLeft: [],
        level: 1,
        experience: 0,
        activity: 'Searching for resource or enemy',
        inFight: false,
        comingBack: false
      })
    }

    return ants
  }

  dissapearFeromons(){
    var newMap = []
    for(let i = 0; i < that.state.map.length; i++){
      newMap.push([])
      for(let j = 0; j < that.state.map[i].length; j++){
        var feromonsWorkerBackGreen = that.state.map[i][j].feromonsWorkerBackGreen
        var feromonsWorkerBackRed = that.state.map[i][j].feromonsWorkerBackRed
        var feromonsWorkerGreen = that.state.map[i][j].feromonsWorkerGreen
        var feromonsWorkerRed = that.state.map[i][j].feromonsWorkerRed
  
        if(feromonsWorkerBackGreen - 1 > 0){
          feromonsWorkerBackGreen -= 1
        }
  
        if(feromonsWorkerBackRed - 1 > 0){
          feromonsWorkerBackRed -= 1
        }
  
        if(feromonsWorkerGreen - 1 > 0){
          feromonsWorkerGreen -= 1
        }
  
        if(feromonsWorkerRed - 1 > 0){
          feromonsWorkerRed -= 1
        }
  
        newMap[i].push({
          feromonsWorkerBackGreen,
          feromonsWorkerBackRed,
          feromonsWorkerGreen,
          feromonsWorkerRed,
        })
      }
    }

    that.setState({
      map: newMap
    })
  }

  getAverageStats(ants){
    var avgAttack = 0
    var avgHealth = 0
    
    for(var i = 0; i < ants.length; i++){
      avgAttack += ants[i].attack
      avgHealth += ants[i].health
    }

    avgAttack = Math.floor(avgAttack/ants.length)
    avgHealth = Math.floor(avgHealth/ants.length)

   return { health: avgHealth, attack: avgAttack }
  }

  spawnResources(resourcesToSpawn, baseRed, baseGreen){
    var resource = []
    for(var i = 0; i < resourcesToSpawn; i++){
      do{
        var onBase = false
        var w = randomNumber(0, width - 1)
        var h = randomNumber(0, height - 1)
        var q = randomNumber(resourcesMinQuantity, resourcesMaxQuantity)
        if(baseRed.width === w && baseRed.height === h){
          onBase = true
        }

        if(baseGreen.width === w && baseGreen.height === h){
          onBase = true
        }

        if(!onBase){
          resource.push({ width: w, height: h, quantity: q })
        }
      }while(onBase)
    }

    return resource
  }

  spawnResourceInterval(){
    var resource = that.spawnResources(1, that.state.baseRed, that.state.baseGreen)
      var newResource = true
      var combinedResource = []

      for(var i = 0; i < that.state.resources.length; i++){
        if(resource[0].width === that.state.resources[i].width && resource[0].height === that.state.resources[i].height){
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
  }

  componentDidMount(){
    var w1 = randomNumber(0, width/5)
    var h1 = randomNumber(0, height - 1)
    var w2 = randomNumber(width - 1 - (width/5), width - 1)
    var h2 = randomNumber(0, height - 1)

    var combinedResource = that.spawnResources(startingResources, {width: w1, height: h1}, {width: w2, height: h2})

    spawnResourceInterval = setInterval(() => {
      that.spawnResourceInterval()
    }, resourcesSpawnTime)

    var redAnts = that.generateAnts(starting, {width: w1, height: h1})
    var blueAnts = that.generateAnts(starting, {width: w2, height: h2})
    var m = []

    for(var i = 0; i < width; i++){
      m.push([])
      for(var j = 0; j < height; j++){
        m[i].push({
          feromonsWorkerRed: 1,
          feromonsWorkerGreen: 1,
          feromonsWorkerBackRed: 1,
          feromonsWorkerBackGreen: 1
        })
      }
    }

    moveInterval = setInterval(() => {
      that.moveAnts()
    }, speedOfAnim)

    feromoneInterval = setInterval(() => {
      that.dissapearFeromons()
    }, feromoneDissapearInterval)
    
    that.setState({
      baseRed: {
        width: w1,
        height: h1,
        health: health
      },
      baseGreen: {
        width: w2,
        height: h2,
        health: health
      },
      resources: combinedResource,
      redStats: {
        population: starting,
        currentPopulation: starting,
        ants: redAnts,
        averageStats: that.getAverageStats(redAnts),
        generation: 1,
        resource: startingResources
      },
      greenStats: {
        population: starting,
        currentPopulation: starting,
        ants: blueAnts,
        averageStats: that.getAverageStats(blueAnts),
        generation: 1,
        resource: startingResources
      },
      map: m
    })
  }

  componentWillUnmount(){
    if(spawnResourceInterval){
      clearInterval(spawnResourceInterval)
    }

    if(moveInterval){
      clearInterval(moveInterval)
    }
  }

  pauseSimulation(){
    var el = document.getElementById('pause')
    if(el){
      if(el.textContent == 'Unpause simulation'){

        spawnResourceInterval = setInterval(() => {
          var resource = that.spawnResources(1, that.state.baseRed, that.state.baseGreen)
          var newResource = true
          var combinedResource = []
    
          for(var i = 0; i < that.state.resources.length; i++){
            if(resource[0].width === that.state.resources[i].width && resource[0].height === that.state.resources[i].height){
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

        moveInterval = setInterval(() => {
          that.moveAnts()
        }, speedOfAnim)

        if(el){
          el.textContent = 'Pause simulation'
        }
      }else{
        if(spawnResourceInterval){
          clearInterval(spawnResourceInterval)
        }
    
        if(moveInterval){
          clearInterval(moveInterval)
        }
    
        if(el){
          el.textContent = 'Unpause simulation'
        }
      }
    }
  }

  reloadWindow(){
    window.location.reload()
  }

  render(){
    if(this.state.map.length > 0){
      return (
        <div id="game" className="game position-relative">
          <div className='d-flex justify-content-between mb-4'>
            <Stats stats={this.state.redStats} team='red' maxPopulation={maxPopulationCap} />
            <div>
              <button id="pause" className='btn btn-primary mx-3 px-4 py-3' onClick={this.pauseSimulation}>Pause simulation</button>
              <button className='btn btn-danger mx-3 px-4 py-3' onClick={this.reloadWindow}>Restart simulation</button>
            </div>
            <Stats stats={this.state.greenStats} team='green' maxPopulation={maxPopulationCap} />
          </div>
          <div className='position-relative'>
            {this.showResources()}
            {this.showAnthills()}
            {this.showAnts()}
            <Board width={width} height={height} firstAnthillPositions={this.state.baseRed} secondAnthillPositions={this.state.baseGreen} resources={this.state.resources} />
          </div>
        </div>
      )
    }else{
      return (
        <div id="game" className="game position-relative"></div>
      )
    }
    
  }
}

export { Simulation }