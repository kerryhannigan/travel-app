import './App.css';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Form from './Components/Form';

function App() {


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
