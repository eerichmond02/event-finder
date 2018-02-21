import { UPDATE_EVENTS, CLEAR_EVENTS, UPDATE_SAVED_EVENTS, SET_CURRENT_EVENT } from './types';

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
	currentEvent: undefined
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
		default:
			return state;
	}
}

export default reducer;
export { Event, Location, Time };