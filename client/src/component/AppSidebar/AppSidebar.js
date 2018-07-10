import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';

import compose from '../../util/compose';
import AddRatingSection from '../AddRatingSection';
import RatingPresetSection from '../RatingPresetSection';
import RatingList from '../RatingList';

import './AppSidebar.scss';

class AppSidebar extends Component {
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
        <div className="ratings-panel-section-header">
          <h4 className="panel-section-title">Ratings</h4>
          <span
            className="link-primary"
            onClick={this.props.clearRatings}
          >
            <strong>Clear All</strong>
          </span>
        </div>
        <RatingList />
      </div>
    </React.Fragment>    
  );

  render() {
    return (
      <div className="app-sidebar">
        <h1 className="app-title">
          Neo4j Netflix Recommendations
        </h1>
        <div className="panel current-user-panel">
          {this.getCurrentUserFragment()}
        </div>
        <div className="panel">
          {this.getRatingsPanelFragment()}
        </div>
      </div>
    );
  }
}

AppSidebar.propTypes = {
  clearRatings: PropTypes.func.isRequired,
}

export default compose(
  inject(stores => ({
    clearRatings: stores.ratingStore.clearRatings,
  }))
)(AppSidebar);
