import React from 'react';
import { Link } from 'react-router-dom';

const Home = (props) => {
	return (
		<div>
			<h2>Welcome to Event Finder!</h2>
			<h4>To search for an event, go to the <Link to='/search'>search page</Link>.</h4>
			<h4>About Event Finder...</h4>
		</div>
	)
}

export default Home;