import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';

import compose from '../../util/compose';
import ShowRaterRow from '../ShowRaterRow';

import './RatingList.scss';

class RatingList extends Component {
  getListFragment = () => {
    const { ratings, updateRating, deleteRating } = this.props;    

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
    this.props.getRatings();
  }
}

RatingList.propTypes = {
  updateRating: PropTypes.func.isRequired,
  deleteRating: PropTypes.func.isRequired,
  getRatings: PropTypes.func.isRequired,
  ratings: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default compose(
  inject(stores => ({
    updateRating: stores.ratingStore.updateRating,
    deleteRating: stores.ratingStore.deleteRating,
    getRatings: stores.ratingStore.getRatings,
    ratings: stores.ratingStore.ratings,
  }))
)(RatingList);
