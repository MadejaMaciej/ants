import { nameData } from '../utils/nameData'

export function randomNumber(min, max) { 
    return Math.floor(Math.random() * (max - min) + min);
} 

export function getRandomName() {
    var n = []
    Object.keys(nameData).forEach(name => {
       n.push(getRandomItem(nameData[name]))
    })
    return n
}

export function getRandomItem(items) {
    return items[Math.floor(Math.random()*items.length)];
}