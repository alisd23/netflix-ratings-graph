import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Subject, empty, from } from 'rxjs';
import { takeUntil, switchMap, tap, catchError } from 'rxjs/operators';

import MovieSearch from '../MovieSearch';

import './MoviePoster.css';

const omdbUrl = 'http://www.omdbapi.com';
const omdbApiKey = '8baff3e'

class MoviePoster extends Component {
  unmounted$ = new Subject();

  state = {
    error: null,
    imageSrc: null
  }

  getImageFragment = () => {
    const { error, imageSrc } = this.state;

    if (error) {
      return <i className="material-icons md-sm">broken_image</i>;
    }
    if (imageSrc) {
      return <img src={imageSrc} />;
    }
  }

  fetchPosterUrl = () => {
    const title = this.props.title.replace(/\s+/g, '+')
    let movieSearchUrl = `${omdbUrl}?apiKey=${omdbApiKey}&t=${title}`;

    if (this.props.year) {
      movieSearchUrl += `&y=${this.props.year}`;
    }

    from(fetch(movieSearchUrl))
      .pipe(
        takeUntil(this.unmounted$),
        switchMap(res => from(res.json())),
        tap(this.onMovieSuccess),
        catchError(() => {
          this.onMovieError();
          return empty();
        })
      )
      .subscribe();
  }

  onMovieSuccess = (movie) => {
    if (movie && movie.Poster) {
      this.setState({ imageSrc: movie.Poster });
    } else {
      this.setState({ error: true });
    }
  }

  onMovieError = () => {
    this.setState({ error: true });
  }

  // =============== //
  //  Lifecycle
  // =============== //

  render() {
    return (
      <div className="movie-poster">
        {this.getImageFragment()}
      </div>
    );
  }

  componentDidMount() {
    this.fetchPosterUrl();
  }

  componentWillUnmount() {
    this.unmounted$.next();
  }
}

MoviePoster.propTypes = {
  title: PropTypes.string.isRequired,
  year: PropTypes.number
}

export default MoviePoster;
