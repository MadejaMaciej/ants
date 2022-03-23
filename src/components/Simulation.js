import { Component } from 'react'
import { Board } from './Board'
import { Ant } from './Ant'
import { Stats } from './Stats'

import { randomNumber, getRandomName, getRandomItem, getRandomItemBasedOnValue } from '../utils/random'

var width = 50, height = 50, that, health = 100
var startingResources = 20, resourcesSpawnTime = 20000, resourcesMaxQuantity = 20, resourcesMinQuantity = 1, spawnResourceInterval
var maxPopulationCap = 50, startingWarriors = 5, startingWorkers = 15
var geneticalExchangeCost = 30, warriorCost = 15, workerCost = 10, lvlExperienceFirst = 1000, lvlExperienceModifier = 3
var antSeeRange = 1

class Simulation extends Component {
  constructor(){
    super()
    this.state = {
      baseRed: {width: null, height: null, health: 100},
      baseGreen: {width: null, height: null, health: 100},
      resources: [],
      redStats: {
        population: startingWarriors + startingWorkers,
        workers: startingWorkers,
        warriors: startingWarriors,
        ants: [],
        resource: startingResources,
        averageStats: {
          health: 0,
          attack: 0,
          speed: 0
        },
        generation: 1
      },
      greenStats: {
        population: startingWarriors + startingWorkers,
        workers: startingWorkers,
        warriors: startingWarriors,
        ants: [],
        resource: startingResources,
        averageStats: {
          health: 0,
          attack: 0,
          speed: 0
        },
        generation: 1
      },
      map : []
    }
    that = this
  }

  buyAnt(type){

  }

  geneticalExchange(){

  }

  showAnts(){
    var toRender = []

    for(let i = 0; i < that.state.redStats.ants.length; i++){
      var key = `red-${i}`
      toRender.push(<Ant color='red' classes='ant red-ant position-absolute clickable' ant={that.state.redStats.ants[i]} key={key} />)
    }
    
    for(let i = 0; i < that.state.greenStats.ants.length; i++){
      var key = `green-${i}`
      toRender.push(<Ant color='green' classes='ant green-ant position-absolute clickable' ant={that.state.greenStats.ants[i]} key={key} />)
    }

    return toRender
  }

