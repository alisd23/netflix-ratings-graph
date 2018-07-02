import React, { Component } from 'react';

import MovieSearch from '../MovieSearch';

import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="app-sidebar">
          <MovieSearch />
        </div>
        <div className="app-graph"></div>
      </div>
    );
  }
}

export default App;
