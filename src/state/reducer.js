import { UPDATE_EVENTS, CLEAR_EVENTS } from './types';

class Event {
	constructor(source, name, descrip, url, categories, images, startTime, endTime, location) {
		this.source = source;
		this.name = name;
		this.descrip = descrip;
		this.url = url;
		this.categories = categories;
		this.images = images;
		this.startTime = startTime;
		this.endTime = endTime;
		this.location = location;
	}
}

class Location {
	constructor(name, address, city, state) {
		this.name = name;
		this.address = address;
		this.city = city;
		this.state = state;
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
	savedEvents: []
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
		default:
			return state;
	}
}

export default reducer;
export { Event, Location, Time };