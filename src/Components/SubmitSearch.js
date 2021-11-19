import React from 'react';
import '../CSS/index.css';
import Results from './Results';

export default class SubmitSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            price: '',
            stops: '',
            airline: '',
            itineraries: [],
            flights: {},
        }
    }  

    parseData = () => {
        // some of these are objects so length isnt working I think. come back to this
        var pricedItinerary = this.props.results[9];
        var allSlices = this.props.results[10];
        var allSegments = this.props.results[11];
        for (var i = 0; i < pricedItinerary.length; i++) {
            var itinerary = new Map();
            var totalPrice = pricedItinerary[i].pricingInfo.totalFare; 
            itinerary.set('Total Price' , totalPrice);
            var slices = pricedItinerary[i].slice;
            for (var j = 0; j < slices.length; j++) {
                var sliceId = slices[j].uniqueSliceId;
            }
            for (var k = 0; k < allSlices.length; k++) {
                if (sliceId === allSlices[k].uniqueSliceId) {
                var segments = allSlices[k].segment;
                }
                if (segments.length === 2) {
                    itinerary.set('Number of Legs', 2);
                    var segId1 = segments[0].uniqueSegId;
                    var segId2 = segments[1].uniqueSegId;
                } 
                else if (segments.length === 1) {
                    itinerary.set('Number of Legs', 1);
                    var segId = segments[0].uniqueSegId;
                }
            }
            for (var m = 0; m < allSegments.length; m++) {
                if (segId1 === allSegments[m].uniqueSegId) {
                    var arrivalDateTime1 = allSegments[m].arrivalDateTime;   
                    var departureDateTime1 = allSegments[m].departureDateTime;  
                    itinerary.set('Departure Date 1' , departureDateTime1);
                    itinerary.set('Arrival Date 1' , arrivalDateTime1); 
                }
                if (segId2 === allSegments[m].uniqueSegId) {
                    var arrivalDateTime2 = allSegments[m].arrivalDateTime;   
                    var departureDateTime2 = allSegments[m].departureDateTime; 
                    itinerary.set('Departure Date 2' , departureDateTime2);
                    itinerary.set('Arrival Date 2' , arrivalDateTime2);  
                }
                else if (segId === allSegments[m].uniqueSegId) {
                    var arrivalDateTime = allSegments[m].arrivalDateTime;   
                    var departureDateTime = allSegments[m].departureDateTime; 
                    itinerary.set('Departure Date' , departureDateTime);
                    itinerary.set('Arrival Date' , arrivalDateTime);  
                }
            }
            this.state.itineraries.push(itinerary);
        }
    }

    render() {
        return (
            <div className="flex justify-center py-6">
                <button 
                className="btn btn-blue"
                type="submit"
                onClick={this.props.handleSubmit}>
                Show Me Flights</button>
                {this.props.isSubmitted ?
                <Results 
                itineraries = {this.state.itineraries}
                parseData = {this.parseData}
                />
                : null}
            </div>
        );
    }
}