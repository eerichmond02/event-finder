import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './state/store';

const Root = () => (
	<Provider store={store}>
		<App />
	</Provider>
)

const renderReact = () => {
    ReactDOM.render(<Root />, document.getElementById('root'));
 }
  
let script = document.createElement("script")
script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDQMgDtwaciMnXmkBEDFPN6Aij05Z2imSI"
script.onload = renderReact;
document.body.appendChild(script)
