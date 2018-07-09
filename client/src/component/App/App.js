import React, { Component } from 'react';

import AddRatingSection from '../AddRatingSection';
import RatingPresetSection from '../RatingPresetSection';
import RatingList from '../RatingList';

import './App.scss';

class App extends Component {
  getCurrentUserFragment = () => (
    <div className="panel-section">
      <span className="panel-section-title">
        <span>Current User: </span>
        <strong className="text-primary">0000</strong>
      </span>
    </div>
  );

  getRatingsPanelFragment = () => (
    <React.Fragment>
      <div className="panel-section add-ratings-section">
        <h4 className="panel-section-title">Add Show Ratings</h4>
        <AddRatingSection />
        <h5 className="panel-section-title rating-presets-title">Rating Presets</h5>
        <RatingPresetSection  />
      </div>
      <div className="panel-section">
        <h4 className="panel-section-title">Ratings</h4>
        <RatingList />
      </div>
    </React.Fragment>    
  );

  render() {
    return (
      <div className="app">
        <div className="app-sidebar">
          <h1 className="app-title">
            Netflix Ratings Graph Demo
          </h1>
          <div className="panel current-user-panel">
            {this.getCurrentUserFragment()}
          </div>
          <div className="panel">
            {this.getRatingsPanelFragment()}
          </div>
        </div>
        <div className="app-main"></div>
      </div>
    );
  }
}

export default App;
