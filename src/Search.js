import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { connect } from 'react-redux';
import { getTicketMasterEvents, getEventbriteEvents, clearEvents, getEventfulEvents } from './state/actions'

class Search extends Component {
	constructor(props) {
		super(props);
		this.state = {
			locationFilter: 'nearMe',
			cityInput: '',
			stateInput: '',
			radiusInput: '',
			eventType: 'default',
			startDate: null,
			endDate: null,
			lat: null,
			long: null
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleChangeStart = this.handleChangeStart.bind(this);
		this.handleChangeEnd = this.handleChangeEnd.bind(this);
	}

	componentWillMount() {
		if ("geolocation" in navigator) {
			console.log(navigator.geolocation);
			navigator.geolocation.getCurrentPosition(position => {
				console.log(position.coords);
				this.setState({lat: position.coords.latitude, long: position.coords.longitude});
			});
		  /* geolocation is available */
		} else {
			console.log('no geolocation');
		  /* geolocation IS NOT available */
		}
	}
	handleChange(e) {
    this.setState({[e.target.name]: e.target.value})
  }

  handleChangeStart(date) {
  	this.setState({startDate: moment(date)}, () =>{
  		console.log(this.state.startDate.format('YYYY-MM-DDT00:00:00'));
  	});
  }

  handleChangeEnd(date) {
  	this.setState({endDate: moment(date)}, () =>{
  		console.log(this.state.endDate.format('YYYY-MM-DDT23:59:59'));
  	});
  }

	render() {
		return (
			<div>
				<h2>Search for an event!</h2>
				<form>
					<div className="uitk-select md-text-field with-floating-label">
						<label>Event Type</label>
				    <select className="os-default" name="eventType" onChange={this.handleChange} value={this.state.eventType}>
				        <option disabled value="default">Select an Event Type</option>
				        <option value="Music">Music</option>
				        <option value="Film">Film</option>
				        <option value="Arts & Theatre">Arts & Theatre</option>
				        <option value="Sports">Sports</option>
				        <option value="Food & Drink">Food & Drink</option>
				        <option value="All">All</option>
				    </select>
				    <span className="select-arrow"></span>
					</div>		
					<div className="md-multi-ctrl-field radio">
						<label>Event Location</label>
	        	<input className="radioButton" id="nearMe" name="locationFilter" type="radio" checked={this.state.locationFilter === 'nearMe'}onChange={this.handleChange} value="nearMe"></input>
	          <label className="radioButton" htmlFor="nearMe">Near Me</label>
	        	<input className="radioButton" id="location" name="locationFilter" type="radio" checked={this.state.locationFilter === 'location'}onChange={this.handleChange} value="location"></input>
	          <label className="radioButton" htmlFor="location">Specify Location</label>
	        </div>
	        <div className="row">
	        	{this.state.locationFilter === 'nearMe' ?
			        <div className="uitk-select md-text-field with-floating-label">
								<label>Location Radius</label>
						    <select className="os-default" name="radiusInput" onChange={this.handleChange} value={this.state.radiusInput}>
						        <option disabled value="default">Select a search radius</option>
						        <option value="1">1 mile</option>
						        <option value="5">5 miles</option>
						        <option value="10">10 miles</option>
						        <option value="25">25 miles</option>
						        <option value="50">50 miles</option>
						    </select>
						    <span className="select-arrow"></span>
	        		</div>
	        		:
	        		<div>
	        			<label>Location City & State</label>
	     	        <input className="large-9 columns" type="text" placeholder="City" name="cityInput" onChange={this.handleChange} value={this.state.cityInput}/>
		        		<input className="large-2 columns" type="text" placeholder="State" name="stateInput" onChange={this.handleChange} value={this.state.stateInput}/>
	        		</div>
	        	}
	        </div>
	        <label>Event Date Range - Start</label>
        	<DatePicker
				    selected={this.state.startDate}
				    selectsStart
				    startDate={this.state.startDate}
				    endDate={this.state.endDate}
				    onChange={this.handleChangeStart}
				    placeholderText="Select a start date"
				    dateFormat="MM/DD/YYYY"
					/>
					<label>Event Date Range - End</label>
					<DatePicker
				    selected={this.state.endDate}
				    selectsEnd
				    startDate={this.state.startDate}
				    endDate={this.state.endDate}
				    onChange={this.handleChangeEnd}
				    placeholderText="Select an end date"
				    dateFormat="MM/DD/YYYY"
					/>
					<button onClick={() => {
						this.props.clearEvents();
						this.props.getEventfulEvents(this.state.startDate.format('YYYYMMDD00'), this.state.endDate.format('YYYYMMDD00'), this.state.eventType, this.state.cityInput, this.state.stateInput, this.state.lat, this.state.long, this.state.radiusInput);
						this.props.getTicketMasterEvents(this.state.startDate.format('YYYY-MM-DDT00:00:00Z'), this.state.endDate.format('YYYY-MM-DDT23:59:59Z'), this.state.eventType, this.state.cityInput, this.state.stateInput, this.state.lat, this.state.long, this.state.radiusInput);
						this.props.getEventbriteEvents(this.state.startDate.format('YYYY-MM-DDT00:00:00'), this.state.endDate.format('YYYY-MM-DDT23:59:59'), this.state.eventType, this.state.cityInput, this.state.stateInput, this.state.lat, this.state.long, this.state.radiusInput);
						this.props.history.push('/search/results');
					}}>Search!</button>
				</form>
			</div>
		)
	}
}

const mapStateToProps = state => {
  return {
    events: state.events
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getTicketMasterEvents: (startDate, endDate, type, city, state, lat, long, radius) => {
    	dispatch(getTicketMasterEvents(startDate, endDate, type, city, state, lat, long, radius));
    },
    getEventbriteEvents: (startDate, endDate, type, city, state, lat, long, radius) => {
    	dispatch(getEventbriteEvents(startDate, endDate, type, city, state, lat, long, radius));
    },
    getEventfulEvents: (startDate, endDate, type, city, state, lat, long, radius) => {
    	dispatch(getEventfulEvents(startDate, endDate, type, city, state, lat, long, radius));
    },
    clearEvents: () => {
    	dispatch(clearEvents());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);