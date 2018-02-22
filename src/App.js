import React, { Component } from 'react';
import './ui-toolkit/css/nm-cx/main.css';
import './App.css';
import { Link, Route, BrowserRouter } from 'react-router-dom';
import About from './About';
import Search from './Search';
import Results from './Results';
import SavedEvents from './SavedEvents';
import EventDetails from './EventDetails'

const CustomLink = ({label, to, exact}) => (
  <Route path={to} exact={exact} children={ ({match}) => (
    <li className={match ? 'active tab-title' : 'tab-title'}>
      <Link to={to}>{label}</Link>
    </li>
  )
  } />
)

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <div>
            <h1><span className='header1'>Event</span> <span className='header2'>Finder</span></h1>
            <ul className= "tabs">
              <CustomLink label='Search' to='/' exact={true}/>
              <CustomLink label='Saved Events' to='/saved' exact={true}/>
              <CustomLink label='About' to='/about' exact={true}/>
            </ul>
          </div>
          <div>
            <Route path='/about' exact component={About}/>
            <Route path='/' exact component={Search}/>
            <Route path='/results' exact component={Results}/>
            <Route path='/saved' exact component={SavedEvents}/>
            <Route path='/currentDetails' exact component={EventDetails}/>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
