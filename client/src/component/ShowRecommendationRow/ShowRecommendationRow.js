import React, { Component } from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';

import ShowPoster from '../ShowPoster';

import './ShowRecommendationRow.scss';

function percentToColor(percentage) {
  let r, g, b = 0;

	if (percentage < 50) {
		r = 255;
		g = Math.round(5.1 * percentage);
	} else {
		g = 255;
		r = Math.round(510 - 5.10 * percentage);
  }

	const h = (r * 0x10000) + (g * 0x100) + (b * 0x1);
	return '#' + `000000${h.toString(16)}`.slice(-6);
}

class ShowRecommendationRow extends Component {
  getScoreBarStyles = () => {
    const { score } = this.props;
    return {
      width: `${score}%`,
      backgroundColor: percentToColor(score),
    };
  }

  render() {
    const { title, year, score } = this.props;

    const rootClasses = className({
      'show-row': true
    });

    return (
      <div className={rootClasses}>
        <div className="show-row-left">
          <ShowPoster
            title={title}
            year={year}
          />
        </div>
        <div className="show-row-right">
          <div className="show-row-title">
            <span>{title}</span>
          </div>
          <div className="show-row-year">
            <span>{year}</span>
          </div>
          <div className="recommendation-score">
            <div className="recommendation-score-bar-wrapper">
              <div
                className="recommendation-score-bar"
                style={this.getScoreBarStyles()}
              />
            </div>
            <span className="recommendation-score-value">
              {score === 100 ? score : score.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    );
  }
}

ShowRecommendationRow.propTypes = {
  title: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
}

export default ShowRecommendationRow;
