import './App.css';
import Navbar from './Navbar';
import Home from './Home';
import Form from './Form';
import Axios from 'axios';

function App() {

  const getFlights = () => {
    Axios.get()
  }

  return (
    <div className="App">
      <Navbar />
      <div className="content">
        <Home />
        <Form />
      </div>
    </div>
  );
}

export default App;
