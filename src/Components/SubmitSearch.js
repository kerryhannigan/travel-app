import React from 'react';
import '../CSS/index.css';
import moment from 'moment';

export default class SubmitSearch extends React.Component { 

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.itineraries !== this.props.itineraries;
    }

    render() {
        return (
            <div>
            <form
            onSubmit = {this.props.handleSubmit}>
            <div className="flex justify-center py-6">
                <button 
                className="btn btn-blue"
                type="submit">
                Show Me Flights</button>
            </div>
            </form>
            </div>
        );
    }
}

