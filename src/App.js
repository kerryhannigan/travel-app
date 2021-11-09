//import './CSS/App.css';
import React, { Component } from 'react';
import axios from 'axios';
import './CSS/index.css';
import Header from './Components/Header';
import Form from './Components/Form';
//import Results from './Components/Results';

class App extends Component{
  constructor(props) {
    super(props);

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
      destinationCodes: [],
      destinationCode: '',
      destPlaces: [],
      origPlaces: [],
      showDestinationSearch: false,
      showButton: false,
      selected: '' 
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
          var url = `https://priceline-com-provider.p.rapidapi.com/v1/flights/locations`
          if (this.state.origin.length > 0) {
              axios.get(url, 
                  {
                      params: {
                          name: this.state.origin
                      },
                      headers: {
                          'x-rapidapi-host': 'priceline-com-provider.p.rapidapi.com',
                          'x-rapidapi-key': process.env.REACT_APP_API_KEY
                      }
                  })
                  .then(res => {
                      const origPlaces = res.data;
                      let originNames = []; 
                      let originCodes = [];
                      for (let i = 0; i < origPlaces.length; i++) { 
                          originNames[i] = origPlaces[i].itemName; 
                          originCodes[i] = origPlaces[i].id; 
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
        var url = `https://priceline-com-provider.p.rapidapi.com/v1/flights/locations`
        if (this.state.destination.length > 0) {
            axios.get(url, 
                {
                    params: {
                        name: this.state.destination
                    },
                    headers: {
                        'x-rapidapi-host': 'priceline-com-provider.p.rapidapi.com',
                        'x-rapidapi-key': process.env.REACT_APP_API_KEY
                    }
                })
                .then(res => {
                    const destPlaces = res.data;
                    let destinationNames = []; 
                    let destinationCodes = [];
                    for (let i = 0; i < destPlaces.length; i++) { 
                        destinationNames[i] = destPlaces[i].itemName; 
                        destinationCodes[i] = destPlaces[i].id; 
                    }
                      this.setState({ destinationNames });
                      this.setState({ destinationCodes });
                      this.setState({ destPlaces })
                  });
                  event.preventDefault();
          }
      }, 500)
  }

  originSelected = (event) => {
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
                  showButton: false,
                  destination: ''
              })
          }    
      }
  }

  destinationSelected = (event) => {
      this.setState({
          destination:event.target.value
      })
      // get the airport code
      if (this.state.destination.toLowerCase !== 'anywhere')
      {
          for (let i = 0; i < this.state.destinationNames.length; i++)
          {
              if (this.state.destinationNames[i] === event.target.value)
              {
                  this.setState({
                      destinationCode: this.state.destinationCodes[i],
                      showButton: true
                  })
              }
          }
      }
      if (event.target.value === '')  
      {
          this.setState({
              showButton: false
          })
      }
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
            location_departure: this.state.originCode,
            date_departure: '2021-12-03',
            class_type: 'ECO',
            location_arrival: this.state.destinationCode,
            itinerary_type: 'ONE_WAY',
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
        <div>
        <Header />
        <Form   
            handleOriginChange={this.handleOriginChange}
            handleDestinationChange={this.handleDestinationChange}
            originSelected={this.originSelected}
            destinationSelected={this.destinationSelected}
            handleSubmit={this.handleSubmit}
            destinationNames={this.state.destinationNames}
            originNames={this.state.originNames}
            flights={this.state.flights}
            origin={this.state.origin}
            originCodes={this.state.originCodes}
            originCode={this.state.originCode}
            destination={this.state.destination}
            destinationCodes={this.state.destinationCodes}
            destinationCode={this.state.destinationCode}
            destPlaces={this.state.destPlaces}
            origPlaces={this.state.origPlaces}
            showDestinationSearch={this.state.showDestinationSearch}
            showButton={this.state.showButton}
        />
        </div>
    );
  }
}


export default App;
