import { useNavigate } from 'react-router-dom'

const Footer = (props) => {
    let navigate = useNavigate()

    var redirect = (e, to) => {
        e.preventDefault()
        navigate(to, { replace: true })
    }

    return(
        <footer className='p-sm-3 position-absolute on-top small-padding-mobile'>
            <div id="footer" className="footer text-center">
                <a href="/" className="position-relative me-4 d-none-mobile" onClick={(e) => redirect(e, '/')}>
                    <img src="/img/logo.png" className="logo" alt="logo" />
                </a>
                Created by <a href="https://github.com/MadejaMaciej" className="my-own-link" rel="noreferrer" target="_blank"><b>{props.name}</b></a> in <b>{props.year}</b>. Some icons by <a href='https://www.freepik.com/vectors/ant-logo' className="my-own-link"><b>brgfx</b></a> from <a href='https://www.freepik.com' className="my-own-link"><b>freepik</b></a>.
            </div>
        </footer>
    )
}

export { Footer }
