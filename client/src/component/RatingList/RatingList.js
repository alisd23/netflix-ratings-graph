import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';

import compose from '../../util/compose';
import ShowRaterRow from '../ShowRaterRow';

import './RatingList.scss';

class RatingList extends Component {
  getListFragment = () => {
    const { ratings, updateRating } = this.props;    

    if (!ratings || ratings.length === 0) {
      return (
        <div className="rating-list-empty">
          <span>No shows have been rated yet</span>
        </div>
      )
    }
    return ratings.map(({ show, score }) => (
      <ShowRaterRow
        key={show.id}
        id={show.id}
        title={show.title}
        year={show.year}
        canEdit={true}
        currentRating={score}
        onRating={newScore => updateRating(show, newScore)}
      />
    ))
  }

  render() {
    return (
      <div className="rating-list-container">
        {this.getListFragment()}
      </div>
    )
  }
}

RatingList.propTypes = {
  updateRating: PropTypes.func.isRequired,
  ratings: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default compose(
  inject(stores => ({
    updateRating: stores.ratingStore.updateRating,
    ratings: stores.ratingStore.ratings,
  }))
)(RatingList);