import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StarRating from 'react-stars';
import className from 'classnames';

import ShowPoster from '../ShowPoster';

import './ShowRaterRow.scss';

class ShowRaterRow extends Component {
  render() {
    const { title, year, onRating, canEdit, currentRating } = this.props;

    const rootClasses = className({
      'show-rater-row': true,
      'disabled': !canEdit,
    });

    return (
      <div className={rootClasses}>
        <div className="show-rater-row-left">
          <ShowPoster
            title={title}
            year={year}
          />
        </div>
        <div className="show-rater-row-right">
          <div className="show-rater-row-title">
            <span>{title}</span>
          </div>
          <div className="show-rater-row-year">
            <span>{year}</span>
          </div>
          <div className="show-rater-row-rating">
            <StarRating
              key={canEdit} // Horrible hack to force star rating component to receive new edit prop
              size={18}
              half={false}
              value={currentRating}
              edit={canEdit}
              color1="#dddddd"
              onChange={onRating}
            />
          </div>
        </div>
      </div>
    );
  }
}

ShowRaterRow.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  canEdit: PropTypes.bool.isRequired,
  currentRating: PropTypes.number,
  onRating: PropTypes.func.isRequired,
}

export default ShowRaterRow;
