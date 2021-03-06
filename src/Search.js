import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { connect } from 'react-redux';
import { getTicketMasterEvents, getEventbriteEvents, clearEvents, getEventfulEvents, setSearchParams } from './state/actions'

class Search extends Component {
	constructor(props) {
		super(props);
		this.state = {
			locationFilter: 'nearMe',
			cityInput: '',
			stateInput: '',
			radiusInput: 'default',
			eventType: 'default',
			startDate: moment(),
			endDate: moment(),
			lat: null,
			long: null,
			validated: false,
			cityError: '',
			radiusError: '',
			startError: '',
			endError: '',
			typeError: ''
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleChangeStart = this.handleChangeStart.bind(this);
		this.handleChangeEnd = this.handleChangeEnd.bind(this);
		this.validate = this.validate.bind(this);
		this.handleLocationChange = this.handleLocationChange.bind(this);
	}

	componentWillMount() {
		if ("geolocation" in navigator) {
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

	componentDidMount() {
		if (this.props.searchParams) {
			this.setState({
				locationFilter: this.props.searchParams.locationFilter,
				cityInput: this.props.searchParams.cityInput,
				stateInput: this.props.searchParams.stateInput,
				radiusInput: this.props.searchParams.radiusInput,
				eventType: this.props.searchParams.eventType,
				startDate: this.props.searchParams.startDate,
				endDate: this.props.searchParams.endDate
			}, () => {
				this.validate();
			});
		}
	}

	handleChange(e) {
    this.setState({[e.target.name]: e.target.value}, () => {
    	this.validate();
    })
  }

  handleLocationChange(e) {
  	this.setState({locationFilter: e.target.value, cityInput: '', stateInput: ''}, () => {
    	this.validate();
    })
  }

  handleChangeStart(date) {
  	this.setState({startDate: moment(date), endDate: moment(date)}, () =>{
  		console.log(this.state.startDate.format('YYYY-MM-DDT00:00:00'));
  		this.validate();
  	});
  }

  handleChangeEnd(date) {
  	this.setState({endDate: moment(date)}, () =>{
  		console.log(this.state.endDate.format('YYYY-MM-DDT23:59:59'));
  		this.validate();
  	});
  }

  validate() {
  	let validated = true;
  	if (this.state.locationFilter === 'nearMe') {
  		if (this.state.radiusInput === 'default') {
  			validated = false;
  			this.setState({radiusError: 'Radius must be populated.'})
  		} else {
  			this.setState({radiusError: ''})
  		}
  	}
  	if (this.state.locationFilter === 'location') {
  		if (this.state.cityInput === '') {
  			validated = false;
  			this.setState({cityError: 'City must be populated.'})
  		} else {
  			this.setState({cityError: ''})
  		}
  	}
  	if (this.state.eventType === 'default') {
  		validated = false;
  		this.setState({typeError: 'Event type must be populated.'})
  	} else {
  		this.setState({typeError: ''})
  	}
  	if (!moment(this.state.startDate).isValid()) {
  		validated = false;
  		this.setState({startError: 'Start date must be a valid date.'})
  	} else {
  		this.setState({startError: ''})
  	}
  	if (!moment(this.state.endDate).isValid()) {
  		validated=false;
  		this.setState({endError: 'End date must be a valid date.'})
  	} else {
  		this.setState({endError: ''})
  	}
  	if (this.state.endDate < this.state.startDate) {
  		validated = false;
  		this.setState({endError: 'End date must be greater than start date.'})
  	} else {
  		this.setState({endError: ''})
  	}
  	this.setState({validated});
  }

	render() {
		return (
			<div>
				<h2>Search for an event!</h2>
				<form>
					<label>Event Type</label>
			    <select className="os-default" name="eventType" onChange={this.handleChange} value={this.state.eventType}>
			        <option disabled value="default">Select an event type</option>
			        <option value="Music">Music</option>
			        <option value="Film">Film</option>
			        <option value="Arts & Theatre">Arts & Theatre</option>
			        <option value="Sports">Sports</option>
			        <option value="Food & Drink">Food & Drink</option>
			        <option value="All">All</option>
			    </select>
			    <span className="select-arrow"></span>
			    <label className="error">{this.state.typeError}</label>
					<div className="md-multi-ctrl-field radio">
						<label>Event Location</label>
	        	<input className="radioButton" id="nearMe" name="locationFilter" type="radio" checked={this.state.locationFilter === 'nearMe'}onChange={this.handleLocationChange} value="nearMe"></input>
	          <label className="radioButton" htmlFor="nearMe">Near Me</label>
	        	<input className="radioButton" id="location" name="locationFilter" type="radio" checked={this.state.locationFilter === 'location'}onChange={this.handleLocationChange} value="location"></input>
	          <label className="radioButton" htmlFor="location">Specify Location</label>
	        </div>
	        <div className="row">
	        	{this.state.locationFilter === 'nearMe' ?
			        <div>
								<label>Location Radius</label>
						    <select className="os-default" name="radiusInput" onChange={this.handleChange} value={this.state.radiusInput}>
						        <option disabled value="default">Select a search radius</option>
						        <option value="5">5 miles</option>
						        <option value="10">10 miles</option>
						        <option value="25">25 miles</option>
						        <option value="50">50 miles</option>
						    </select>
						    <span className="select-arrow"></span>
						    <label className="error">{this.state.radiusError}</label>
	        		</div>
	        		:
	        		<div>
	        			<label>Location City & State</label>
	     	        <input className="large-9 columns" type="text" placeholder="City" name="cityInput" onChange={this.handleChange} value={this.state.cityInput}/>
						    <select className="os-default large-3 columns" name="stateInput" onChange={this.handleChange} value={this.state.stateInput}>
						        <option disabled value="">Select a state</option>
						        <option value="AK">AK</option>
						        <option value="AL">AL</option>
						        <option value="AR">AR</option>
						        <option value="AZ">AZ</option>
						        <option value="CA">CA</option>
						        <option value="CO">CO</option>
						        <option value="CT">CT</option>
						        <option value="DE">DE</option>
						        <option value="FL">FL</option>
						        <option value="GA">GA</option>
						        <option value="HI">HI</option>
						        <option value="IA">IA</option>
						        <option value="ID">ID</option>
						        <option value="IL">IL</option>
						        <option value="IN">IN</option>
						        <option value="KS">KS</option>
						        <option value="KY">KY</option>
						        <option value="LA">LA</option>
						        <option value="MA">MA</option>
						        <option value="MD">MD</option>
						        <option value="ME">ME</option>
						        <option value="MI">MI</option>
						        <option value="MN">MN</option>
						        <option value="MO">MO</option>
						        <option value="MS">MS</option>
						        <option value="MT">MT</option>
						        <option value="NC">NC</option>
						        <option value="ND">ND</option>						        						        
						        <option value="NE">NE</option>
						        <option value="NH">NH</option>
						        <option value="NJ">NJ</option>
						        <option value="NM">NM</option>
						        <option value="NV">NV</option>
						        <option value="NY">NY</option>
						        <option value="OH">OH</option>
						        <option value="OK">OK</option>
						        <option value="OR">OR</option>
						        <option value="PA">PA</option>
						        <option value="RI">RI</option>
						        <option value="SC">SC</option>
						        <option value="SD">SD</option>
						        <option value="TN">TN</option>
						        <option value="TX">TX</option>
						        <option value="UT">UT</option>
						        <option value="VA">VA</option>
						        <option value="VT">VT</option>
						        <option value="WA">WA</option>
						        <option value="WI">WI</option>
						        <option value="WV">WV</option>
						        <option value="WY">WY</option>
						    </select>
						    <span className="select-arrow"></span>
	        			<label className="error block">{this.state.cityError}</label>
	        		</div>
	        	}
	        </div>
	        <div className='row'>
		        <div className='large-8 columns datePickerDiv'>
		        	<div className='large-4 columns datePickerDiv'>
		        		<label>Event Start Date</label>
			        	<DatePicker
							    selected={this.state.startDate}
							    selectsStart
							    startDate={this.state.startDate}
							    endDate={this.state.endDate}
							    onChange={this.handleChangeStart}
							    placeholderText="Select a start date"
							    dateFormat="MM/DD/YYYY"
							    minDate={moment()}
			  					maxDate={moment().add(12, "months")}
								/>
								<label className="error">{this.state.startError}</label>
							</div>
							<div className='large-4 columns datePickerDiv'>
								<label>Event End Date</label>
								<DatePicker
							    selected={this.state.endDate}
							    selectsEnd
							    startDate={this.state.startDate}
							    endDate={this.state.endDate}
							    onChange={this.handleChangeEnd}
							    placeholderText="Select an end date"
							    dateFormat="MM/DD/YYYY"
							    minDate={moment()}
			  					maxDate={moment().add(12, "months")}
			  					showDisabledMonthNavigation
								/>
								<label className="error">{this.state.endError}</label>
							</div>
						</div>
					</div>
					<button className='btn btn-ca' id='searchButton' disabled={!this.state.validated} onClick={(e) => {
						e.preventDefault();
						this.props.clearEvents();
						this.props.getEventfulEvents(this.state.startDate.format('YYYYMMDD00'), this.state.endDate.format('YYYYMMDD00'), this.state.eventType, this.state.cityInput, this.state.stateInput, this.state.lat, this.state.long, this.state.radiusInput);
						this.props.getTicketMasterEvents(this.state.startDate.format('YYYY-MM-DDT00:00:00'), this.state.endDate.format('YYYY-MM-DDT23:59:59'), this.state.eventType, this.state.cityInput, this.state.stateInput, this.state.lat, this.state.long, this.state.radiusInput);
						this.props.getEventbriteEvents(this.state.startDate.format('YYYY-MM-DDT00:00:00'), this.state.endDate.format('YYYY-MM-DDT23:59:59'), this.state.eventType, this.state.cityInput, this.state.stateInput, this.state.lat, this.state.long, this.state.radiusInput);
						this.props.setSearchParams({
							locationFilter: this.state.locationFilter,
							cityInput: this.state.cityInput,
							stateInput: this.state.stateInput,
							radiusInput: this.state.radiusInput,
							eventType: this.state.eventType,
							startDate: this.state.startDate,
							endDate: this.state.endDate
						});
						this.props.history.push('/results');
					}}>Search!</button>
				</form>
			</div>
		)
	}
}

const mapStateToProps = state => {
  return {
    events: state.events,
    searchParams: state.searchParams
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
    },
    setSearchParams: (params) => {
    	dispatch(setSearchParams(params));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);