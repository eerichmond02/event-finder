import React from 'react';
import Event from './Event';
import { connect } from 'react-redux';

const Results = (props) => {
	return (
		<div>
			<h2>Search Results</h2>
			{props.events.map((event, idx) => (
				<Event event={event} key={idx}/>
			))}	
		</div>
	)
}

const mapStateToProps = state => {
  return {
    events: state.events
  }
}

export default connect(mapStateToProps)(Results);

