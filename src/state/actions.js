import { ticketmaster_url, eventbrite_url, eventbrite_token, eventful_url, UPDATE_EVENTS, CLEAR_EVENTS, UPDATE_SAVED_EVENTS, SET_CURRENT_EVENT } from './types';
import { Event, Location, Time } from './reducer';
import { transformEventbrite, transformTicketmaster, transformEventful, transformMockAPI } from './transformer';
import axios from 'axios';

const categoryCodes = [
	{eventbrite: '103', name: 'Music', eventful: 'music'},
	{eventbrite: '104', name: 'Film', eventful: 'movies_film'}, // eventbrite: Film, Media & Entertainment
	{eventbrite: '105', name: 'Arts & Theatre', eventful: 'performing_arts'}, // eventbrite: Performing & Visual Arts
	{eventbrite: '108', name: 'Sports', eventful: 'sports'},
	{eventbrite: '110', name: 'Food & Drink', eventful: 'food'} // eventbrite only
]

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
	    console.log(data);
	    let newArray = data.events.map((event, idx) => (
	    	transformEventbrite(event, idx)
	    ));
	    dispatch(updateEvents(newArray));
	  })
	  .catch(err => {
	  	console.log(err);
	  });
	}
}

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
		console.log(ticketmaster_url + categoryStr + locationStr + '&startDateTime=' + startDate + 'Z&endDateTime=' + endDate + 'Z');
		axios.get(ticketmaster_url + categoryStr + locationStr + '&startDateTime=' + startDate + 'Z&endDateTime=' + endDate + 'Z').then(({data}) => {
	    let {_embedded} = data;
	    let newArray = _embedded.events.map((event, idx) => (
	    	transformTicketmaster(event, idx)
	    ));
	    dispatch(updateEvents(newArray));
	  })
	  .catch(err => {
	  	console.log(err);
	  });
	}
}

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
	    let newArray = events.event.map((event, idx) => (
	    	transformEventful(event, idx)
	    ));
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


// begin actions for saved events

export const addSavedEvent = (event) => {
	console.log('adding saved event');
  return (dispatch, getState) => {
  	console.log('entered return');
    let newEvent = {
      name: event.name,
      descrip: event.descrip,
      categories: event.categories,
      source: event.source,
      url: event.url,
      images: event.images,
      startTime: event.startTime.dateTime,
      startTimeZone: event.startTime.timeZone,
      endTime: event.endTime.dateTime,
      endTimeZone: event.endTime.timeZone,
      locationName: event.location.name,
      locationAddress: event.location.address,
      locationCity: event.location.city,
      locationState: event.location.state,
      locationLat: event.location.latitude,
      locationLong: event.location.longitude      
    };
    console.log(newEvent);
    axios.post('http://5a8d9d33b5a3130012909a72.mockapi.io/api/v1/events', newEvent).then(response => {
    	console.log('response received');
      dispatch(fetchSavedEvents());
    })
    .catch(err => {
    	console.log(err);
    });
  }
}

export const fetchSavedEvents = () => {
	console.log('fetching saved events');
	return (dispatch, getState) => {
    axios.get('http://5a8d9d33b5a3130012909a72.mockapi.io/api/v1/events').then(response => {
      let newArray = response.data.map(event => {
      	return transformMockAPI(event)
      });
      dispatch(updateSavedEvents(newArray));
    })
    .catch(err => {
    	console.log(err);
    });
  }
}

export const updateSavedEvents = (sourcesArr) => {
	return {type: UPDATE_SAVED_EVENTS, payload: sourcesArr};
}

export const deleteSavedEvent = (id) => {
  return(dispatch, getState) => {
    axios.delete('http://5a8d9d33b5a3130012909a72.mockapi.io/api/v1/events/' + id).then(response => {
        dispatch(fetchSavedEvents());
    }) 
  }
}

export const setCurrentEvent = (event) => {
	return{type: SET_CURRENT_EVENT, payload: event}
}