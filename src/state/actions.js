import { ticketmaster_url, eventbrite_url, eventbrite_token, eventful_url, UPDATE_EVENTS, CLEAR_EVENTS, UPDATE_SAVED_EVENTS, SET_CURRENT_EVENT, SET_SEARCH_PARAMS, SET_EVENTS_LOADING, SET_SAVED_LOADING } from './types';
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
		dispatch(setEventsLoading());
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
	    let newArray = data.events.map((event, idx) => (
	    	transformEventbrite(event, idx)
	    ));
	    dispatch(updateEvents(newArray));
	    dispatch(setEventsLoading());
	  })
	  .catch(err => {
	  	console.log(err);
	  	dispatch(setEventsLoading());
	  });
	}
}

export const getTicketMasterEvents = (startDate, endDate, type, city, state, lat, long, radius) => {
	return (dispatch, getState) => {
		dispatch(setEventsLoading());
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
		axios.get(ticketmaster_url + categoryStr + locationStr + '&startDateTime=' + startDate + 'Z&endDateTime=' + endDate + 'Z').then(({data}) => {
	    let {_embedded} = data;
	    let newArray = _embedded.events.map((event, idx) => (
	    	transformTicketmaster(event, idx)
	    ));
	    dispatch(updateEvents(newArray));
	    dispatch(setEventsLoading());
	  })
	  .catch(err => {
	  	console.log(err);
	  	dispatch(setEventsLoading());
	  });
	}
}

export const getEventfulEvents = (startDate, endDate, type, city, state, lat, long, radius) => {
	return (dispatch, getState) => {
		dispatch(setEventsLoading());
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
	    let newArray = events.event.map((event, idx) => (
	    	transformEventful(event, idx)
	    ));
	    dispatch(updateEvents(newArray));
	    dispatch(setEventsLoading());
	  })
	  .catch(err => {
	  	console.log(err);
	  	dispatch(setEventsLoading());
	  });
	}
}

export const updateEvents = (eventsArr) => {
	return {type: UPDATE_EVENTS, payload: eventsArr}
}

export const clearEvents = () => {
	console.log('clearing')
	return {type: CLEAR_EVENTS}
}


// begin actions for saved events

export const addSavedEvent = (event) => {
	console.log('adding saved event');
  return (dispatch, getState) => {
  	dispatch(setSavedLoading());
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
    axios.post('http://5a8d9d33b5a3130012909a72.mockapi.io/api/v1/events', newEvent).then(response => {
    	console.log('response received');
    	dispatch(setSavedLoading());
      dispatch(fetchSavedEvents());
    })
    .catch(err => {
    	dispatch(setSavedLoading());
    	console.log(err);
    });
  }
}

export const fetchSavedEvents = () => {
	console.log('fetching saved events');
	return (dispatch, getState) => {
		dispatch(setSavedLoading());
    axios.get('http://5a8d9d33b5a3130012909a72.mockapi.io/api/v1/events').then(response => {
      let newArray = response.data.map(event => {
      	return transformMockAPI(event)
      });
      dispatch(setSavedLoading());
      dispatch(updateSavedEvents(newArray));
    })
    .catch(err => {
    	dispatch(setSavedLoading());
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

export const setSearchParams = (params) => {
	return{type: SET_SEARCH_PARAMS, payload: params}
}

export const setEventsLoading = () => {
	return{type: SET_EVENTS_LOADING}
}

export const setSavedLoading = () => {
	return{type: SET_SAVED_LOADING}
}