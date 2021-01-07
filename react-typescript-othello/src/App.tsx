import React from 'react';
import logo from './logo.svg';
import './App.css';
import './Othello.css';
import GameComponent from './GameComponent';


function App() {
  return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React Othello</h2>
        </div>
        <p className="App-intro">
            <GameComponent></GameComponent>
        </p>
      </div>
  );
}

export default App;
