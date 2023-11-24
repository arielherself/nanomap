import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import UMap from "./UMap";

class App extends Component {
  render() {
    return (
      <div className="App">
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <UMap/>
          </div>
      </div>
    );
  }
}

export default App;
