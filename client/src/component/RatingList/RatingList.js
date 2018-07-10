import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';

import compose from '../../util/compose';
import ShowRaterRow from '../ShowRaterRow';

import './RatingList.scss';

class RatingList extends Component {
  getListFragment = () => {
    const { ratings, ratingsLoading, ratingsError, updateRating, deleteRating, loadRatings } = this.props;    

    if (ratingsLoading) {
      return (
        <div className="rating-list-empty">
          <div className="spinner spinner-md"></div>
        </div>
      )
    }
    if (ratingsError) {
      return (
        <div className="rating-list-empty">
          <span>{ratingsError}</span>
          <span
            className="link-primary"
            onClick={loadRatings}
          >
            Fetch ratings again
          </span>
        </div>
      )
    }
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
      >
        <i
          className="material-icons md-sm delete-rating"
          onClick={() => deleteRating(show)}
        >
          cancel
        </i>
      </ShowRaterRow>
    ))
  }

  render() {
    return (
      <div className="rating-list-container">
        {this.getListFragment()}
      </div>
    )
  }

  componentDidMount() {
    // Fetch initial ratings from the server
    this.props.loadRatings();
  }
}

RatingList.propTypes = {
  updateRating: PropTypes.func.isRequired,
  deleteRating: PropTypes.func.isRequired,
  loadRatings: PropTypes.func.isRequired,
  ratings: PropTypes.arrayOf(PropTypes.object).isRequired,
  ratingsLoading: PropTypes.bool.isRequired,
  ratingsError: PropTypes.string,
}

export default compose(
  inject(({ ratingStore }) => ({
    updateRating: ratingStore.updateRating,
    deleteRating: ratingStore.deleteRating,
    loadRatings: ratingStore.loadRatings,
    ratings: ratingStore.ratings,
    ratingsLoading: ratingStore.ratingsLoading,
    ratingsError: ratingStore.ratingsError,
  }))
)(RatingList);
