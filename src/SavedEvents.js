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
        { this.props.savedLoading ?
          <div className='loading'>
            <br />
            <span className='loading-indicator medium'></span>
          </div>
          : this.props.savedEvents.length > 0 ?
    			this.props.savedEvents.map((event, idx) => (
    				<Event event={event} key={idx} saved={true}/>
    			))
          : 
          <div>
            <h4>No events have been saved. Perform a search to save events.</h4>
          </div>
        }
  		</div>
  	)
  }
}

const mapStateToProps = state => {
  return {
    savedEvents: state.savedEvents,
    savedLoading: state.savedLoading
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