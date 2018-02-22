import React, {Component} from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: null
    }
  }

  componentDidMount() {

    this.setState({event: this.props.currentEvent}, () => {
      this.createMap();
    });
       
  }

  createMap() {
    let map = new window.google.maps.Map(this.map, {
      zoom: 15,
      center: { lat: this.state.event.location.latitude, lng: this.state.event.location.longitude }
    });

    let marker = new window.google.maps.Marker({
      position: { lat: this.state.event.location.latitude, lng: this.state.event.location.longitude },
      map: map
    }); 
  }


  render() {
    let dayOfWeek, start_date, end_date, gcalLink;
    if (this.state.event) {
      dayOfWeek = new Date(this.state.event.startTime.dateTime).getDay();
      start_date = formatCalendarDate(this.state.event.startTime.dateTime);
      end_date;
      if (this.state.event.endTime.dateTime) {
        end_date = formatCalendarDate(this.state.event.endTime.dateTime)
      } else {
        end_date = start_date;
      }
    
      gcalLink = 'https://calendar.google.com/calendar/r/eventedit?dates=' + start_date + '/' + end_date + '&text=' + this.state.event.name + 
      '&location=' + this.state.event.location.address + ' ' + this.state.event.location.city + ' ' + this.state.event.location.state + '&sf=true&output=xml';
    }
    return (
      <div className='card'>
        {this.state.event ?
          <div>
            <p className='back'><button className='btn back' onClick={() => this.props.history.goBack()}>Go back</button></p>
            <div className='large-8 columns'>
              <a href={this.state.event.url} target='_blank' rel='noopener noreferrer'><h2>{this.state.event.name}</h2></a>
              <h5>{moment(dayOfWeek, 'd').format('ddd') + ' ' + moment(this.state.event.startTime.dateTime.substring(0, 10), 'YYYY-MM-DD').format('MMM DD, YYYY') + ' ' +
                    moment(this.state.event.startTime.dateTime.substring(11, 19), 'HH:mm:ss').format('h:mm a')}</h5>
              <a href={gcalLink} target='_blank' rel='noopener noreferrer'><button className='btn' onClick={ () => {console.log(gcalLink);}}><div className='icon-sysicon-calendar icon'></div>Add to Calendar</button></a>
              <p>{this.state.event.descrip}</p>
              <h6>{this.state.event.location.name}</h6>
              <h6>{this.state.event.location.address + ' ' + this.state.event.location.city + ' ' + this.state.event.location.state}</h6>
              <br />
              <a href={this.state.event.url} target='_blank' rel='noopener noreferrer'><button className='btn'><div className='icon-util-moreinfo icon'></div>More Info & Get Tickets</button></a>
            </div>
          </div>
        : <p>Loading...</p>
      }
        <div className='large-4 columns'>
          <div id="map" ref={map => this.map=map}></div>
        </div>
        
      </div>
    )
  }
}

const formatCalendarDate = (str) => {
  let newStr = str.replace(/-/, '');
  newStr = newStr.replace(/-/, '');
  newStr = newStr.replace(/:/, '');
  newStr = newStr.replace(/:/, '');
  newStr = newStr.replace(/ /, 'T');
  return newStr;
}

const mapStateToProps = state => {
  return {
    events: state.events,
    savedEvents: state.savedEvents,
    currentEvent: state.currentEvent
  }
}

export default connect(mapStateToProps)(EventDetails);