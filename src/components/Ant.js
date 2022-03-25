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

var Ant = (props) => {
    var firstRowHeight = 11
    var heightJump = 25
    
    if(window.innerWidth <= 1100){
        firstRowHeight = 6
        heightJump = 15
    }

    var firstRowJump = 2.54
    var firstRowWidth = (window.innerWidth/props.width)/firstRowJump
    var widthJump = 38 * (window.innerWidth/1920)

    return(
        <div className={props.classes} onClick={changeModalVisibility} style={{ left: (firstRowWidth + (props.ant.position.width * widthJump)) + 'px', top: (firstRowHeight + (props.ant.position.height * heightJump)) + 'px' }}>
            <div className="d-none card ant-card p-4 ms-3 not-clickable position-absolute" onClick={hideModal}>
                <p className="text-end"><b className="clickable">X</b></p>
                <h3 className="text-center">{props.ant.class} {props.color}</h3>
                <p><b>Name:</b> {props.ant.name}</p>
                <p><b>Surname:</b> {props.ant.surname}</p>
                <p><b>Health:</b> {props.ant.currentHealth}/<b>{props.ant.health}</b></p>
                <p><b>Attack:</b> {props.ant.attack}</p>
                <p><b>Activity:</b> {(props.ant.inFight)?'Fighting':props.ant.activity}</p>
                <p><b>Level:</b> {props.ant.level}</p>
                <p><b>Experience:</b> {props.ant.experience}</p>
            </div>
        </div>
    )
}

export { Ant }