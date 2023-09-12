// src/App.js

import React from 'react';
import './App.css';
import FileUpload from './FileUpload';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="header">
          <h1 className="title">Excel to JSON Converter</h1>
        </div>
      </header>
      <main>
        <FileUpload />
      </main>
    </div>
  );
}

export default App;
