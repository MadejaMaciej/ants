var changeModalVisibility = (e) => {
    e.stopPropagation()
    var els = document.getElementsByClassName('ant-card')

    for(let i = 0; i < els.length; i++){
      els[i].classList.add('d-none')
    }

    if(e.target.style.left.split('px')[0]/1 + 450 > window.innerWidth){
        if(e.target.firstChild){
            e.target.firstChild.classList.add('to-left')
            e.target.firstChild.classList.remove('d-none')
        }
    }else{
        if(e.target.firstChild){
            e.target.firstChild.classList.remove('to-left')
            e.target.firstChild.classList.remove('d-none')
        }
    }
}

var hideModal = (e) => {
    e.stopPropagation()
    var els = document.getElementsByClassName('ant-card')

    for(let i = 0; i < els.length; i++){
      els[i].classList.add('d-none')
    }
}

var Resource = (props) => {
    var firstRowHeight = 6
    var heightJump = 25
    
    if(window.innerWidth <= 1100){
        heightJump = 15
    }

    var firstRowJump = 3.4
    var firstRowWidth = (window.innerWidth/props.width)/firstRowJump
    var widthJump = 38 * (window.innerWidth/1920)

    return(
        <div className={props.classes} onClick={changeModalVisibility} style={{ left: (firstRowWidth + (props.resource.width * widthJump)) + 'px', top: (firstRowHeight + (props.resource.height * heightJump)) + 'px' }}>
            <div className="d-none card ant-card p-4 ms-3 not-clickable position-absolute" onClick={hideModal}>
                <p className="text-end"><b className="clickable">X</b></p>
                <h3 className="text-center">Resource</h3>
                <p><b>Quantity:</b> {props.resource.quantity}</p>
            </div>
        </div>
    )
}

export { Resource }