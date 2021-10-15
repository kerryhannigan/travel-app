import React, { Component } from 'react';
import axios from 'axios';
import '../App.css'
import styles from "./Form.module.css"

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
             origPlaces: []

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
                            // this is unsafe but for the purpose of this project, it'll do 
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
                            // this is unsafe but for the purpose of this project, it'll do 
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
            origin:event.target.value
        })

        // if airport code is '', we need to get the airport code

        // get the airport code
        for (let i = 0; i < this.state.originNames.length; i++)
        {
            if (this.state.originNames[i] === event.target.value)
            {
                console.log(this.state.originNames[i])
                this.setState({
                    originCode: this.state.originCodes[i]
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
                console.log(this.state.destinationNames[i])
                this.setState({
                    destinationCode: this.state.destinationCodes[i]
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
                'x-rapidapi-key': 'ff58f5859cmsh50b8a3f16203297p1131d0jsn69e3d1cab9bc'
                // in the future, don't hardcode API key into frontend 
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
            className={styles.form} 
            onSubmit={this.handleSubmit}>
                <div>
                    <label>Origin: </label>
                </div>
                <div>
                    <input
                    type='text' 
                    list="places-list"
                    value={this.state.origin}
                    onKeyPress={this.handleOriginChange}
                    onChange={this.originSelected}
                    placeholder="Enter a City or Airport"
                    />
                    <datalist id="places-list">
                        {this.state.originNames.map((item, key) =>
                            <option key={key} value={item} />
                        )}
                    </datalist>
                </div>
                <div>
                    <label>Destination: </label>
                </div>
                <div>
                    <input
                    type='text' 
                    list="places-list2"
                    value={this.state.destination}
                    onKeyPress={this.handleDestinationChange}
                    onChange={this.destinationSelected}
                    placeholder="City, Airport, or 'anywhere'"
                    />
                    <datalist id="places-list2">
                        {this.state.destinationNames.map((item, key) =>
                            <option key={key} value={item} />
                        )}
                    </datalist>
                </div>
{/*                 <div>
                    <label>Or Select a Budget: </label>
                    <select 
                    value={this.state.chooseBudget} 
                    onChange={this.handleChooseBudgetchange}>
                        <option value="1">$100 or less</option>
                        <option value="2">$100-$200</option>
                        <option value="3">$200-$300</option>
                        <option value="4">$300-$400</option>
                        <option value="5">$400-$500</option>
                        <option value="3">$500+</option>
                    </select>
                </div> */}
                <div>
                    <button type="submit">Show Me Flights</button>
                </div>
                <div>
                    <label>On a budget?</label>
                </div>
                <div>
                    <button>Add a Price Range</button>
                </div>
            </form>
        )
    }
}

export default Form
