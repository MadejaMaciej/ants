import { Component } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Menu } from './Menu'
import { Main } from './Main'
import { Footer } from './Footer'
import { Simulation } from './Simulation'
import { Game } from './Game'
import { WindowSmall } from './WindowSmall'

var name = 'Maciej Madejczyk', yearOfProduction = '2022', that

class App extends Component {
  constructor(){
    super()
    this.state = {
      width:  window.innerWidth,
      height: window.innerHeight
    }
    that = this
  }

  handleResize() {
    that.setState({
      height: window.innerHeight,
      width: window.innerWidth
    })
  }

  componentDidMount(){
    window.addEventListener('resize', that.handleResize)
  }

  render(){
    if(that.state.width > 767){
      return (
        <div id="bg" className="background position-relative">
          <BrowserRouter>
            <Menu />
            <section>
              <Routes>
                <Route exact path="/" element={<Main />} />
                <Route exact path="/simulation" element={<Simulation />} />
                <Route exact path="/game" element={<Game />} />
              </Routes>
            </section>
            <div className="footer-heighter"></div>
            <Footer name={name} year={yearOfProduction} />
          </BrowserRouter>
        </div>
      )
    }

    return (
      <div>
        <div id="bg" className="background position-relative">
          <BrowserRouter>
            <Menu />
            <section>
              <WindowSmall />
            </section>
            <div className="footer-heighter"></div>
            <Footer name={name} year={yearOfProduction} />
          </BrowserRouter>
        </div>
      </div>
    )
    
  }
}

export { App }
