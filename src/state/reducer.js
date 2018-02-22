import { UPDATE_EVENTS, CLEAR_EVENTS, UPDATE_SAVED_EVENTS, SET_CURRENT_EVENT, SET_SEARCH_PARAMS, SET_EVENTS_LOADING, SET_SAVED_LOADING } from './types';

class Event {
	constructor(source, name, descrip, url, categories, images, startTime, endTime, location, idx, id) {
		this.source = source;
		this.name = name;
		this.descrip = descrip;
		this.url = url;
		this.categories = categories;
		this.images = images;
		this.startTime = startTime;
		this.endTime = endTime;
		this.location = location;
		this.idx = idx;
		this.id = id;
	}
}

class Location {
	constructor(name, address, city, state, latitude, longitude) {
		this.name = name;
		this.address = address;
		this.city = city;
		this.state = state;
		this.latitude = latitude;
		this.longitude = longitude;
	}
}

class Time {
	constructor(timezone, dateTime) {
		this.timezone = timezone;
		this.dateTime = dateTime;
	}
}

const initialState = {
	events: [],
	savedEvents: [],
	currentEvent: undefined,
	searchParams: undefined,
	eventsLoading: false,
	savedLoading: false
}

const reducer = (state=initialState, action) => {
	switch(action.type){
		case UPDATE_EVENTS:
			return {
				...state,
				events: state.events.concat(action.payload)
			}
		case CLEAR_EVENTS:
			return {
				...state,
				events: []
			}
		case UPDATE_SAVED_EVENTS:
			return {
				...state,
				savedEvents: action.payload
			}
		case SET_CURRENT_EVENT:
			return {
				...state,
				currentEvent: action.payload
			}
		case SET_SEARCH_PARAMS:
			return {
				...state,
				searchParams: action.payload
			}
		case SET_EVENTS_LOADING:
			return {
				...state,
				eventsLoading: !state.eventsLoading
			}
		case SET_SAVED_LOADING:
			return {
				...state,
				savedLoading: !state.savedLoading
			}
		default:
			return state;
	}
}

export default reducer;
export { Event, Location, Time };