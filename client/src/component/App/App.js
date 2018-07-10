import React, { Component } from 'react';

import AppSidebar from '../AppSidebar';
import AppMain from '../AppMain';

import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="app">
        <AppSidebar />
        <AppMain />
      </div>
    );
  }
}

export default App;
