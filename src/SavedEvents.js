import React, { Component } from 'react';
import Event from './Event';
import { connect } from 'react-redux';
import { fetchSavedEvents } from './state/actions';

class SavedEvents extends Component {

  componentDidMount() {
    this.props.fetchSavedEvents();
  }

  render() {
  	return (
  		<div>
  			<h2>Saved Events</h2>
  			{this.props.savedEvents.map((event, idx) => (
  				<Event event={event} key={idx} saved={true}/>
  			))}	
  		</div>
  	)
  }
}

const mapStateToProps = state => {
  return {
    savedEvents: state.savedEvents
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSavedEvents: () => {
      dispatch(fetchSavedEvents());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SavedEvents);