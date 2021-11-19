// render results
import React from "react";

export default class Results extends React.Component {
    constructor(props) {
        super(props);
        };

        componentDidMount() {   
            this.props.parseData();
        };

        render () {
            return (
                <div>
                   <p>{this.props.itineraries}</p> 
                </div>
            )
        }
    }