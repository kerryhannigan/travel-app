import React from 'react';
import '../CSS/index.css';

export default class SubmitSearch extends React.Component { 
    render() {
        return (
            <div>
            <form
            onSubmit = {this.props.handleSubmit}>
            <div className="flex justify-center py-4">
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

