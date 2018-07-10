import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';

import compose from '../../util/compose';
import ratingPresets from './rating-presets'; 

import './RatingPresetSection.scss';

class RatingPresetSection extends Component {
  getPillStyle = (preset) => ({
    backgroundColor: preset.bgColor,
    color: preset.textColor,
  })

  render() {
    return (
      <div className="rating-preset-section-container">
        {
          ratingPresets.map((preset, index) => (
            <div
              key={index}
              className="preset-pill"
              style={this.getPillStyle(preset)}
              onClick={() => this.props.setRatings(preset.ratings)}
            >
              <span>{preset.title}</span>
            </div>
          ))
        }
      </div>
    )
  }
}

RatingPresetSection.propTypes = {
  setRatings: PropTypes.func.isRequired,
}

export default compose(
  inject(stores => ({
    setRatings: stores.ratingStore.setRatings,
  }))
)(RatingPresetSection);
