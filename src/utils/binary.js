export function convertToBinary (number, numberOfBits) {
    let num = number
    let binary = (num % 2).toString()
    for (; num > 1; ) {
        num = parseInt(num / 2)
        binary =  (num % 2) + (binary)
    }

    while(binary.length < numberOfBits){
        binary += '0'
    }
    return binary
}

export function convertBinaryToInt(binary){
    return parseInt(binary, 2)
}