const Board = (props) => {
    var resources = props.resources
    var jsx = ''
    
    for(var i = 0; i < props.width; i++){
        jsx += `<div class="d-flex row row-${i} w-100 ustify-content-around my-own-small">`
        for(var j = 0; j < props.height; j++){
            var notPlacedAnthill = true
            var notPlacedResource = true

            if( props.firstAnthillPositions.width == j &&  props.firstAnthillPositions.height == i){
                jsx += `<div class="field field-${i}-${j} m-auto anthill props-red" data-field="field-${i}-${j}"></div>`
                notPlacedAnthill = false
            }

            if(props.secondAnthillPositions.width == j && props.secondAnthillPositions.height == i){
                jsx += `<div class="field field-${i}-${j} m-auto anthill props-green" data-field="field-${i}-${j}"></div>`
                notPlacedAnthill = false
            }

            for(var k = 0; k < resources.length; k++){
                if(resources[k].width == j && resources[k].height == i){
                    jsx += `<div class="field field-${i}-${j} m-auto resource" data-field="field-${i}-${j}"></div>`
                    notPlacedResource = false
                }
            }

            if(notPlacedAnthill && notPlacedResource){
                jsx += `<div class="field field-${i}-${j} m-auto" data-field="field-${i}-${j}"></div>`
            }
        }
        jsx += `</div>`
    }

    return(
        <div id="board" className="board text-center w-100" dangerouslySetInnerHTML={{ __html: jsx }} />
    )
}

export { Board }