import React, { Component } from 'react';

import ShowRatingSection from '../ShowRatingSection';
import RatingList from '../RatingList';

import './App.scss';

class App extends Component {
  onAddRating = () => {

  }

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
      <div className="panel-section">
        <h3 className="panel-section-title">Add Show Rating</h3>
        <ShowRatingSection onAddRating={this.onAddRating} />
      </div>
      <div className="panel-section">
        <h3 className="panel-section-title">Ratings</h3>
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
          <div className="panel">
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
