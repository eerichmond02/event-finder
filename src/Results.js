import React, { Component } from 'react';
import moment from 'moment';
import Event from './Event';
import { connect } from 'react-redux';

class Results extends Component {
	constructor(props){
		super(props);
		this.state = {
			events: [],
			sort: 'default',
		}
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
    this.setState({[e.target.name]: e.target.value}, () => {
    	let sortedArr;
    	switch(this.state.sort){
    		case 'name':
    			sortedArr = this.state.events.sort((a,b) => {
    				return compareName(a,b);
    			})
    			break;
    		case 'dateA':
    			sortedArr = this.state.events.sort((a,b) => {
    				return compareStartTimeAsc(a,b);
    			})
    			break;
    		case 'dateD':
    			sortedArr = this.state.events.sort((a,b) => {
    				return compareStartTimeDesc(a,b);
    			})
    			break;
    		default:
    			break;
    	}
    	this.setState({events: sortedArr});
    })
  }

  componentWillReceiveProps(nextProps) {
  	if (this.state.events !== nextProps.events) {
  		let sortedArr = removeEarlyEvents(nextProps.events, nextProps.searchParams);
			sortedArr = sortedArr.sort((a,b) => {
				return compareName(a,b);
			});
			sortedArr.sort((a,b) => {
	    	return compareStartTimeAsc(a,b);
	    });
	  	this.setState({events: sortedArr});
  	}
  }

  componentDidMount() {
  	let sortedArr = removeEarlyEvents(this.props.events, this.props.searchParams);
		sortedArr = sortedArr.sort((a,b) => {
			return compareName(a,b);
		});
		sortedArr.sort((a,b) => {
    	return compareStartTimeAsc(a,b);
    });
  	this.setState({events: sortedArr});
  }

	render() {
		return (
			<div>
				<h2>Search Results</h2>
				{ this.props.eventsLoading ?
					<div className='loading'>
						<br />
						<span className='loading-indicator medium'></span>
					</div>
					: this.props.events.length > 0 ?
					<div>
						<div className="sort">
							<label>Sort by:</label>
					    <select className="os-default" name="sort" onChange={this.handleChange} value={this.state.sort}>
					        <option disabled value="default">Select a Sort Option</option>
					        <option value="name">Name</option>
					        <option value="dateA">Date (Ascending)</option>
					        <option value="dateD">Date (Descending)</option>
					    </select>
					    <span className="select-arrow"></span>
						</div>
						{this.state.events.map((event, idx) => (
							<Event event={event} key={idx}/>
						))}
				</div>
				:
				<div>
					<h4>No results found. Please try another search.</h4>
				</div>
			}
			</div>
		)
	}
}

const mapStateToProps = state => {
  return {
    events: state.events,
    searchParams: state.searchParams,
    eventsLoading: state.eventsLoading
  }
}

const compareStartTimeDesc = (a,b) => {
  if (a.startTime.dateTime > b.startTime.dateTime)
    return -1;
  if (a.startTime.dateTime < b.startTime.dateTime)
    return 1;
  return 0;
}

const compareStartTimeAsc = (a,b) => {
  if (a.startTime.dateTime < b.startTime.dateTime)
    return -1;
  if (a.startTime.dateTime > b.startTime.dateTime)
    return 1;
  return 0;
}

const compareName = (a,b) => {
  if (a.name < b.name)
    return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}

const removeEarlyEvents = (arr, params) => {
	let removeArr = [];
	let startDate = moment(params.startDate).format('YYYY-MM-DD 00:00:00');

	for (let i = 0; i < arr.length; i++){
		if (arr[i].startTime.dateTime < startDate){
			removeArr.push(i);
		}
	}

	let newArr = arr;
	let removed = 0;
	for (let i = 0; i < removeArr.length; i++){
		newArr.splice(removeArr[i]-removed, 1);
		removed += 1;
	}
	return newArr;
}

export default connect(mapStateToProps)(Results);

