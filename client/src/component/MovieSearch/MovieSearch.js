import React, { Component } from 'react';
import { Subject, from, empty } from 'rxjs';
import { debounceTime, tap, catchError, filter, switchMap } from 'rxjs/operators';

import MovieSearchRow from '../MovieSearchRow';

import './MovieSearch.css';

class MovieSearch extends Component {
  state = {
    filter: '',
    movies: null,
    loading: false,
    error: false,
  }

  filterSearch$ = new Subject();

  constructor() {
    super();

    this.filterSearch$
      .pipe(
        filter(Boolean),
        debounceTime(300),
        tap(this.onMoviesRequestPending),
        switchMap(filter => this
          .searchMovies(filter)
          .pipe(catchError(this.onMoviesRequestError))
        ),
        tap(this.onMoviesRequestSuccess),
      )
      .subscribe();
  }

  // Movie search
  searchMovies = (filter) => {
    return from(
      fetch(`/movies?searchFilter=${filter}`)
        .then(res => res.json()
      )
    );
  }

  getListFragment = () => {
    const { filter, loading, error, movies } = this.state;

    if (!filter || filter.length === 0) {
      return null;
    }
    if (error) {
      return (
        <div className="error">
          <span>An error occurred searching the movies.</span>
        </div>
      );
    }
    if (movies) {
      if (movies.length === 0) {
        return (
          <div className="no-movies">
            <span>No movies found matching: {filter}</span>
          </div>
        );
      }

      return movies.map(movie => (
        <MovieSearchRow
          key={movie.id}
          id={movie.id}
          title={movie.title}
          year={movie.year}
        />
      ))
    }
    // Only show loader if there are no movies currently displayed
    if (loading) {
      return <div className="loading">Loading...</div>;
    }
  }

  // ======================= //
  //  Event/Action handlers
  // ======================= //

  onMoviesRequestSuccess = (movies) => {
    this.setState({
      error: null,
      loading: false,
      movies
    });
  }

  onMoviesRequestError = (error) => {
    this.setState({
      error: error.message,
      loading: false,
      movies: []
    });
    return empty();
  }

  onMoviesRequestPending = () => {
    this.setState({
      loading: true,
      error: null
    });
  }

  onFilterChange = (event) => {
    const newValue = event.target.value;
    this.setState({ filter: newValue });
    this.filterSearch$.next(newValue);
  }

  // =============== //
  //  Lifecycle
  // =============== //

  render() {
    const { filter } = this.state;

    const listFragment = this.getListFragment();

    return (
      <div className="movie-search-container">
        <div className="movie-search-header">
          <input
            value={filter}
            onChange={this.onFilterChange}
            placeholder="Type to search for movies"
          />
        </div>
        <div className="movie-search-list">
          {listFragment}
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    this.filterSearch$.unsubscribe();
  }
}

export default MovieSearch;
