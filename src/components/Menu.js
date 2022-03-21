import { useNavigate } from 'react-router-dom'

const Menu = () => {
    let navigate = useNavigate()

    var redirect = (e, to) => {
        e.preventDefault()
        navigate(to, { replace: true })
    }

    return(
        <header className='mb-sm-5 small-padding-mobile'>
            <nav className="navbar navbar-expand p-sm-5">
                <div className="container-fluid">
                    <a href="/" className="position-relative" onClick={(e) => redirect(e, '/')}>
                        <img src="/img/logo.png" className="logo" alt="logo" />
                    </a>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mr-fix mb-2 mb-xl-0">
                            <li className="nav-item mx-3">
                                <a href="/simulation" className="nav-link" aria-current="page" onClick={(e) => redirect(e, '/simulation')}>Simulation</a>
                            </li>
                            <li className="nav-item mx-3">
                                <a href="/game" className="nav-link" aria-current="page" onClick={(e) => redirect(e, '/game')}>Game</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export { Menu }