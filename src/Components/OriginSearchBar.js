import React from 'react';
import '../CSS/index.css';

export default class OriginSearch extends React.Component {
    render() {
        return (
            <div>
                <label id="default" className="text-gray-700 select-none font-medium">Origin</label>
                <input
                id="default"
                type="text"
                list="places-list"
                value={this.props.origin}
                onKeyPress={this.props.handleInputChange}
                onChange={this.props.handleOriginSelect}
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