import React from 'react';
import '../CSS/index.css';

export default class DestSearch extends React.Component {
    render() {
        return (
            <div>
                <label id="default" className="text-gray-700 select-none font-medium">Destination</label>
                <input
                id="default"
                type="text"
                list="places-list"
                value={this.props.destination}
                onKeyPress={this.props.handleInputChange}
                onChange={this.props.handleDestinationSelect}
                placeholder="Enter a City or Airport"
                className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
                <datalist id="places-list">
                    {this.props.placeNames.map((item, key) =>
                    <option key={key} value={item} />
                    )}
                </datalist>
            </div>
        );
    }
}