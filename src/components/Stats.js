var Stats = (props) => {
    return (
        <div className="card stat-card mx-4 p-4">
            <h3 className="text-center mb-3">Team {props.team}</h3>
            <p><b>Avg. attack: </b>{props.stats.averageStats.attack}/<b>{1023}</b></p>
            <p><b>Avg. health: </b>{props.stats.averageStats.health}/<b>{1023}</b></p>
            <p><b>Population: </b>{props.stats.ants.length}/<b>{props.maxPopulation}</b></p>
            <p><b>Generation: </b>{props.stats.generation}</p>
            <p><b>Resources: </b>{props.stats.resource}</p>
        </div>
    )
}
 export { Stats }