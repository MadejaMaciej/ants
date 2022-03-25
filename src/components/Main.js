import { useNavigate } from 'react-router-dom'

const Main = () => {
    let navigate = useNavigate()

    var redirect = (e, to) => {
        e.preventDefault()
        navigate(to, { replace: true })
    }

    return(
        <div id="main" className="main">
            <div className="d-sm-flex">
                <div className="w-100 p-4">
                    <h1 className="text-center">Watch anthil simulation <a href="/simulation" className="nav-link" onClick={(e) => redirect(e, '/simulation')}>here</a></h1>
                </div>
                {/* <div className="w-100 p-4">
                    <h1 className="text-center">Or try to govern your one <a href="/game" className="nav-link" onClick={(e) => redirect(e, '/game')}>here</a></h1>
                </div> */}
            </div>
        </div>
    )
}

export { Main }