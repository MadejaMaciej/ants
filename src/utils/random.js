import { nameData } from '../utils/nameData'

export function randomNumber(min, max) { 
    return Math.floor(Math.random() * (max - min) + min)
} 

export function getRandomName() {
    var n = []
    Object.keys(nameData).forEach(name => {
       n.push(getRandomItem(nameData[name]))
    })
    return n
}

export function getRandomItemAndIndex(items) {
    var i = Math.floor(Math.random()*items.length)
    return { item: items[i], index: i }
}

export function getRandomItem(items) {
    return items[Math.floor(Math.random()*items.length)]
}

export function getRandomItemBasedOnValue(items, min = 1) {
    var max = 0
    
    for(let i = 0; i < items.length; i++){
        max += items[i].value
    }

    var num = Math.floor(Math.random() * (max - min) + min)
    var val = 0

    for(let i = 0; i < items.length; i++){
        val += items[i].value
        if(num <= val){
            return items[i]
        }
    }

    return items[items.length - 1]
}