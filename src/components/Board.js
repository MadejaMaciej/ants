const Board = (props) => {
    var jsx = ''
    
    for(var i = 0; i < props.width; i++){
        jsx += `<div class="d-flex row row-${i} w-100 ustify-content-around my-own-small">`
        for(var j = 0; j < props.height; j++){
            jsx += `<div class="field field-${i}-${j} m-auto" data-field="field-${i}-${j}"></div>`
        }
        jsx += `</div>`
    }
    
    return(
        <div id="board" className="board text-center w-100" dangerouslySetInnerHTML={{ __html: jsx }} />
    )
}

export { Board }