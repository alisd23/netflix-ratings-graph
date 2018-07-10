import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';

import ShowRecommmendationRow from '../ShowRecommendationRow';
import compose from '../../util/compose';

import './Recommendations.scss';

class Recommendations extends Component {
  getRecommendationsListFragment = () => {
    // We assume there is at least 1 recommendation at this point
    const maxScore = this.props.recommendations[0].score;

    return (
      <div className="recommendation-list-wrapper">
        <div className="recommendation-list-toolbar">
          <button
            className="recommendation-reload"
            onClick={this.props.loadRecommendations}
          >
            Reload Recommendations
          </button>
        </div>
        <div className="recommendation-list">
          {
            this.props.recommendations.map(({ show, score }) => (
              <ShowRecommmendationRow
                key={show.id}
                title={show.title}
                year={show.year}
                score={score / maxScore * 100}
              />
            ))
          }
        </div>
      </div>
    )
  }

  render() {
    const { recommendations, loading, error, loadRecommendations } = this.props;

    if (loading) {
      return (
        <div className="recommendation-list-empty">
          <div className="spinner spinner-lg"></div>
          <span>This might take a while</span>
        </div>
      );
    }
    if (error) {
      return (
        <div className="recommendation-list-empty">
          <span>{error}</span>
          <span
            className="link-primary"
            onClick={loadRecommendations}
          >
            Try again
          </span>
        </div>
      );
    }
    if (!recommendations) {
      return (
        <div className="recommendations-button-container">
          <button
            className="recommendations-button"
            onClick={loadRecommendations}
          >
            Get Recommendations
          </button>
        </div>
      );
    }
    if (recommendations.length === 0) {
      return (
        <div className="recommendation-list-empty">
          <span>No show recommendations could be fetched and I have no idea why</span>
        </div>
      );
    }

    return this.getRecommendationsListFragment();
  }
}

Recommendations.propTypes = {
  loadRecommendations: PropTypes.func.isRequired,
  recommendations: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
}

export default compose(
  inject(({ recommendationStore }) => ({
    loadRecommendations: recommendationStore.loadRecommendations,
    recommendations: recommendationStore.recommendations,
    loading: recommendationStore.recommendationsLoading,
    error: recommendationStore.recommendationsError,
  }))
)(Recommendations);
