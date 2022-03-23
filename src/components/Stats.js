var Stats = (props) => {
    return (
        <div className="card stat-card mx-4 p-4">
            <h3 className="text-center mb-3">Team {props.team}</h3>
            <p><b>Avg. attack: </b>{props.stats.averageStats.attack}/<b>{((255 * props.stats.workers) + (1023 * props.stats.warriors))/props.stats.population}</b></p>
            <p><b>Avg. health: </b>{props.stats.averageStats.health}/<b>{((1023 * props.stats.workers) + (1023 * props.stats.warriors))/props.stats.population}</b></p>
            <p><b>Avg. speed: </b>{props.stats.averageStats.speed}/<b>{((1023 * props.stats.workers) + (255 * props.stats.warriors))/props.stats.population}</b></p>
            <p><b>Workers: </b>{props.stats.workers}</p>
            <p><b>Warriors: </b>{props.stats.warriors}</p>
            <p><b>Population: </b>{props.stats.population}/<b>{props.maxPopulation}</b></p>
            <p><b>Generation: </b>{props.stats.generation}</p>
            <p><b>Resources: </b>{props.stats.resource}</p>
        </div>
    )
}
 export { Stats }