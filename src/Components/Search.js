// search will manage state for calendar, origin search, destination search, and search components

import React from 'react';
import Calendar from './Calendar';
import { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import moment from 'moment';
import axios from 'axios';
import DestSearch from './DestSearchBar';
import OriginSearch from './OriginSearchBar';
import SubmitSearch from './SubmitSearch';
import '../CSS/index.css';

export default class Search extends React.Component {
    static defaultProps = {
        numberOfMonths: 1,
      };

    constructor(props) {
        super(props);
        this.state = {
            from: undefined,
            to: undefined,
            outboundDate: '',
            inboundDate: '',
            pricedItineraries: [],
            results: [],
            placeNames: [],
            origin: '',
            destination: '',
            airportCodes: [], 
            showDestinationSearch: false,
            showButton: false,
            isSubmitted: false,
            itineraries: [],
            submissions: 0,
        }
    }

    handleDayClick = (day, {selected, disabled}) => {
        if (disabled) {
            // return nothing, day is disabled
            return;
        }
        const range = DateUtils.addDayToRange(day, this.state);
        this.setState(range);
        this.setState ({
            outboundDate: (moment(range.from).format('YYYY-MM-DD')),
            inboundDate: (moment(range.to).format('YYYY-MM-DD'))
        })
    }

    handleResetClick = () => {
        this.setState ({
            from: undefined,
            to: undefined
        })
    }

    timeout = null

    handleInputChange = (event) => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => 
        {
          this.getPlacesList(event.target.value)
          event.preventDefault();
        }, 500)
    }
  
    getPlacesList = (searchValue) => { 
      var url = `https://priceline-com-provider.p.rapidapi.com/v1/flights/locations`
      if (searchValue.length > 3) {
          axios.get(url, 
          {
              params: {
                  name: searchValue
              },
              headers: {
                  'x-rapidapi-host': 'priceline-com-provider.p.rapidapi.com',
                  'x-rapidapi-key': process.env.REACT_APP_API_KEY
              }
          })
          .then(res => {
              const places = res.data;
              let placeNames = [];
              for (let i = 0; i < places.length; i++) { 
                  placeNames[i] = places[i].displayName;  
              }
                this.setState({ placeNames }); // store this to list the location names in dropdown 
                this.setState({ results: places }); // store this for accessing the airport code
          });
        }
    }
  
    handleOriginSelect = (event) => {
      this.setState({
          origin : event.target.value,
      })
      this.getAirportCode(event.target.value)
      if (event.target.value === '') {
        this.setState({
            showDestinationSearch: false,
            showButton: false
        })
      }
    }

    handleDestinationSelect = (event) => {
        this.setState({
            destination : event.target.value,
        })
        this.getAirportCode(event.target.value)
        if (event.target.value === '') {
            let temp = []
            temp[0] = this.state.airportCodes[0];
            temp[1] = '';
            this.setState({
                showButton: false,
                airportCodes: temp,
            })
        }
    }
  
    getAirportCode = (name) => { // name is search term passed from onchange event
        let temp = this.state.airportCodes;
        for (let i = 0; i < this.state.placeNames.length; i++)
        {
            if (this.state.placeNames[i] === name)
            {
                temp.push(this.state.results[i].id);
                this.setState({
                    airportCodes: temp,
                    showDestinationSearch: true,
                })
                this.clearState()
            }
            if (this.state.airportCodes.length === 2) {
                this.setState({
                    showButton: true
                })
            }
        }
    }

    clearState = () => {
        this.setState({
            placeNames: [],
            results: [],
        })
    }

    handleSubmit = (event) => {
        var url = `https://priceline-com-provider.p.rapidapi.com/v1/flights/search`
        axios.get(url, 
        {
          headers: {
              'x-rapidapi-host': 'priceline-com-provider.p.rapidapi.com',
              'x-rapidapi-key': process.env.REACT_APP_API_KEY
          },
          params: {
              sort_order: 'PRICE',
              location_departure: this.state.airportCodes[0],
              itinerary_type: 'ROUND_TRIP',
              date_departure: this.state.outboundDate,
              date_departure_return: this.state.inboundDate,
              class_type: 'ECO',
              location_arrival: this.state.airportCodes[1],
          }
        })
        .then(res => {
            let results = res.data;
            results = (Object.values(results)); 
            this.setState({ results }, () => { this.parseData() }); 
        });
        this.setState ({
            isSubmitted: true,
        });
        event.preventDefault();
    }

    parseData = () => { // we'll get the 5 cheapest itineraries with one or two legs
        var pricedItinerary = this.state.results[9];
        var allSlices = this.state.results[10];
        var allSegments = this.state.results[11];
        for (var i = 0; i < 5; i++) {
            var totalPrice = pricedItinerary[i].pricingInfo.totalFare; // get the price
            var id = pricedItinerary[i].id;
            var slices = pricedItinerary[i].slice;
            for (var j = 0; j < slices.length; j++) {
                var sliceId = slices[j].uniqueSliceId; // get the slice id
            }
            for (var k = 0; k < allSlices.length; k++) {
                if (sliceId === allSlices[k].uniqueSliceId) { // use slice id to get the segments
                    var segments = allSlices[k].segment;
                    if (segments.length === 2) {
                        var numberOfLegs = 2;
                        var segId1 = segments[0].uniqueSegId; // store the unique segment ids
                        var segId2 = segments[1].uniqueSegId;
                    } 
                    else if (segments.length === 1) {
                        numberOfLegs = 1;
                        var segId = segments[0].uniqueSegId;
                    }
                }
            }
            for (var m = 0; m < allSegments.length; m++) { // loop through the segments, match up the segment ids, get the date/times
                if (segId1 === allSegments[m].uniqueSegId) {
                    var arrivalDateTime1 = allSegments[m].arrivalDateTime;   
                    var departureDateTime1 = allSegments[m].departDateTime;  
                }
                if (segId2 === allSegments[m].uniqueSegId) {
                    var arrivalDateTime2 = allSegments[m].arrivalDateTime;   
                    var departureDateTime2 = allSegments[m].departDateTime; 
                }   
                else if (segId === allSegments[m].uniqueSegId) {
                    arrivalDateTime1 = allSegments[m].arrivalDateTime;   
                    departureDateTime1 = allSegments[m].departDateTime; 
                }
            }
            if (segments.length === 2) {
                var itinerary = {"Price": totalPrice, "ID": id, "Departure_Date_1": departureDateTime1, "Arrival_Date_1": arrivalDateTime1, "Departure_Date_2": departureDateTime2, "Arrival_Date_2": arrivalDateTime2, "Number_of_Legs": numberOfLegs};
                this.state.itineraries.push(itinerary);
            }
            else if (segments.length === 1) {
                itinerary = {"Price": totalPrice, "ID": id, "Departure_Date_1": departureDateTime1, "Arrival_Date_1": arrivalDateTime1, "Number_of_Legs": numberOfLegs};
                this.state.itineraries.push(itinerary);
            }
        }
    }


    render () {
        const { from, to } = this.state;
        const modifiers = { start: from, end: to, disabled: { before: new Date() } };
        return (
            <div>
                <div className="bg-green-50">
                <div className="flex justify-center">
                <div className="py-2">
                <div className="flex flex-col w-64 space-y-2">
                <label id="default" className="text-gray-700 select-none font-medium">Select Your Travel Dates</label>
                <Calendar 
                handleDayClick = {this.handleDayClick}
                handleResetClick = {this.handleResetClick}
                getInitialState = {this.getInitialState}
                state = {this.state}
                modifiers = {modifiers}
                selectedDays = {[from, { from, to }]}
                inboundDate = {this.state.inboundDate}
                outboundDate = {this.state.outboundDate}
                />
                <OriginSearch 
                handleInputChange = {this.handleInputChange}
                handleOriginSelect = {this.handleOriginSelect}
                placeNames = {this.state.placeNames}
                />
                {this.state.showDestinationSearch?
                    <DestSearch 
                    handleInputChange = {this.handleInputChange}
                    handleDestinationSelect = {this.handleDestinationSelect}
                    placeNames = {this.state.placeNames}/>
                :null}
                {this.state.showButton?
                    <SubmitSearch 
                    handleSubmit = {this.handleSubmit}
                    itineraries = {this.state.itineraries}
                    isSubmitted = {this.state.isSubmitted}
                    />
                :null}
                {this.state.itineraries.map((value) => 
                    (<div key={value.ID}>
                        <p>Total price (including fees): ${value.Price}</p>
                        <p>Departure Time: {value.Departure_Date_1}</p>
                        <p>Arrival Time: {value.Arrival_Date_1}</p><br></br>
                    </div>)
                )}
                </div> 
                </div>
                </div>
                </div>
            </div>
        )
    }
}

