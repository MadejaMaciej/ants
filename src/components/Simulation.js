import { Component } from 'react'
import { Board } from './Board'
import { Ant } from './Ant'
import { Anthill } from './Anthill'
import { Resource } from './Resource'
import { Stats } from './Stats'

import { 
  randomNumber, 
  getRandomName, 
  getRandomItem, 
  getRandomItemBasedOnValue,
  getRandomItemAndIndex 
} from '../utils/random'
import { 
  convertToBinary,
  convertBinaryToInt
 } from '../utils/binary'

var width = 50, height = 50, that, health = 100
var startingResources = 20, resourcesSpawnTime = 20000 
var resourcesMaxQuantity = 20, resourcesMinQuantity = 1, spawnResourceInterval
var maxPopulationCap = 50, starting = 8
var geneticalExchangeCost = 30, mutationChance = 5
var lvlExperienceFirst = 1000, lvlExperienceModifier = 1.5, pickupExperience = 100, leaveExperience = 200
var killExperience = 500, lvlAdd = 20
var speedOfAnim = 500, moveInterval
var feromoneDissapearInterval = 3000, feromoneInterval

class Simulation extends Component {
  constructor(){
    super()
    this.state = {
      baseRed: {width: null, height: null, health: 100},
      baseGreen: {width: null, height: null, health: 100},
      resources: [],
      redStats: {
        population: maxPopulationCap,
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
        population: maxPopulationCap,
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

  mutateKid(genom){
    var newGenom = ''
    for(let i = 0; i < genom.length; i++){
      var val = randomNumber(0, 101)
      if(val <= mutationChance){
        if(genom[i] == '0'){
          newGenom += '1'
        }else{
          newGenom += '0'
        }
      }else{
        newGenom += genom[i]
      }
    }

    return newGenom
  }

  swap(point, genom1, genom2){
    var newGenom = ''
    for(let i = 0; i < genom1.length; i++){
      if(i < point){
        newGenom += genom1.charAt(i)
      }else{
        newGenom += genom2.charAt(i)
      }
    }

    return newGenom
  }

  createKid(cutPoint, attackGenoms, defenceGenoms, color){
    let nameRand = getRandomName()
    var attackBinary = [convertToBinary(attackGenoms[0], 10), convertToBinary(attackGenoms[1], 10)]
    var defenceBinary = [convertToBinary(defenceGenoms[0], 10), convertToBinary(defenceGenoms[1], 10)]
    var attack = that.swap(cutPoint, attackBinary[0], attackBinary[1])
    attack = that.mutateKid(attack)
    var defence = that.swap(cutPoint, defenceBinary[0], defenceBinary[1])
    defence = that.mutateKid(defence)
    attack = convertBinaryToInt(attack)
    defence = convertBinaryToInt(defence)

    var basePosition

    if(color){
      basePosition = that.state.baseRed
    }else{
      basePosition = that.state.baseGreen
    }

    var kid = {
      name: nameRand[0],
      surname: nameRand[1]+nameRand[2],
      class: 'Ant',
      health: defence,
      attack: attack,
      currentHealth: defence,
      lastPosition: basePosition,
      position: basePosition,
      nextPosition: that.chooseWhereToMove(basePosition, true),
      feromonToLeft: [],
      feromonFromLeft: [],
      level: 1,
      experience: 0,
      activity: 'Searching for resource or enemy',
      inFight: false,
      comingBack: false
    }

    return kid
  }

  generateKidsFromParents(parents, amount, color){
    var kids = []

    for(let i = 0; i < amount; i++){
      let cutPoint = randomNumber(1, 10)
      var kid = that.createKid(cutPoint, [parents[0].attack, parents[1].attack], [parents[0].health, parents[1].health], color)
      if(kid){
        kids.push(kid)
      }
    }

    return kids
  }

  makeNewGeneration(ants, color){
    var allAnts = []
    var newAnts = []
    for(let i = 0; i < ants.length; i++){
      newAnts.push(ants[i])
    }
    var pairs = Math.floor(ants.length/2)
    var modOne, modTwo

    if(ants.length <= 10){
      modOne = 60
      modTwo = 20
    }else if(ants.length <= 20){
      modOne = 50
      modTwo = 10
    }else if(ants.length <= 30){
      modOne = 40
      modTwo = 5
    }else if(ants.length <= 40){
      modOne = 40
      modTwo = 0
    }else{
      modOne = 30
      modTwo = 0
    }

    for(let i = 0; i < pairs; i++){
      var count = randomNumber(0, 101)
      var pair = []
      var ant1 = getRandomItemAndIndex(ants)
      ants.splice(ant1.index, 1)
      var ant2 = getRandomItemAndIndex(ants)
      ants.splice(ant2.index, 1)
      pair.push(ant1.item)
      pair.push(ant2.item)
      var kids = []
      if(count <= modOne){
        if(newAnts.length + 1 <= 50){
          kids = that.generateKidsFromParents(pair, 1, color)
        }
      }else if(count <= modOne + modTwo){
        if(newAnts.length + 2 <= 50){
          kids = that.generateKidsFromParents(pair, 2, color)
        }else if(newAnts.length + 1 <= 50){
          kids = that.generateKidsFromParents(pair, 1, color)
        }
      }

      newAnts = newAnts.concat(kids)
    }

    return { check: true, ants: newAnts }
  }

  geneticalExchange(team, ants){
    if(team){
      if(that.state.redStats.resource - geneticalExchangeCost >= 0 && that.state.redStats.currentPopulation < 50){
        that.setState({
          redStats: {
            population: that.state.redStats.population,
            currentPopulation: that.state.redStats.currentPopulation,
            averageStats: that.state.redStats.averageStats,
            generation: that.state.redStats.generation,
            resource: that.state.redStats.resource - geneticalExchangeCost,
            ants: ants
          }
        })
        return that.makeNewGeneration(ants, true)
      }else{
        return { check: false }
      }
    }else{
      if(that.state.greenStats.resource - geneticalExchangeCost >= 0 && that.state.greenStats.currentPopulation < 50){
        that.setState({
          greenStats: {
            population: that.state.greenStats.population,
            currentPopulation: that.state.greenStats.currentPopulation,
            averageStats: that.state.greenStats.averageStats,
            generation: that.state.greenStats.generation,
            resource: that.state.greenStats.resource - geneticalExchangeCost,
            ants: ants
          }
        })
        return that.makeNewGeneration(ants, false)
      }else{
        return { check: false }
      }
    }
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

  chooseWhereToMove(base, starting, isRed, to, lp){
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
          if(to){
            if(lp.width != base.width - 1 || lp.height != base.height){
              possibilities.push({ width: base.width - 1, height: base.height, value: that.state.map[base.width - 1][base.height].feromonsWorkerRed })
              for(let i = 0; i < that.state.resources.length; i++){
                if(that.state.resources[i].width == base.width - 1 && that.state.resources[i].height == base.height){
                  return { width: base.width - 1, height: base.height }
                }
              }
            }
          }else{
            if(lp.width != base.width - 1 || lp.height != base.height){
              possibilities.push({ width: base.width - 1, height: base.height, value: that.state.map[base.width - 1][base.height].feromonsWorkerBackRed })
              if(that.state.baseRed.width == base.width - 1 && that.state.baseRed.height == base.height){
                return { width: base.width - 1, height: base.height }
              }
            }
          }
        }else{
          if(to){
            if(lp.width != base.width - 1 || lp.height != base.height){
              possibilities.push({ width: base.width - 1, height: base.height, value: that.state.map[base.width - 1][base.height].feromonsWorkerGreen })
              for(let i = 0; i < that.state.resources.length; i++){
                if(that.state.resources[i].width == base.width - 1 && that.state.resources[i].height == base.height){
                  return { width: base.width - 1, height: base.height }
                }
              }
            }
          }else{
            if(lp.width != base.width - 1 || lp.height != base.height){
              possibilities.push({ width: base.width - 1, height: base.height, value: that.state.map[base.width - 1][base.height].feromonsWorkerBackGreen })
              if(that.state.baseGreen.width == base.width - 1 && that.state.baseGreen.height == base.height){
                return { width: base.width - 1, height: base.height }
              }
            }
          }
        }
      }
      
      if(base.width + 1 < width){
        if(isRed){
          if(to){
            if(lp.width != base.width + 1 || lp.height != base.height){
              possibilities.push({ width: base.width + 1, height: base.height, value: that.state.map[base.width + 1][base.height].feromonsWorkerRed })
              for(let i = 0; i < that.state.resources.length; i++){
                if(that.state.resources[i].width == base.width + 1 && that.state.resources[i].height == base.height){
                  return { width: base.width + 1, height: base.height }
                }
              }
            }
          }else{
            if(lp.width != base.width + 1 || lp.height != base.height){
              possibilities.push({ width: base.width + 1, height: base.height, value: that.state.map[base.width + 1][base.height].feromonsWorkerBackRed })
              if(that.state.baseRed.width == base.width + 1 && that.state.baseRed.height == base.height){
                return { width: base.width + 1, height: base.height }
              }
            }
          }
        }else{
          if(to){
            if(lp.width != base.width + 1 || lp.height != base.height){
              possibilities.push({ width: base.width + 1, height: base.height, value: that.state.map[base.width + 1][base.height].feromonsWorkerGreen })
              for(let i = 0; i < that.state.resources.length; i++){
                if(that.state.resources[i].width == base.width + 1 && that.state.resources[i].height == base.height){
                  return { width: base.width + 1, height: base.height }
                }
              }
            }
          }else{
            if(lp.width != base.width + 1 || lp.height != base.height){
              possibilities.push({ width: base.width + 1, height: base.height, value: that.state.map[base.width + 1][base.height].feromonsWorkerBackGreen })
              if(that.state.baseGreen.width == base.width + 1 && that.state.baseGreen.height == base.height){
                return { width: base.width + 1, height: base.height }
              }
            }
          }
        }
      }

      if(base.height - 1 >= 0){
        if(isRed){
          if(to){
            if(lp.width != base.width || lp.height != base.height -1){
              possibilities.push({ width: base.width, height: base.height - 1, value: that.state.map[base.width][base.height - 1].feromonsWorkerRed })
              for(let i = 0; i < that.state.resources.length; i++){
                if(that.state.resources[i].width == base.width && that.state.resources[i].height == base.height - 1){
                  return { width: base.width, height: base.height - 1 }
                }
              }
            }
          }else{
            if(lp.width != base.width || lp.height != base.height -1){
              possibilities.push({ width: base.width, height: base.height - 1, value: that.state.map[base.width][base.height - 1].feromonsWorkerBackRed })
              if(that.state.baseRed.width == base.width && that.state.baseRed.height == base.height - 1){
                return { width: base.width, height: base.height - 1 }
              }
            }
          }
        }else{
          if(to){
            if(lp.width != base.width || lp.height != base.height -1){
              possibilities.push({ width: base.width, height: base.height - 1, value: that.state.map[base.width][base.height - 1].feromonsWorkerGreen })
              for(let i = 0; i < that.state.resources.length; i++){
                if(that.state.resources[i].width == base.width && that.state.resources[i].height == base.height - 1){
                  return { width: base.width, height: base.height - 1 }
                }
              }
            }
          }else{
            if(lp.width != base.width || lp.height != base.height -1){
              possibilities.push({ width: base.width, height: base.height - 1, value: that.state.map[base.width][base.height - 1].feromonsWorkerBackGreen })
              if(that.state.baseGreen.width == base.width && that.state.baseGreen.height == base.height - 1){
                return { width: base.width, height: base.height - 1 }
              }
            }
          }
        }
      }

      if(base.height + 1 < height){
        if(isRed){
          if(to){
            if(lp.width != base.width || lp.height != base.height + 1){
              possibilities.push({ width: base.width, height: base.height + 1, value: that.state.map[base.width][base.height + 1].feromonsWorkerRed })
              for(let i = 0; i < that.state.resources.length; i++){
                if(that.state.resources[i].width == base.width && that.state.resources[i].height == base.height + 1){
                  return { width: base.width, height: base.height + 1 }
                }
              }
            }
          }else{
            if(lp.width != base.width || lp.height != base.height + 1){
              possibilities.push({ width: base.width, height: base.height + 1, value: that.state.map[base.width][base.height + 1].feromonsWorkerBackRed })
              if(that.state.baseRed.width == base.width && that.state.baseRed.height == base.height + 1){
                return { width: base.width, height: base.height + 1 }
              }
            }
          }
        }else{
          if(to){
            if(lp.width != base.width || lp.height != base.height + 1){
              possibilities.push({ width: base.width, height: base.height + 1, value: that.state.map[base.width][base.height + 1].feromonsWorkerGreen })
              for(let i = 0; i < that.state.resources.length; i++){
                if(that.state.resources[i].width == base.width && that.state.resources[i].height == base.height + 1){
                  return { width: base.width, height: base.height + 1 }
                }
              }
            }
          }else{
            if(lp.width != base.width || lp.height != base.height + 1){
              possibilities.push({ width: base.width, height: base.height + 1, value: that.state.map[base.width][base.height + 1].feromonsWorkerBackGreen })
              if(that.state.baseGreen.width == base.width && that.state.baseGreen.height == base.height + 1){
                return { width: base.width, height: base.height + 1 }
              }
            }
          }
        }
      }

      if(base.width - 1 >= 0 && base.height - 1 >= 0){
        if(isRed){
          if(to){
            if(lp.width != base.width - 1 || lp.height != base.height - 1){
              possibilities.push({ width: base.width - 1, height: base.height - 1, value: that.state.map[base.width - 1][base.height - 1].feromonsWorkerRed })
              for(let i = 0; i < that.state.resources.length; i++){
                if(that.state.resources[i].width == base.width - 1 && that.state.resources[i].height == base.height - 1){
                  return { width: base.width - 1, height: base.height - 1 }
                }
              }
            }
          }else{
            if(lp.width != base.width - 1 || lp.height != base.height - 1){
              possibilities.push({ width: base.width - 1, height: base.height - 1, value: that.state.map[base.width - 1][base.height - 1].feromonsWorkerBackRed })
              if(that.state.baseRed.width == base.width - 1 && that.state.baseRed.height == base.height - 1){
                return { width: base.width - 1, height: base.height - 1 }
              }
            }
          }
        }else{
          if(to){
            if(lp.width != base.width - 1 || lp.height != base.height - 1){
              possibilities.push({ width: base.width - 1, height: base.height - 1, value: that.state.map[base.width - 1][base.height - 1].feromonsWorkerGreen })
              for(let i = 0; i < that.state.resources.length; i++){
                if(that.state.resources[i].width == base.width - 1 && that.state.resources[i].height == base.height - 1){
                  return { width: base.width - 1, height: base.height - 1 }
                }
              }
            }
          }else{
            if(lp.width != base.width - 1 || lp.height != base.height - 1){
              possibilities.push({ width: base.width - 1, height: base.height - 1, value: that.state.map[base.width - 1][base.height - 1].feromonsWorkerBackGreen })
              if(that.state.baseGreen.width == base.width - 1 && that.state.baseGreen.height == base.height - 1){
                return { width: base.width - 1, height: base.height - 1 }
              }
            }
          }
        }
      }

      if(base.width + 1 < width && base.height - 1 >= 0){
        if(isRed){
          if(to){
            if(lp.width != base.width + 1 || lp.height != base.height - 1){
              possibilities.push({ width: base.width + 1, height: base.height - 1, value: that.state.map[base.width + 1][base.height - 1].feromonsWorkerRed })
              for(let i = 0; i < that.state.resources.length; i++){
                if(that.state.resources[i].width == base.width + 1 && that.state.resources[i].height == base.height - 1){
                  return { width: base.width + 1, height: base.height - 1 }
                }
              }
            }
          }else{
            if(lp.width != base.width + 1 || lp.height != base.height - 1){
              possibilities.push({ width: base.width + 1, height: base.height - 1, value: that.state.map[base.width + 1][base.height - 1].feromonsWorkerBackRed })
              if(that.state.baseRed.width == base.width + 1 && that.state.baseRed.height == base.height - 1){
                return { width: base.width + 1, height: base.height - 1 }
              }
            }
          }
        }else{
          if(to){
            if(lp.width != base.width + 1 || lp.height != base.height - 1){
              possibilities.push({ width: base.width + 1, height: base.height - 1, value: that.state.map[base.width + 1][base.height - 1].feromonsWorkerGreen })
              for(let i = 0; i < that.state.resources.length; i++){
                if(that.state.resources[i].width == base.width + 1 && that.state.resources[i].height == base.height - 1){
                  return { width: base.width + 1, height: base.height - 1 }
                }
              }
            }
          }else{
            if(lp.width != base.width + 1 || lp.height != base.height - 1){
              possibilities.push({ width: base.width + 1, height: base.height - 1, value: that.state.map[base.width + 1][base.height - 1].feromonsWorkerBackGreen })
              if(that.state.baseGreen.width == base.width + 1 && that.state.baseGreen.height == base.height - 1){
                return { width: base.width + 1, height: base.height - 1 }
              }
            }
          }
        }
      }

      if(base.width - 1 >= 0 && base.height + 1 < height){
        if(isRed){
          if(to){
            if(lp.width != base.width - 1 || lp.height != base.height + 1){
              possibilities.push({ width: base.width - 1, height: base.height + 1, value: that.state.map[base.width - 1][base.height + 1].feromonsWorkerRed })
              for(let i = 0; i < that.state.resources.length; i++){
                if(that.state.resources[i].width == base.width - 1 && that.state.resources[i].height == base.height + 1){
                  return { width: base.width - 1, height: base.height + 1 }
                }
              }
            }
          }else{
            if(lp.width != base.width - 1 || lp.height != base.height + 1){
              possibilities.push({ width: base.width - 1, height: base.height + 1, value: that.state.map[base.width - 1][base.height + 1].feromonsWorkerBackRed })
              if(that.state.baseRed.width == base.width - 1 && that.state.baseRed.height == base.height + 1){
                return { width: base.width - 1, height: base.height + 1 }
              }
            }
          }
        }else{
          if(to){
            if(lp.width != base.width - 1 || lp.height != base.height + 1){
              possibilities.push({ width: base.width - 1, height: base.height + 1, value: that.state.map[base.width - 1][base.height + 1].feromonsWorkerGreen })
              for(let i = 0; i < that.state.resources.length; i++){
                if(that.state.resources[i].width == base.width - 1 && that.state.resources[i].height == base.height + 1){
                  return { width: base.width - 1, height: base.height + 1 }
                }
              }
            }
          }else{
            if(lp.width != base.width - 1 || lp.height != base.height + 1){
              possibilities.push({ width: base.width - 1, height: base.height + 1, value: that.state.map[base.width - 1][base.height + 1].feromonsWorkerBackGreen })
              if(that.state.baseGreen.width == base.width - 1 && that.state.baseGreen.height == base.height + 1){
                return { width: base.width - 1, height: base.height + 1 }
              }
            }
          }
        }
      }

      if(base.width + 1 < width && base.height + 1 < height){
        if(isRed){
          if(to){
            if(lp.width != base.width + 1 || lp.height != base.height + 1){
              possibilities.push({ width: base.width + 1, height: base.height + 1, value: that.state.map[base.width + 1][base.height + 1].feromonsWorkerRed })
              for(let i = 0; i < that.state.resources.length; i++){
                if(that.state.resources[i].width == base.width + 1 && that.state.resources[i].height == base.height + 1){
                  return { width: base.width + 1, height: base.height + 1}
                }
              }
            }
          }else{
            if(lp.width != base.width + 1 || lp.height != base.height + 1){
              possibilities.push({ width: base.width + 1, height: base.height + 1, value: that.state.map[base.width + 1][base.height + 1].feromonsWorkerBackRed })
              if(that.state.baseRed.width == base.width + 1 && that.state.baseRed.height == base.height + 1){
                return { width: base.width + 1, height: base.height + 1 }
              }
            }
          }
        }else{
          if(to){
            if(lp.width != base.width + 1 || lp.height != base.height + 1){
              possibilities.push({ width: base.width + 1, height: base.height + 1, value: that.state.map[base.width + 1][base.height + 1].feromonsWorkerGreen })
              for(let i = 0; i < that.state.resources.length; i++){
                if(that.state.resources[i].width == base.width + 1 && that.state.resources[i].height == base.height + 1){
                  return { width: base.width + 1, height: base.height + 1}
                }
              }
            }
          }else{
            if(lp.width != base.width + 1 || lp.height != base.height + 1){
              possibilities.push({ width: base.width + 1, height: base.height + 1, value: that.state.map[base.width + 1][base.height + 1].feromonsWorkerBackGreen })
              if(that.state.baseGreen.width == base.width + 1 && that.state.baseGreen.height == base.height + 1){
                return { width: base.width + 1, height: base.height + 1}
              }
            }
          }
        }
      }
      
      return getRandomItemBasedOnValue(possibilities)
    }
  }

  takeResource(ant){
    if(!ant.comingBack){
      var resources = that.state.resources
      for(let i = 0; i < resources.length; i){
        var res = resources[i]
        if(res.width == ant.position.width && res.height == ant.position.height){
          if(res.quantity - 1 > 0){
            res.quantity -= 1
            resources[i] = res
            that.setState({
              resources: resources
            })
            return true
          }else {
            resources.splice(i, 1)
            that.setState({
              resources: resources
            })
            return true
          }
        }
        i++
      }
    }

    return false
  }

  leaveResource(ant, color){
    if(color){
      if(ant.position.width == that.state.baseRed.width && ant.position.height == that.state.baseRed.height){
        return true
      }
    }else{
      if(ant.position.width == that.state.baseGreen.width && ant.position.height == that.state.baseGreen.height){
        return true
      }
    }
    return false
  }

  upgradeAnt(ant){
    if(ant.health + lvlAdd <= 1023){
      ant.health += lvlAdd
    }else{
      ant.health = 1023
    }

    if(ant.attack + lvlAdd <= 1023){
      ant.attack += lvlAdd
    }else{
      ant.attack = 1023
    }

    return ant
  }

  moveAnts(){
    var redAnts = []
    var greenAnts = []
    var map = that.state.map
    var resourcesLevedRed = 0
    var resourcesLevedBlue = 0
    var cpr = that.state.redStats.currentPopulation
    var cpb = that.state.greenStats.currentPopulation
    var cgr = that.state.redStats.generation
    var cgb = that.state.greenStats.generation

    for(let i = 0; i < that.state.redStats.ants.length; i++){
      let ant = that.state.redStats.ants[i]
      ant.lastPosition = ant.position
      ant.position = ant.nextPosition
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
            el.feromonsWorkerRed += 10
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
            el.feromonsWorkerBackRed += 10
            ant.feromonToLeft.push({width: ant.position.width, height: ant.position.height})
            map[ant.position.width][ant.position.height] = el
          }
        }
      }
      if(!ant.comingBack){
        var takenResource = that.takeResource(ant)
        if(takenResource){
          ant.experience += pickupExperience
          if(ant.experience >= ant.level * lvlExperienceModifier * lvlExperienceFirst){
            ant.level += 1
            ant.experience = 0
            ant = that.upgradeAnt(ant)
          }
          ant.comingBack = true
          ant.feromonToLeft = []
          ant.activity = 'Coming back to anthill'
        }
      }

