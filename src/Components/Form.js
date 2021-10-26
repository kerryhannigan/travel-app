import React, { Component } from 'react';
import axios from 'axios';
import '../CSS/index.css';

export class Form extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             budget: '',
             chooseBudget: '',
             flights: [],
             origin: '',
             originNames: [],
             originCodes: [],
             originCode: '',
             destination: '',
             destinationNames: [],
             destinationCodes:[],
             destinationCode: '',
             destPlaces: [],
             origPlaces: [],
             showDestinationSearch: false,
             showButton: false
        }
    }

    handleBudgetChange = (event) => {
        this.setState({
            budget: event.target.value
        })
    }

    handleChooseBudgetchange = (event) => {
        this.setState({
            chooseBudget: event.target.value
        })
    }

    timeout = null

    handleOriginChange = (event) => {
        clearTimeout(this.timeout)

        this.setState({
          origin: event.target.value
        })

        this.timeout = setTimeout(() => {
            var url = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/`
            if (this.state.origin.length > 0) {
                axios.get(url, 
                    {
                        params: {
                            query: this.state.origin
                        },
                        headers: {
                            'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
                            'x-rapidapi-key': `${process.env.REACT_APP_API_KEY}`
                        }
                    })
                    .then(res => {
                        const origPlaces = res.data;
                        let temp = [];
                        let originNames = []; 
                        let originCodes = [];
                        for (let i = 0; i < origPlaces.Places.length; i++) { 
                            temp = Object.values(origPlaces.Places[i]);
                            originNames[i] = temp[1]; 
                            originCodes[i] = temp[0]; 
                        }
                        this.setState({ originNames });
                        this.setState({ originCodes });
                        this.setState({ origPlaces })
                    });
                    event.preventDefault();
            }
        }, 500)
    }

    handleDestinationChange = (event) => {
        clearTimeout(this.timeout)

        this.setState({
          destination: event.target.value
        })

        this.timeout = setTimeout(() => {
            var url = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/`
            if (this.state.destination.length > 0) {
                axios.get(url, 
                    {
                        params: {
                            query: this.state.destination
                        },
                        headers: {
                            'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
                            'x-rapidapi-key': `${process.env.REACT_APP_API_KEY}`
                        }
                    })
                    .then(res => {
                        const destPlaces = res.data;
                        let temp2 = [];
                        let destinationNames = []; 
                        let destinationCodes = [];
                        for (let i = 0; i < destPlaces.Places.length; i++) { 
                            temp2 = Object.values(destPlaces.Places[i]);
                            destinationNames[i] = temp2[1]; 
                            destinationCodes[i] = temp2[0]; 
                        }
                        this.setState({ destinationNames });
                        this.setState({ destinationCodes });
                        this.setState({ destPlaces })
                    });
                    event.preventDefault();
            }
        }, 500)
    }

    originSelected = (event) => { // onChange handler
        this.setState({
            origin:event.target.value,
        })
        // get the airport code
        for (let i = 0; i < this.state.originNames.length; i++)
        {
            if (this.state.originNames[i] === event.target.value)
            {
                this.setState({
                    originCode: this.state.originCodes[i],
                    showDestinationSearch: true
                })
            }
            else if (event.target.value === '')
            {
                this.setState({
                    showDestinationSearch: false,
                    showButton: false
                })
            }    
        }
    }

    destinationSelected = (event) => {
        this.setState({
            destination:event.target.value
        })

        // get the airport code
        for (let i = 0; i < this.state.destinationNames.length; i++)
        {
            if (this.state.destinationNames[i] === event.target.value)
            {
                this.setState({
                    destinationCode: this.state.destinationCodes[i],
                    showButton: true
                })
            }
            else if (event.target.value === '')  
            {
                this.setState({
                    showButton: false
                })
            }
        }
    }


    handleSubmit = (event) => { 
        var url = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${this.state.originCode}/${this.state.destinationCode}/anytime`
        axios.get(url, 
        {
            headers: {
                'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
                'x-rapidapi-key': `${process.env.REACT_APP_API_KEY}`
            }
        })
        .then(res => {
            const flights = res.data;
            this.setState({ flights });
            console.log(flights);
        });
        event.preventDefault();
    }   


    render() {
        return (
            <form
            className="bg-green-50" 
            onSubmit={this.handleSubmit}>
                <div className="flex justify-center">
                <div className="py-6">
                    <div className="flex flex-col w-64 space-y-2">
                        <label id="default" className="text-gray-700 select-none font-medium">Origin</label>
                        <input
                        id="default"
                        type="text"
                        list="places-list"
                        value={this.state.origin}
                        onKeyPress={this.handleOriginChange}
                        onChange={this.originSelected}
                        placeholder="Enter a City or Airport"
                        className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        />
                        <datalist id="places-list">
                            {this.state.originNames.map((item, key) =>
                                <option key={key} value={item} />
                            )}
                        </datalist>
                    </div>
                </div>
                </div>
                {
                this.state.showDestinationSearch?
                    <div className="flex justify-center">
                    <div className="py-6">
                        <div className="flex flex-col w-64 space-y-2">
                            <label id="default" className="text-gray-700 select-none font-medium">Destination</label>
                            <input
                            id="default"
                            type='text' 
                            list="places-list2"
                            value={this.state.destination}
                            onKeyPress={this.handleDestinationChange}
                            onChange={this.destinationSelected}
                            placeholder="City, Airport, or 'anywhere'"
                            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            />
                            <datalist id="places-list2">
                                {this.state.destinationNames.map((item, key) =>
                                <option key={key} value={item} />
                                )}
                            </datalist>
                        </div>
                    </div>
                    </div>
                :null
                }
                {
                this.state.showButton?
                    <div className="flex justify-center py-6">
                        <button 
                        className="btn btn-blue"
                        type="submit">Show Me Flights</button>
                    </div>
                :null
                }
{/*                 <div>
                    <label>On a budget?</label>
                </div>
                <div>
                    <button>Add a Price Range</button>
                </div> */}
            </form>
        )
    }
}

export default Form
