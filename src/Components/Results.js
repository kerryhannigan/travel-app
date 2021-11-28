import React from "react";
import moment from "moment";

export default class Results extends React.Component {
    render() {
        return (

            this.props.itineraries.map((value) => 
                (<div key={value.ID}
                className="max-w-full bg-white flex flex-col rounded overflow-hidden shadow-lg">
                    <center>
                    <br></br>
                    <p>Total price (including fees): ${value.Price}</p>
                    <p>Departure from {value.Origin1}: {moment(value.Departure_Date_1).format('MMM Do YYYY, h:mm a')}</p>
                    <p>Arrival at {value.Destination1}: {moment(value.Arrival_Date_1).format('MMM Do YYYY, h:mm a')}</p>
                    {value.Origin2 !== null ? <p>Departure from {value.Origin2}: {moment(value.Departure_Date_2).format('MMM Do YYYY, h:mm a')}</p> : null}
                    {value.Destination2 !== null ? <p>Arrival at {value.Destination2}: {moment(value.Arrival_Date_2).format('MMM Do YYYY, h:mm a')}</p> : null}<br></br>
                    </center>
                </div>))     
                );
        
    }
}