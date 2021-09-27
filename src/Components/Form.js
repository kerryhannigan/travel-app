import React, { Component } from 'react';
import axios from 'axios';

export class Form extends Component {


    constructor(props) {
        super(props)
    
        this.state = {
             budget: '',
             chooseBudget: '',
             city: '',
             flights: [],
             places: []
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

    // get some cities from search 
    handleCityChange = (event) => {
        this.setState({
            city: event.target.value
        })
        var url = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/`
        if (this.state.city.length > 0) { // search query must be 2 characters in length
            axios.get(url, 
                {
                    params: {
                        query: this.state.city
                    },
                    headers: {
                        'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
                        'x-rapidapi-key': 'ff58f5859cmsh50b8a3f16203297p1131d0jsn69e3d1cab9bc'
                        // in the future, don't hardcode API key into frontend 
                    }
                })
                .then(res => {
                    const places = res.data;
                    this.setState({ places });
                    console.log(places); 
                    for (let i = 0; i < places.length; i++) { // why doesn't this work?? 
                        console.log(places.Places[i].Placename);
                    }
                    console.log(places.Places[0].PlaceName); // testing access of properties, need to write loop and populate datalist using map()
                });
                event.preventDefault();
        }

    }

    // onClick ?
    handleSubmit = (event) => {
        var url = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${this.state.city}/anywhere/anytime`
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
            <form onSubmit={this.handleSubmit}>
                <div>
                    <label>Departure Airport (Enter a City, State, or Airport Code): </label>
                    <input
                    type='text' 
                    value={this.state.city}
                    onChange={this.handleCityChange}
                    />
                </div>
                <div>
                    <label>Budget: </label>
                    <input 
                    type ='text' 
                    value={this.state.budget} 
                    onChange={this.handleBudgetChange}
                    />
                </div>
                <div>
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
                </div>
                <button type="submit">Submit</button>
            </form>
        )
    }
}

export default Form


// make button say "Show me flights to anywhere, or select Enter a destination" --> "Enter a destination"
