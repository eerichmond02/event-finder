import React, { Component } from 'react';
import './ui-toolkit/css/nm-cx/main.css';
import './App.css';
import { Link, Route, BrowserRouter } from 'react-router-dom';
import Home from './Home';
import Search from './Search';
import Results from './Results';

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
            <h1>Event Finder</h1>
            <ul className= "tabs">
              <CustomLink label='Home' to='/' exact={true}/>
              <CustomLink label='Search' to='/search' exact={true}/>
              <CustomLink label='Saved Events' to='/saved' exact={true}/>
            </ul>
          </div>
          <div>
            <Route path='/' exact component={Home}/>
            <Route path='/search' exact component={Search}/>
            <Route path='/results' exact component={Results}/>
            <Route path='/saved' exact />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
