import React, { Component } from 'react';

import ShowRater from '../ShowRater';

import './AddRatingSection.scss';

class AddRatingSection extends Component {
  render() {
    return (
      <div className="show-rating-section-container">
        <ShowRater />
        <div className="rating-presets">

        </div>
      </div>
    );
  }
}

export default AddRatingSection;
