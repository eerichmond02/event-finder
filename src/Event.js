import React from 'react';
import moment from 'moment';

const Event = (props) => {
	let startDateStr = moment(props.event.startTime.dateTime);
	let endDateStr = '';
	if (props.event.endTime) { endDateStr = moment(props.event.endTime.dateTime); }
	let gcalLink = 'https://calendar.google.com/calendar/r/eventedit?dates=' + startDateStr.toISOString() + '/' + endDateStr.toISOString() + '&text=' + props.event.name + 
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
				<button className='btn btn-ca' onClick={ () => {
						console.log(props.event.location.address);
						console.log(startDateStr.toISOString());
						console.log(gcalLink);
					}
				}>Add to Calendar</button>
				<button className='btn btn-ca'>View Map</button>
			</div>
		</div>
	)
}

export default Event;

//source, name, descrip, url, categories, images, startTime, endTime, location