  chooseWhereToMove(base, starting, isRed, worker, to){
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
      if(base.width - 1 > 0){
        if(isRed){
          if(worker){
            if(to){
              possibilities.push({ width: base.width - 1, height: base.height, value: that.state.map[base.width - 1][base.height].feromonsWorkerRed })
            }else{
              possibilities.push({ width: base.width - 1, height: base.height, value: that.state.map[base.width - 1][base.height].feromonsWorkerBackRed })
            }
          }else{
            if(to){
              possibilities.push({ width: base.width - 1, height: base.height, value: that.state.map[base.width - 1][base.height].feromonsWarriorRed })
            }else{
              possibilities.push({ width: base.width - 1, height: base.height, value: that.state.map[base.width - 1][base.height].feromonsWarriorBackRed })
            }
          }
        }else{
          if(worker){
            if(to){
              possibilities.push({ width: base.width - 1, height: base.height, value: that.state.map[base.width - 1][base.height].feromonsWorkerGreen })
            }else{
              possibilities.push({ width: base.width - 1, height: base.height, value: that.state.map[base.width - 1][base.height].feromonsWorkerBackGreen })
            }
          }else{
            if(to){
              possibilities.push({ width: base.width - 1, height: base.height, value: that.state.map[base.width - 1][base.height].feromonsWarriorGreen })
            }else{
              possibilities.push({ width: base.width - 1, height: base.height, value: that.state.map[base.width - 1][base.height].feromonsWarriorBackGreen })
            }
          }
        }
      }
      
      if(base.width + 1 < width){
        if(isRed){
          if(worker){
            if(to){
              possibilities.push({ width: base.width + 1, height: base.height, value: that.state.map[base.width + 1][base.height].feromonsWorkerRed })
            }else{
              possibilities.push({ width: base.width + 1, height: base.height, value: that.state.map[base.width + 1][base.height].feromonsWorkerBackRed })
            }
          }else{
            if(to){
              possibilities.push({ width: base.width + 1, height: base.height, value: that.state.map[base.width + 1][base.height].feromonsWarriorRed })
            }else{
              possibilities.push({ width: base.width + 1, height: base.height, value: that.state.map[base.width + 1][base.height].feromonsWarriorBackRed })
            }
          }
        }else{
          if(worker){
            if(to){
              possibilities.push({ width: base.width + 1, height: base.height, value: that.state.map[base.width + 1][base.height].feromonsWorkerGreen })
            }else{
              possibilities.push({ width: base.width + 1, height: base.height, value: that.state.map[base.width + 1][base.height].feromonsWorkerBackGreen })
            }
          }else{
            if(to){
              possibilities.push({ width: base.width + 1, height: base.height, value: that.state.map[base.width + 1][base.height].feromonsWarriorGreen })
            }else{
              possibilities.push({ width: base.width + 1, height: base.height, value: that.state.map[base.width + 1][base.height].feromonsWarriorBackGreen })
            }
          }
        }
      }

      if(base.height - 1 >= 0){
        if(isRed){
          if(worker){
            if(to){
              possibilities.push({ width: base.width, height: base.height - 1, value: that.state.map[base.width][base.height - 1].feromonsWorkerRed })
            }else{
              possibilities.push({ width: base.width, height: base.height - 1, value: that.state.map[base.width][base.height - 1].feromonsWorkerBackRed })
            }
          }else{
            if(to){
              possibilities.push({ width: base.width, height: base.height - 1, value: that.state.map[base.width][base.height - 1].feromonsWarriorRed })
            }else{
              possibilities.push({ width: base.width, height: base.height - 1, value: that.state.map[base.width][base.height - 1].feromonsWarriorBackRed })
            }
          }
        }else{
          if(worker){
            if(to){
              possibilities.push({ width: base.width, height: base.height - 1, value: that.state.map[base.width][base.height - 1].feromonsWorkerGreen })
            }else{
              possibilities.push({ width: base.width, height: base.height - 1, value: that.state.map[base.width][base.height - 1].feromonsWorkerBackGreen })
            }
          }else{
            if(to){
              possibilities.push({ width: base.width, height: base.height - 1, value: that.state.map[base.width][base.height - 1].feromonsWarriorGreen })
            }else{
              possibilities.push({ width: base.width, height: base.height - 1, value: that.state.map[base.width][base.height - 1].feromonsWarriorBackGreen })
            }
          }
        }
      }

      if(base.height + 1 < height){
        if(isRed){
          if(worker){
            if(to){
              possibilities.push({ width: base.width, height: base.height + 1, value: that.state.map[base.width][base.height + 1].feromonsWorkerRed })
            }else{
              possibilities.push({ width: base.width, height: base.height + 1, value: that.state.map[base.width][base.height + 1].feromonsWorkerBackRed })
            }
          }else{
            if(to){
              possibilities.push({ width: base.width, height: base.height + 1, value: that.state.map[base.width][base.height + 1].feromonsWarriorRed })
            }else{
              possibilities.push({ width: base.width, height: base.height + 1, value: that.state.map[base.width][base.height + 1].feromonsWarriorBackRed })
            }
          }
        }else{
          if(worker){
            if(to){
              possibilities.push({ width: base.width, height: base.height + 1, value: that.state.map[base.width][base.height + 1].feromonsWorkerGreen })
            }else{
              possibilities.push({ width: base.width, height: base.height + 1, value: that.state.map[base.width][base.height + 1].feromonsWorkerBackGreen })
            }
          }else{
            if(to){
              possibilities.push({ width: base.width, height: base.height + 1, value: that.state.map[base.width][base.height + 1].feromonsWarriorGreen })
            }else{
              possibilities.push({ width: base.width, height: base.height + 1, value: that.state.map[base.width][base.height + 1].feromonsWarriorBackGreen })
            }
          }
        }
      }

      if(base.width - 1 >= 0 && base.height - 1 >= 0){
        if(isRed){
          if(worker){
            if(to){
              possibilities.push({ width: base.width - 1, height: base.height - 1, value: that.state.map[base.width - 1][base.height - 1].feromonsWorkerRed })
            }else{
              possibilities.push({ width: base.width - 1, height: base.height - 1, value: that.state.map[base.width - 1][base.height - 1].feromonsWorkerBackRed })
            }
          }else{
            if(to){
              possibilities.push({ width: base.width - 1, height: base.height - 1, value: that.state.map[base.width - 1][base.height - 1].feromonsWarriorRed })
            }else{
              possibilities.push({ width: base.width - 1, height: base.height - 1, value: that.state.map[base.width - 1][base.height - 1].feromonsWarriorBackRed })
            }
          }
        }else{
          if(worker){
            if(to){
              possibilities.push({ width: base.width - 1, height: base.height - 1, value: that.state.map[base.width - 1][base.height - 1].feromonsWorkerGreen })
            }else{
              possibilities.push({ width: base.width - 1, height: base.height - 1, value: that.state.map[base.width - 1][base.height - 1].feromonsWorkerBackGreen })
            }
          }else{
            if(to){
              possibilities.push({ width: base.width - 1, height: base.height - 1, value: that.state.map[base.width - 1][base.height - 1].feromonsWarriorGreen })
            }else{
              possibilities.push({ width: base.width - 1, height: base.height - 1, value: that.state.map[base.width - 1][base.height - 1].feromonsWarriorBackGreen })
            }
          }
        }
      }

      if(base.width + 1 < width && base.height - 1 >= 0){
        if(isRed){
          if(worker){
            if(to){
              possibilities.push({ width: base.width + 1, height: base.height - 1, value: that.state.map[base.width + 1][base.height - 1].feromonsWorkerRed })
            }else{
              possibilities.push({ width: base.width + 1, height: base.height - 1, value: that.state.map[base.width + 1][base.height - 1].feromonsWorkerBackRed })
            }
          }else{
            if(to){
              possibilities.push({ width: base.width + 1, height: base.height - 1, value: that.state.map[base.width + 1][base.height - 1].feromonsWarriorRed })
            }else{
              possibilities.push({ width: base.width + 1, height: base.height - 1, value: that.state.map[base.width + 1][base.height - 1].feromonsWarriorBackRed })
            }
          }
        }else{
          if(worker){
            if(to){
              possibilities.push({ width: base.width + 1, height: base.height - 1, value: that.state.map[base.width + 1][base.height - 1].feromonsWorkerGreen })
            }else{
              possibilities.push({ width: base.width + 1, height: base.height - 1, value: that.state.map[base.width + 1][base.height - 1].feromonsWorkerBackGreen })
            }
          }else{
            if(to){
              possibilities.push({ width: base.width + 1, height: base.height - 1, value: that.state.map[base.width + 1][base.height - 1].feromonsWarriorGreen })
            }else{
              possibilities.push({ width: base.width + 1, height: base.height - 1, value: that.state.map[base.width + 1][base.height - 1].feromonsWarriorBackGreen })
            }
          }
        }
      }
      if(base.width - 1 >= 0 && base.height + 1 < height){
        if(isRed){
          if(worker){
            if(to){
              possibilities.push({ width: base.width - 1, height: base.height + 1, value: that.state.map[base.width - 1][base.height + 1].feromonsWorkerRed })
            }else{
              possibilities.push({ width: base.width - 1, height: base.height + 1, value: that.state.map[base.width - 1][base.height + 1].feromonsWorkerBackRed })
            }
          }else{
            if(to){
              possibilities.push({ width: base.width - 1, height: base.height + 1, value: that.state.map[base.width - 1][base.height + 1].feromonsWarriorRed })
            }else{
              possibilities.push({ width: base.width - 1, height: base.height + 1, value: that.state.map[base.width - 1][base.height + 1].feromonsWarriorBackRed })
            }
          }
        }else{
          if(worker){
            if(to){
              possibilities.push({ width: base.width - 1, height: base.height + 1, value: that.state.map[base.width - 1][base.height + 1].feromonsWorkerGreen })
            }else{
              possibilities.push({ width: base.width - 1, height: base.height + 1, value: that.state.map[base.width - 1][base.height + 1].feromonsWorkerBackGreen })
            }
          }else{
            if(to){
              possibilities.push({ width: base.width - 1, height: base.height + 1, value: that.state.map[base.width - 1][base.height + 1].feromonsWarriorGreen })
            }else{
              possibilities.push({ width: base.width - 1, height: base.height + 1, value: that.state.map[base.width - 1][base.height + 1].feromonsWarriorBackGreen })
            }
          }
        }
      }

      if(base.width + 1 < width && base.height + 1 < height){
        if(isRed){
          if(worker){
            if(to){
              possibilities.push({ width: base.width + 1, height: base.height + 1, value: that.state.map[base.width + 1][base.height + 1].feromonsWorkerRed })
            }else{
              possibilities.push({ width: base.width + 1, height: base.height + 1, value: that.state.map[base.width + 1][base.height + 1].feromonsWorkerBackRed })
            }
          }else{
            if(to){
              possibilities.push({ width: base.width + 1, height: base.height + 1, value: that.state.map[base.width + 1][base.height + 1].feromonsWarriorRed })
            }else{
              possibilities.push({ width: base.width + 1, height: base.height + 1, value: that.state.map[base.width + 1][base.height + 1].feromonsWarriorBackRed })
            }
          }
        }else{
          if(worker){
            if(to){
              possibilities.push({ width: base.width + 1, height: base.height + 1, value: that.state.map[base.width + 1][base.height + 1].feromonsWorkerGreen })
            }else{
              possibilities.push({ width: base.width + 1, height: base.height + 1, value: that.state.map[base.width + 1][base.height + 1].feromonsWorkerBackGreen })
            }
          }else{
            if(to){
              possibilities.push({ width: base.width + 1, height: base.height + 1, value: that.state.map[base.width + 1][base.height + 1].feromonsWarriorGreen })
            }else{
              possibilities.push({ width: base.width + 1, height: base.height + 1, value: that.state.map[base.width + 1][base.height + 1].feromonsWarriorBackGreen })
            }
          }
        }
      }
      
      return getRandomItemBasedOnValue(possibilities)
    }

  }

  generateAnts(quantityWarriors, quantityWorkers, basePosition){
    var ants = []
    
    for(let i = 0; i < quantityWarriors; i++){
      let nameRand = getRandomName()
      let health = randomNumber(0, 1023)
      ants.push({
        name: nameRand[0],
        surname: nameRand[1]+nameRand[2],
        class: 'Warrior',
        health: health,
        speed: randomNumber(0, 255),
        attack: randomNumber(0, 1023),
        currentHealth: health,
        position: basePosition,
        nextPosition: that.chooseWhereToMove(basePosition, true),
        feromonToLeft: [],
        feromonFromLeft: [],
        level: 1,
        experience: 0,
        activity: 'Searching for enemy'
      })
    }

    for(let i = 0; i < quantityWorkers; i++){
      let nameRand = getRandomName()
      let health = randomNumber(0, 1023)
      ants.push({
        name: nameRand[0],
        surname: nameRand[1]+nameRand[2],
        class: 'Worker',
        health: health,
        speed: randomNumber(0, 1023),
        attack: randomNumber(0, 255),
        currentHealth: health,
        position: basePosition,
        nextPosition: that.chooseWhereToMove(basePosition, true),
        feromonToLeft: [],
        feromonFromLeft: [],
        level: 1,
        experience: 0,
        activity: 'Searching for resources'
      })
    }

    return ants
  }

  getAverageStats(ants){
    var avgSpeed = 0
    var avgAttack = 0
    var avgHealth = 0
    
    for(var i = 0; i < ants.length; i++){
      avgSpeed += ants[i].speed
      avgAttack += ants[i].attack
      avgHealth += ants[i].health
    }

    avgSpeed = Math.floor(avgSpeed/ants.length)
    avgAttack = Math.floor(avgAttack/ants.length)
    avgHealth = Math.floor(avgHealth/ants.length)

   return { health: avgHealth, attack: avgAttack, speed: avgSpeed }
  }

  spawnResources(resourcesToSpawn, baseRed, baseGreen){
    var resource = []
    for(var i = 0; i < resourcesToSpawn; i++){
      do{
        var onBase = false
        var w = randomNumber(0, width - 1)
        var h = randomNumber(0, height - 1)
        var q = randomNumber(resourcesMinQuantity, resourcesMaxQuantity)
        if(baseRed.width == w && baseRed.height == h){
          onBase = true
        }

        if(baseGreen.width == w && baseGreen.height == h){
          onBase = true
        }

        if(!onBase){
          resource.push({ width: w, height: h, quantity: q })
        }
      }while(onBase)
    }

    return resource
  }

  componentDidMount(){
    var w1 = randomNumber(0, width/5)
    var h1 = randomNumber(0, height - 1)
    var w2 = randomNumber(width - 1 - (width/5), width - 1)
    var h2 = randomNumber(0, height - 1)

    var combinedResource = that.spawnResources(startingResources, {width: w1, height: h1}, {width: w2, height: h2})

    spawnResourceInterval = setInterval(() => {
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

    var redAnts = that.generateAnts(startingWarriors, startingWorkers, {width: w1, height: h1})
    var blueAnts = that.generateAnts(startingWarriors, startingWorkers, {width: w2, height: h2})
    var m = []

    for(var i = 0; i < width; i++){
      m.push([])
      for(var j = 0; j < height; j++){
        m[i].push({
          field: i+'-'+j,
          feromonsWorkerRed: 1,
          feromonsWorkerGreen: 1,
          feromonsWorkerBackRed: 1,
          feromonsWorkerBackGreen: 1,
          feromonsWarriorRed: 1,
          feromonsWarriorGreen: 1,
          feromonsWarriorBackRed: 1,
          feromonsWarriorBackGreen: 1,
          value: 1
        })
      }
    }
    
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
        population: startingWarriors + startingWorkers,
        workers: startingWorkers,
        warriors: startingWarriors,
        ants: redAnts,
        averageStats: that.getAverageStats(redAnts),
        generation: 1,
        resource: startingResources
      },
      greenStats: {
        population: startingWarriors + startingWorkers,
        workers: startingWorkers,
        warriors: startingWarriors,
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
  }

  render(){
    return (
      <div id="game" className="game position-relative">
        <div className='d-flex justify-content-between mb-4'>
          <Stats stats={this.state.redStats} team='red' maxPopulation={maxPopulationCap} />
          <Stats stats={this.state.greenStats} team='green' maxPopulation={maxPopulationCap} />
        </div>
        {this.showAnts()}
        <Board width={width} height={height} firstAnthillPositions={this.state.baseRed} secondAnthillPositions={this.state.baseGreen} resources={this.state.resources} />
      </div>
    )
  }
}

export { Simulation }