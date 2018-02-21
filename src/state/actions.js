import { ticketmaster_url, eventbrite_url, eventbrite_token, eventful_url, UPDATE_EVENTS, CLEAR_EVENTS } from './types';
import { Event, Location, Time } from './reducer';
import { transformEventbrite, transformTicketmaster, transformEventful } from './transformer';
import axios from 'axios';

const categoryCodes = [
	{eventbrite: '103', name: 'Music', eventful: 'music'},
	{eventbrite: '104', name: 'Film', eventful: 'movies_film'}, // eventbrite: Film, Media & Entertainment
	{eventbrite: '105', name: 'Arts & Theatre', eventful: 'performing_arts'}, // eventbrite: Performing & Visual Arts
	{eventbrite: '108', name: 'Sports', eventful: 'sports'},
	{eventbrite: '110', name: 'Food & Drink', eventful: 'food'} // eventbrite only
]

// music, movies_film, food, sports, performing_arts

//location.latitude location.longitude location.within (mi)
export const getEventbriteEvents = (startDate, endDate, type, city, state, lat, long, radius) => {
	return (dispatch, getState) => {
		for (let i = 0; i < categoryCodes.length; i++){
			if (categoryCodes[i].name === type) {
				type = categoryCodes[i].eventbrite;
			}
		}
		let categoryStr = '&categories=' + type;
		if (type === 'All') {
			categoryStr = '';
		}
		let locationStr = '';
		if (city !== '') {
			if (state !== '') {
				locationStr = '&location.address=' + city + ',' + state;
			} else {
				locationStr = '&location.address=' + city;
			}
		} else {
			locationStr = '&location.latitude=' + lat + '&location.longitude=' + long + '&location.within=' + radius + 'mi';
		}
		axios.get(eventbrite_url + '/events/search' + eventbrite_token + categoryStr + locationStr + '&start_date.range_start=' + startDate + '&start_date.range_end=' + endDate).then(({data}) => {
	    let newArray = data.events.map(event => (
	    	transformEventbrite(event)
	    ));
	    console.log(newArray);
	    dispatch(updateEvents(newArray));
	  })
	  .catch(err => {
	  	console.log(err);
	  });
	}
}

//latlong= radius= 
export const getTicketMasterEvents = (startDate, endDate, type, city, state, lat, long, radius) => {
	return (dispatch, getState) => {
		let locationStr = '';
		if (city !== '') {
			if (state !== '') {
				locationStr = '&city=' + city + '&stateCode=' + state;
			} else {
				locationStr = '&city=' + city;
			}
		} else {
			locationStr = '&latlong=' + lat + ',' + long + '&radius=' + radius + '&unit=miles';
		}
		let categoryStr = '&classificationName=' + type;
		if (type === 'All') {
			categoryStr = '';
		}
		axios.get(ticketmaster_url + categoryStr + locationStr + '&startDateTime=' + startDate + '&endDateTime=' + endDate).then(({data}) => {
	    let {_embedded} = data;
	    let newArray = _embedded.events.map(event => (
	    	transformTicketmaster(event)
	    ));
	    console.log(newArray);
	    dispatch(updateEvents(newArray));
	  })
	  .catch(err => {
	  	console.log(err);
	  });
	}
}

//http://api.eventful.com/json/events/search?...&app_key=wG5WzfV8ch7jFRrh &location=Milwaukee&date=Future
//2018-02-20T19:00:00 --> YYYYMMDD00-YYYYMMDD00

//location=  Common geocoordinate formats ("32.746682, -117.162741") are also accepted, but the "within" parameter (int) is required in order to set a search radius.
export const getEventfulEvents = (startDate, endDate, type, city, state, lat, long, radius) => {
	return (dispatch, getState) => {
		for (let i = 0; i < categoryCodes.length; i++){
			if (categoryCodes[i].name === type) {
				type = categoryCodes[i].eventful;
			}
		}
		let categoryStr = '&category=' + type;
		if (type === 'All') {
			categoryStr = '';
		}
		let locationStr = '';
		if (city !== '') {
			if (state !== '') {
				locationStr = '&location=' + city + ',' + state;
			} else {
				locationStr = '&location=' + city;
			}
		} else {
			locationStr = '&location=' + lat + ', ' + long + '&within=' + radius + '&units=mi';
		}
		axios.get(eventful_url + categoryStr + locationStr + '&date=' + startDate + '-' + endDate).then(({data}) => {
	    let {events} = data;
	    console.log(events);
	    let newArray = events.event.map(event => (
	    	transformEventful(event)
	    ));
	    console.log(newArray);
	    dispatch(updateEvents(newArray));
	  })
	  .catch(err => {
	  	console.log(err);
	  });
	}
}

export const updateEvents = (eventsArr) => {
	return {type: UPDATE_EVENTS, payload: eventsArr}
}

export const clearEvents = () => {
	return {type: CLEAR_EVENTS}
}

//source, name, descrip, url, categories, images, startTime, endTime, location
//timezone, dateTime
//name, address, city, state