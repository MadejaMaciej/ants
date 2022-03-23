var changeModalVisibility = (e) => {
    e.stopPropagation()
    var els = document.getElementsByClassName('ant-card')

    for(let i = 0; i < els.length; i++){
      els[i].classList.add('d-none')
    }

    if(e.target.firstChild){
        e.target.firstChild.classList.remove('d-none')
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
    return(
        <div className={props.classes} onClick={changeModalVisibility}>
            <div className="d-none card ant-card p-4 ms-3 not-clickable" onClick={hideModal}>
                <p className="text-end"><b className="clickable">X</b></p>
                <h3 className="text-center">{props.ant.class} {props.color} Ant</h3>
                <p><b>Name:</b> {props.ant.name}</p>
                <p><b>Surname:</b> {props.ant.surname}</p>
                <p><b>Health:</b> {props.ant.currentHealth}/<b>{props.ant.health}</b></p>
                <p><b>Attack:</b> {props.ant.attack}</p>
                <p><b>Speed:</b> {props.ant.speed}</p>
                <p><b>Activity:</b> {props.ant.activity}</p>
                <p><b>Level:</b> {props.ant.level}</p>
                <p><b>Experience:</b> {props.ant.experience}</p>
            </div>
        </div>
    )
}

export { Ant }