const Board = (props) => {
    var firstPlaces = props.firstAnthillPositions
    var secondPlaces =  props.secondAnthillPositions

    var jsx = ''
    for(var i = 0; i < props.width; i++){
        jsx += `<div class="d-flex row row-${i} w-100 ustify-content-around">`
        for(var j = 0; j < props.height; j++){
            var notPlacedAnthill = true
            for(var k = 0; k < firstPlaces.length; k++){
                if(firstPlaces[k].width == j && firstPlaces[k].height == i){
                    jsx += `<div class="field field-${i}-${j} m-auto my-2 anthill props-red" data-field="field-${i}-${j}"></div>`
                    notPlacedAnthill = false
                }
            }

            for(var k = 0; k < firstPlaces.length; k++){
                if(secondPlaces[k].width == j && secondPlaces[k].height == i){
                    jsx += `<div class="field field-${i}-${j} m-auto my-2 anthill props-green" data-field="field-${i}-${j}"></div>`
                    notPlacedAnthill = false
                }
            }

            if(notPlacedAnthill){
                jsx += `<div class="field field-${i}-${j} m-auto my-2" data-field="field-${i}-${j}"></div>`
            }
            
        }
        jsx += `</div>`
    }

    return(
        <div id="board" className="board text-center w-100" dangerouslySetInnerHTML={{ __html: jsx }} />
    )
}

export { Board }