      if(ant.comingBack){
        var leaveResource = that.leaveResource(ant, true)
        if(leaveResource){
          ant.experience += leaveExperience
          if(ant.experience >= ant.level * lvlExperienceModifier * lvlExperienceFirst){
            ant.level += 1
            ant.experience = 0
            ant = that.upgradeAnt(ant)
          }
          ant.comingBack = false
          ant.feromonFromLeft = []
          resourcesLevedRed += 1
          ant.activity = 'Searching for resources or enemies'
          ant.currentHealth = ant.health
        }
      }

      ant.nextPosition = that.chooseWhereToMove(ant.position, false, true, !ant.comingBack, ant.lastPosition)
      redAnts.push(ant)
    }

    for(let i = 0; i < that.state.greenStats.ants.length; i++){
      let ant = that.state.greenStats.ants[i]
      ant.lastPosition = ant.position
      ant.position = ant.nextPosition
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
            el.feromonsWorkerGreen += 10
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
            el.feromonsWorkerBackGreen += 10
            ant.feromonToLeft.push({width: ant.position.width, height: ant.position.height})
            map[ant.position.width][ant.position.height] = el
          }
        }
      }

      if(!ant.comingBack){
        var takenResource = that.takeResource(ant)
        if(takenResource){
          ant.experience += pickupExperience
          if(ant.experience >= ant.level * lvlExperienceModifier * lvlExperienceFirst){
            ant.level += 1
            ant.experience = 0
            ant = that.upgradeAnt(ant)
          }
          ant.comingBack = true
          ant.feromonToLeft = []
          ant.activity = 'Coming back to anthill'
        }
      }

      if(ant.comingBack){
        var leaveResource = that.leaveResource(ant, false)
        if(leaveResource){
          ant.experience += leaveExperience
          if(ant.experience >= ant.level * lvlExperienceModifier * lvlExperienceFirst){
            ant.level += 1
            ant.experience = 0
            ant = that.upgradeAnt(ant)
          }
          ant.comingBack = false
          ant.feromonFromLeft = []
          resourcesLevedBlue += 1
          ant.activity = 'Searching for resources or enemies'
          ant.currentHealth = ant.health
        }
      }

      ant.nextPosition = that.chooseWhereToMove(ant.position, false, false, !ant.comingBack, ant.lastPosition)
      greenAnts.push(ant)
    }

    var redGen = randomNumber(0, 100)
    var redPop = { check: false }, bluePop = { check: false }
    if(redGen > 80){
      redPop = that.geneticalExchange(true, redAnts)
    }
    
    var blueGen = randomNumber(0, 100)
    if(blueGen > 80){
      bluePop = that.geneticalExchange(false, greenAnts)
    }

    if(redPop.check){
      redAnts = redPop.ants
      cpr = redAnts.length
      cgr += 1
    }

    if(bluePop.check){
      greenAnts = bluePop.ants
      cpb = greenAnts.length
      cgb += 1
    }

    that.setState({
      redStats: {
        population: that.state.redStats.population,
        currentPopulation: cpr,
        averageStats: that.getAverageStats(redAnts),
        generation: cgr,
        resource: that.state.redStats.resource + resourcesLevedRed,
        ants: redAnts
      },
      greenStats: {
        population: that.state.greenStats.population,
        currentPopulation: cpb,
        averageStats: that.getAverageStats(greenAnts),
        generation: cgb,
        resource: that.state.greenStats.resource + resourcesLevedBlue,
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
        lastPosition: basePosition,
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