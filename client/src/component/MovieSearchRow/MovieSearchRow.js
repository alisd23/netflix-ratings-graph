import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MoviePoster from '../MoviePoster';

import './MovieSearchRow.css';

class MovieSearchRow extends Component {
  render() {
    const { title, year } = this.props;

    return (
      <div className="movie-search-row">
        <div className="movie-search-row-left">
          <MoviePoster
            title={title}
            year={year}
          />
        </div>
        <div className="movie-search-row-right">
          <div className="movie-search-row-title">
            <span>{title}</span>
          </div>
          <div className="movie-search-row-year">
            <span>{year}</span>
          </div>
        </div>
      </div>
    );
  }
}

MovieSearchRow.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
}

export default MovieSearchRow;
