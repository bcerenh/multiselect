import React from 'react';
import logo from './logo.svg';
import MultiSelectAutocomplete from './MultiSelectAutocomplete';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header" >
      <h1>Rick and Morty</h1>
        <MultiSelectAutocomplete />
      </header>
    </div>
  );
}


export default App;
