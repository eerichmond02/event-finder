import React from 'react';
import { Link } from 'react-router-dom';

const About = (props) => {
	return (
		<div>
			<h2>Thanks for visiting Event Finder!</h2>
			<h4>To search for an event, go to the <Link to='/search'>search page</Link>.</h4>
			<h4>The Event Finder application aggregates data from multiple event APIs, to give users a robust list of exciting events happening in their area.
			The application is powered by: <a href='https://www.eventbrite.com/developer/v3/' target='_blank' rel='noopener noreferrer'>Eventbrite</a>, 
			<a href='http://api.eventful.com/' target='_blank' rel='noopener noreferrer'>Eventful</a>, and 
			<a href='https://developer.ticketmaster.com/' target='_blank' rel='noopener noreferrer'>Ticketmaster</a>.</h4>
		</div>
	)
}

export default About;