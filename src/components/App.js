import { Component } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Menu } from './Menu'
import { Main } from './Main'
import { Footer } from './Footer'
import { Simulation } from './Simulation'
import { Game } from './Game'

var name = 'Maciej Madejczyk', yearOfProduction = '2022'

class App extends Component {
  render(){
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
}

export { App }
