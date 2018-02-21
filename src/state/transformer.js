import axios from 'axios';
import { ticketmaster_url, eventbrite_url, eventbrite_token } from './types';
import { Event, Location, Time } from './reducer';
import moment from 'moment';

export const transformEventbrite = (event) => {
	let start_date = event.start.local.replace(/T/, ' ');
	let end_date = event.start.local.replace(/T/, ' ');
	let image_url;
	if (event.logo) {
		image_url = event.logo.url;
	}
  let venue = new Location();
	axios.get(eventbrite_url + '/venues/' + event.venue_id + eventbrite_token).then(({data}) => {
		venue.name = data.name;
		if (data.address.address_2) { venue.address = data.address.address_1 + ' ' + data.address.address_2 }
		else { venue.address = data.address.address_1 }
		venue.city = data.address.city
		venue.state = data.address.region;
	})
	.catch(err => {
		console.log(err);
	});	
  return new Event(
  	'eventbrite',
  	event.name.text,
  	event.description.text,
  	event.url,
  	[event.category_id],
  	[image_url],
  	new Time(event.start.timezone, start_date),
  	new Time(event.end.timezone, end_date),
  	venue
  );
}

export const transformTicketmaster = (event) => {
	let categories = [];
	event.classifications.forEach(classification => 
		categories.push(classification.segment.name)
	)
	let images = [];
	event.images.forEach(image => 
		images.push(image.url)
	) 	
  return new Event(
  	'ticketmaster',
  	event.name,
  	'',
  	event.url,
  	categories,
  	images,
  	new Time(event.dates.timezone, (event.dates.start.localDate + ' ' + event.dates.start.localTime)),
  	{},
  	new Location(event._embedded.venues[0].name, event._embedded.venues[0].address.line1, event._embedded.venues[0].city.name, event._embedded.venues[0].state.stateCode)
  );
}

export const transformEventful = (event) => {
	let image_url;
	if (event.image) {
		image_url = event.image.medium.url;
	}
  return new Event(
  	'eventful',
  	event.title,
  	event.description,
  	event.url,
  	[],
  	[image_url],
  	new Time(event.olson_path, event.start_time),
  	new Time(event.olson_path, event.stop_time),
  	new Location(event.venue_name, event.venue_address, event.city_name, event.region_abbr)
  );
}

//Event: source, name, descrip, url, categories, images, startTime, endTime, location