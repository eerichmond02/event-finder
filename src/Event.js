import React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { addSavedEvent, deleteSavedEvent, setCurrentEvent } from './state/actions';
import { connect } from 'react-redux';
import EventDetails from './EventDetails';

const Event = (props) => {
	console.log(props.event.source + ': ' + props.event.startTime.dateTime);

	let start_date = formatCalendarDate(props.event.startTime.dateTime);

	let end_date;
	if (props.event.endTime.dateTime) {
		end_date = formatCalendarDate(props.event.endTime.dateTime)
	} else {
		end_date = start_date;
	}
	
	let gcalLink = 'https://calendar.google.com/calendar/r/eventedit?dates=' + start_date + '/' + end_date + '&text=' + props.event.name + 
	'&location=' + props.event.location.address + ' ' + props.event.location.city + ' ' + props.event.location.state + '&sf=true&output=xml';

	let saveButton;
	if (props.saved) {
		saveButton = (<button className='btn saveButton' onClick={() => props.deleteSavedEvent(props.event.id)}><div className='icon-sysicon-trash icon'></div>Remove from Saved Events</button>)
	} else {
		saveButton = (<button className='btn saveButton' onClick={() => props.addSavedEvent(props.event)}><div className='icon-bookmark-solid icon'></div>Save for Later</button>)
	}

	let dayOfWeek = new Date(props.event.startTime.dateTime).getDay();

	return(
		<div>
			<div className='card'>
				{saveButton}
				<div className='row eventData'>
					<div className='large-7 columns'>
						<h4>{props.event.name}</h4>
						<h5>{moment(dayOfWeek, 'd').format('ddd') + ' ' + moment(props.event.startTime.dateTime.substring(0, 10), 'YYYY-MM-DD').format('MMM DD, YYYY') + ' ' +
									moment(props.event.startTime.dateTime.substring(11, 19), 'HH:mm:ss').format('h:mm a')}</h5>
						<a href={gcalLink} target='_blank' rel='noopener noreferrer'><button className='btn' onClick={ () => {console.log(gcalLink);}}><div className='icon-sysicon-calendar icon'></div>Add to Calendar</button></a>
						<h6>{props.event.location.name}</h6>
						<h6>{props.event.location.address + ' ' + props.event.location.city + ' ' + props.event.location.state}</h6>
						<button onClick={() => {console.log(props); props.setCurrentEvent(props.event); props.history.push('/currentDetails');}}className='btn'><div className='icon-util-moreinfo icon'></div>View More Info</button>
					</div>
					<div className='large-5 columns flex'>
						<img src={props.event.images[0]}alt='event'/>
					</div>
				</div>
			</div>
		</div>
	)
}

const formatCalendarDate = (str) => {
	let newStr = str.replace(/-/, '');
	newStr = newStr.replace(/-/, '');
	newStr = newStr.replace(/:/, '');
	newStr = newStr.replace(/:/, '');
	newStr = newStr.replace(/ /, 'T');
	return newStr;
}

const mapStateToProps = state => {
  return {
    events: state.events
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addSavedEvent: (event) => {
    	dispatch(addSavedEvent(event));
    },
    deleteSavedEvent: (id) => {
    	dispatch(deleteSavedEvent(id));
    },
    setCurrentEvent: (event) => {
    	dispatch(setCurrentEvent(event));
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Event));