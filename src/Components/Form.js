import React, { Component } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import '../CSS/index.css';

export class Form extends Component {

    render() {
        return (
            <form
            className="bg-green-50" 
            onSubmit={this.props.handleSubmit}>
                <div className="flex justify-center">
                <div className="py-2">
                    <div className="flex flex-col w-64 space-y-2">
                    <label id="default" className="text-gray-700 select-none font-medium">Departure Date</label>
                        <DayPickerInput />
                    </div>
                </div>
                </div>
                <div className="flex justify-center">
                <div className="py-2">
                    <div className="flex flex-col w-64 space-y-2">
                    <label id="default" className="text-gray-700 select-none font-medium">Return Date</label>
                        <DayPickerInput />
                    </div>
                </div>
                </div>
                <div className="flex justify-center">
                <div className="py-2">
                    <div className="flex flex-col w-64 space-y-2">
                        <label id="default" className="text-gray-700 select-none font-medium">Origin</label>
                        <input
                        id="default"
                        type="text"
                        list="places-list"
                        value={this.props.origin}
                        onKeyPress={this.props.handleOriginChange}
                        onChange={this.props.originSelected}
                        placeholder="Enter a City or Airport"
                        className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        />
                        <datalist id="places-list">
                            {this.props.originNames.map((item, key) =>
                            <option key={key} value={item} />
                            )}
                        </datalist>
                    </div>
                </div>
                </div>
                {
                this.props.showDestinationSearch?
                    <div className="flex justify-center">
                    <div className="pb-64 pt-2">
                        <div className="flex flex-col w-64 space-y-2">
                            <label id="default" className="text-gray-700 select-none font-medium">Destination</label>
                            <input
                            id="default"
                            type='text' 
                            list="places-list2"
                            value={this.props.destination}
                            onKeyPress={this.props.handleDestinationChange}
                            onChange={this.props.destinationSelected}
                            placeholder="City, Airport, or 'anywhere'"
                            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            />
                            <datalist id="places-list2">
                                {this.props.destinationNames.map((item, key) =>
                                <option key={key} value={item} />
                                )}
                            </datalist>
                        </div>
                    </div>
                    </div>
                :<div
                className= "py-24">
                </div>
                }
                {
                this.props.showButton?
                    <div className="flex justify-center py-6">
                        <button 
                        className="btn btn-blue"
                        type="submit">Show Me Flights</button>
                    </div>
                :null
                }
            </form>
        )
    }
}

export default Form
