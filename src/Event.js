import React from 'react';
import moment from 'moment';

const Event = (props) => {
	console.log(props.event.source + ': ' + props.event.startTime.dateTime);

	//2018-02-23 19:00:00
	let start_date = props.event.startTime.dateTime.replace(/-/, '');
	start_date = start_date.replace(/-/, '');
	start_date = start_date.replace(/:/, '');
	start_date = start_date.replace(/:/, '');
	start_date = start_date.replace(/ /, 'T');

	let end_date;
	if (props.event.endTime.dateTime) {
		end_date = props.event.endTime.dateTime.replace(/-/, '');
		end_date = end_date.replace(/-/, '');
		end_date = end_date.replace(/:/, '');
		end_date = end_date.replace(/:/, '');
		end_date = end_date.replace(/ /, 'T');
	} else {
		end_date = start_date;
	}
	
	let gcalLink = 'https://calendar.google.com/calendar/r/eventedit?dates=' + start_date + '/' + end_date + '&text=' + props.event.name + 
	'&location=' + props.event.location.address + ' ' + props.event.location.city + ' ' + props.event.location.state + '&sf=true&output=xml';
	return(
		<div className='card'>
			<div className='large-8 columns'>
				<h2>{props.event.name}</h2>
				<h3>{props.event.source}</h3>
				<h3>{props.event.startTime.dateTime}</h3>
				<p>{props.event.descrip}</p>
				<p><a href={props.event.url} target='_blank' rel='noopener noreferrer'>More Info & Get Tickets</a></p>
			</div>
			<div className='large-4 columns'>
				<img src={props.event.images[0]}alt='event'/>
				<button className='btn btn-ca'>Save for Later</button>
				<a href={gcalLink} target='_blank' rel='noopener noreferrer'><button className='btn btn-ca' onClick={ () => {console.log(gcalLink);}}>Add to Calendar</button></a>
				<button className='btn btn-ca'>View Map</button>
			</div>
		</div>
	)
}

export default Event;

//source, name, descrip, url, categories, images, startTime, endTime, location