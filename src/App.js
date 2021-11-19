import React, { Component } from 'react';
import './CSS/index.css';
import Header from './Components/Header';
import Search from './Components/Search';
import 'react-day-picker/lib/style.css';

class App extends Component {
    render () {
        return (
            <div>
                <Header />
                <Search />
            </div>
        )
    }
}

export default App;