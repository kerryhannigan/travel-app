// search will manage state for calendar, origin search, destination search, and search components

import React, { Component } from 'react';
import Calendar from './Calendar';
import { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import moment from 'moment';
import axios from 'axios';
import DestSearch from './DestSearchBar';
import OriginSearch from './OriginSearchBar';
import SubmitSearch from './SubmitSearch';
import '../CSS/index.css';

class Search extends Component {
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
            results: {},
            placeNames: [],
            origin: '',
            destination: '',
            airportCodes: [], // [0] should be origin, [1] should be destination
            showDestinationSearch: false,
            showButton: false,
            isSubmitted: false,
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
                  //destinationCodes[i] = destPlaces[i].id; 
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
            this.setState({ results });
            console.log(results)
            console.log(results[9])
            console.log(results[9].length)
        });
        this.setState ({
            isSubmitted: true
        })
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
                selectedPlace = {this.state.selectedPlace}
                airportCode = {this.state.airportCode}
                handleInputChange = {this.handleInputChange}
                handleOriginSelect = {this.handleOriginSelect}
                placeNames = {this.state.placeNames}
                />
                {this.state.showDestinationSearch?
                    <DestSearch 
                    selectedPlace = {this.state.selectedPlace}
                    airportCode = {this.state.airportCode}
                    handleInputChange = {this.handleInputChange}
                    handleDestinationSelect = {this.handleDestinationSelect}
                    placeNames = {this.state.placeNames}/>
                :null}
                {this.state.showButton?
                    <SubmitSearch 
                    handleSubmit = {this.handleSubmit}
                    results = {this.state.results}
                    isSubmitted = {this.state.isSubmitted}
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

export default Search;