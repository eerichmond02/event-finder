import React, { Component } from 'react';
import Event from './Event';
import { connect } from 'react-redux';

class Results extends Component {
	constructor(props){
		super(props);
		this.state = {
			events: [],
			sort: 'default'
		}
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
    this.setState({[e.target.name]: e.target.value}, () => {
    	let sortedArr;
    	switch(this.state.sort){
    		case 'name':
    			console.log('name');
    			sortedArr = this.state.events.sort((a,b) => {
    				return compareName(a,b);
    			})
    			break;
    		case 'dateA':
    			console.log('dateA');
    			sortedArr = this.state.events.sort((a,b) => {
    				return compareStartTimeAsc(a,b);
    			})
    			break;
    		case 'dateD':
    			console.log('dateD');
    			sortedArr = this.state.events.sort((a,b) => {
    				return compareStartTimeDesc(a,b);
    			})
    			break;
    	}
    	console.log(sortedArr);
    	this.setState({events: sortedArr});
    })
  }

  componentWillReceiveProps(nextProps) {
  	if (this.state.events !== nextProps.events) {
  		console.log('receiving props...');
  		this.setState({events: nextProps.events});
  	}
  }

  componentDidMount() {
  	this.setState({events: this.props.events});
  	console.log('component mounted: ' + this.props.events);
  }

	render() {
		return (
			<div>
				<h2>Search Results</h2>
				<div className="uitk-select md-text-field with-floating-label">
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
		)
	}
}

const mapStateToProps = state => {
  return {
    events: state.events
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

export default connect(mapStateToProps)(Results);

