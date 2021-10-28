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
                      if (event.target.value.toLowerCase() === 'anywhere')
                      {
                          destinationNames.push('Anywhere')
                      }
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
      else 
      {
          this.setState({
              destinationCode: 'anywhere',
              showButton: true,
          })
      }
      if (event.target.value === '')  
      {
          this.setState({
              showButton: false
          })
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
      <div className="App">
      <div className="content">
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
    </div>
    );
  }
}


export default App;
