import React from 'react';
import Calendar from './Calendar';
import 'react-day-picker/lib/style.css';
import moment from 'moment';
import axios from 'axios';
import DestSearch from './DestSearchBar';
import OriginSearch from './OriginSearchBar';
import SubmitSearch from './SubmitSearch';
import '../CSS/index.css';
import Results from './Results';

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDay: undefined,
            outboundDate: '',
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
        if (selected) {
            this.setState({
                selectedDay: undefined 
            });
            return;
        }
        this.setState ({
            selectedDay: day,
            outboundDate: moment(day).format('YYYY-MM-DD'),
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
            isSubmitted: false,
            showButton: false,
            airportCodes: [],
        })
      }
    }

    handleDestinationSelect = (event) => {
        this.setState({
            destination : event.target.value,
            showButton  : true,
        })
        this.getAirportCode(event.target.value)
        if (event.target.value === '') {
            let temp = []
            temp[0] = this.state.airportCodes[0];
            this.setState({
                showButton: false,
                isSubmitted: false,
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
              itinerary_type: 'ONE_WAY',
              date_departure: this.state.outboundDate,
              class_type: 'ECO',
              location_arrival: this.state.airportCodes[1],
          }
        })
        .then(res => {
            let results = res.data;
            results = (Object.values(results)); 
            this.setState({ results }, () => { this.parseData() }); 
        });
        event.preventDefault();
    }

    parseData = () => { // we'll get the 5 cheapest itineraries with one or two legs
        var pricedItinerary = this.state.results[9];
        var allSlices = this.state.results[10];
        var allSegments = this.state.results[11];
        var arrivalDateTime1 = '';
        var departureDateTime1 = '';
        var departureDateTime2 = '';
        var arrivalDateTime2 = '';
        var segId = '';
        var segId1 = '';
        var segId2 = '';
        if (pricedItinerary != null && pricedItinerary[0].pricingInfo !== undefined)
        {
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
                            segId1 = segments[0].uniqueSegId; // store the unique segment ids
                            segId2 = segments[1].uniqueSegId;
                        } 
                        else if (segments.length === 1) {
                            segId = segments[0].uniqueSegId;
                        }
                    }
                }
                for (var m = 0; m < allSegments.length; m++) { // loop through the segments, match up the segment ids, get the date/times
                    if (segId1 === allSegments[m].uniqueSegId) {
                        arrivalDateTime1 = allSegments[m].arrivalDateTime;   
                        departureDateTime1 = allSegments[m].departDateTime; 
                        var origin1 = allSegments[m].origAirport;
                        var destination1 = allSegments[m].destAirport; 
                    }
                    if (segId2 === allSegments[m].uniqueSegId) {
                        arrivalDateTime2 = allSegments[m].arrivalDateTime;   
                        departureDateTime2 = allSegments[m].departDateTime; 
                        var origin2 = allSegments[m].origAirport;
                        var destination2 = allSegments[m].destAirport;
                    }   
                    else if (segId === allSegments[m].uniqueSegId) {
                        arrivalDateTime1 = allSegments[m].arrivalDateTime;   
                        departureDateTime1 = allSegments[m].departDateTime; 
                        origin1 = allSegments[m].origAirport;
                        destination1 = allSegments[m].destAirport;
                    }
                }
                if (segments.length === 2 && this.state.itineraries.length < 5) {
                    var itinerary = {"Price": totalPrice, "ID": id, "Departure_Date_1": departureDateTime1, "Arrival_Date_1": arrivalDateTime1, "Departure_Date_2": departureDateTime2, "Arrival_Date_2": arrivalDateTime2, "Origin1" : origin1, "Destination1" : destination1, "Origin2" : origin2, "Destination2" : destination2};
                    this.state.itineraries.push(itinerary);
                }
                else if (segments.length === 1 && this.state.itineraries.length < 5) {
                    itinerary = {"Price": totalPrice, "ID": id, "Departure_Date_1": departureDateTime1, "Arrival_Date_1": arrivalDateTime1, "Origin1" : origin1, "Destination1" : destination1, "Origin2" : null, "Destination2" : null};
                    this.state.itineraries.push(itinerary);
                }
            }
        }
        else
        {
            console.log("No results");
        }
        this.setState({
            itineraries: this.state.itineraries,
        }, () => {this.setState({isSubmitted: true})});

    }

    render () {
        return (
            <div>
                <div className="bg-green-50">
                <div className="flex justify-center">
                <div className="py-2">
                <div className="flex flex-col w-96 space-y-2">
                <center>
                <label id="default" className="text-gray-700 select-none font-medium">Select Your Travel Date</label>
                <Calendar 
                handleDayClick = {this.handleDayClick}
                handleResetClick = {this.handleResetClick}
                selectedDays = {this.state.selectedDay}
                />
                </center>
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
                    />
                :null}
                {this.state.isSubmitted?
                    <Results
                    itineraries = {this.state.itineraries}
                    />
                :null}
                </div> 
                </div>
                </div>
                </div>
            </div>
        )
    }
}

