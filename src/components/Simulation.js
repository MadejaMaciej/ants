import { Component } from 'react'
import { Board } from './Board'

import { randomNumber, getRandomName } from '../utils/random'

var width = 50, height = 50, that, health = 100
var startingResources = 20, resourcesSpawnTime = 20000, resourcesMaxQuantity = 20, resourcesMinQuantity = 1
var maxPopulationCap = 50, startingWarriors = 5, startingWorkers = 15, startingResources = 20
var geneticalExchangeCost = 30, warriorCost = 15, workerCost = 10, lvlExperienceFirst = 1000, lvlExperienceModify = 3
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

  generateAnts(quantityWarriors, quantityWorkers, basePosition){
    var ants = []
    
    for(var i = 0; i < quantityWarriors; i++){
      var nameRand = getRandomName()
      var health = randomNumber(0, 1023)
      ants.push({
        name: nameRand[0],
        surname: nameRand[1]+nameRand[2],
        class: 'Warrior',
        health: health,
        speed: randomNumber(0, 255),
        attack: randomNumber(0, 1023),
        currentHealth: health,
        position: basePosition,
        level: 1,
        experience: 0
      })
    }

    for(var i = 0; i < quantityWorkers; i++){
      var nameRand = getRandomName()
      var health = randomNumber(0, 1023)
      ants.push({
        name: nameRand[0],
        surname: nameRand[1]+nameRand[2],
        class: 'Worker',
        health: health,
        speed: randomNumber(0, 1023),
        attack: randomNumber(0, 255),
        currentHealth: health,
        position: basePosition,
        level: 1,
        experience: 0
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

    var redAnts = that.generateAnts(startingWarriors, startingWorkers, {width: w1, height: h1})
    var blueAnts = that.generateAnts(startingWarriors, startingWorkers, {width: w2, height: h2})
    var m = []

    for(var i = 0; i < width; i++){
      for(var j = 0; j < height; j++){
        m.push({
          field: i+'-'+j,
          feromonsWorkerRed: 0,
          feromonsWorkerGreen: 0,
          feromonsWorkerBackRed: 0,
          feromonsWorkerBackGreen: 0,
          feromonsWarriorRed: 0,
          feromonsWarriorGreen: 0,
          feromonsWarriorBackRed: 0,
          feromonsWarriorBackGreen: 0
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

  render(){
    return (
      <div id="game" className="game">
        <Board width={width} height={height} firstAnthillPositions={that.state.baseRed} secondAnthillPositions={that.state.baseGreen} resources={that.state.resources} />
      </div>
    )
  }
}

export { Simulation }