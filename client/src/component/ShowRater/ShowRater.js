import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Subject, from, empty } from 'rxjs';
import { debounceTime, tap, catchError, filter, switchMap } from 'rxjs/operators';
import enhanceWithClickOutside from 'react-click-outside';
import { inject } from 'mobx-react';

import compose from '../../util/compose';
import ShowRaterRow from '../ShowRaterRow';

import './ShowRater.scss';

const SEARCH_DEBOUNCE_TIME = 400;

class ShowRater extends Component {
  state = {
    filter: '',
    shows: null,
    loading: false,
    error: false,
    inputFocused: false,
  }

  filterSearch$ = new Subject();

  constructor() {
    super();

    this.filterSearch$
      .pipe(
        filter(Boolean),
        debounceTime(SEARCH_DEBOUNCE_TIME),
        tap(this.onShowsRequestPending),
        switchMap(filter => this
          .searchShows(filter)
          .pipe(catchError(this.onShowsRequestError))
        ),
        tap(this.onShowsRequestSuccess),
      )
      .subscribe();
  }

  // Show search
  searchShows = (filter) => {
    return from(
      fetch(`/shows?searchFilter=${filter}`)
        .then(res => res.json()
      )
    );
  }

  getDropdownFragment = () => {
    const { filter, loading, error, shows } = this.state;
    const { ratings } = this.props;

    if (!filter || filter.length === 0) {
      return null;
    }
    if (error) {
      return (
        <div className="error">
          <span>An error occurred while searching for shows.</span>
        </div>
      );
    }
    if (shows) {
      if (shows.length === 0) {
        return (
          <div className="no-shows">
            <span>No shows found matching: {filter}</span>
          </div>
        );
      }

      return shows.map(show => {
        const currentRating = ratings.find(rating => rating.show.id === show.id);
        return (
          <ShowRaterRow
            key={show.id}
            id={show.id}
            title={show.title}
            year={show.year}
            canEdit={!Boolean(currentRating)}
            currentRating={currentRating && currentRating.score}
            onRating={score => this.onAddRating(show, score)}
          />
        )
      })
    }
    // Only show loader if there are no shows currently displayed
    if (loading) {
      return (
        <div className="loading">
          <div className="spinner spinner-md"></div>
        </div>
      );
    }
  }

  // ======================= //
  //  Event/Action handlers
  // ======================= //

  onAddRating = (show, score) => {
    this.onDropdownBlur();
    this.props.addRating(show, score)
  }

  onShowsRequestSuccess = (shows) => {
    this.setState({
      error: null,
      loading: false,
      shows
    });
  }

  onShowsRequestError = (error) => {
    this.setState({
      error: error.message,
      loading: false,
      shows: []
    });
    return empty();
  }

  onShowsRequestPending = () => {
    this.setState({
      loading: true,
      error: null
    });
  }

  onFilterChange = (event) => {
    const newValue = event.target.value;
    this.setState({
      filter: newValue,
      shows: !newValue ? null : this.state.shows
    });
    this.filterSearch$.next(newValue);
  }

  onInputFocus = () => {
    this.setState({ inputFocused: true });
  }

  // =========================== //
  //  ReactClickOutside Methods
  // =========================== //

  getInitialState = () => ({
    isOpened: false,
  });
 
  handleClickOutside = () => {
    this.onDropdownBlur();
  }

  onDropdownBlur = () => {
    this.setState({ inputFocused: false });
  }

  // =============== //
  //  Lifecycle
  // =============== //

  render() {
    const { filter, inputFocused } = this.state;

    const dropdownFragment = this.getDropdownFragment();

    return (
      <div className="show-rater-container">
        <input
          value={filter}
          onChange={this.onFilterChange}
          onFocus={this.onInputFocus}
          placeholder="Type to search for shows"
        />
        {
          filter && inputFocused && dropdownFragment && (
            <div className="show-rater-dropdown-list">
              {dropdownFragment}
            </div>
          )
        }
      </div>
    );
  }

  componentWillUnmount() {
    this.filterSearch$.unsubscribe();
  }
}

ShowRater.propTypes = {
  addRating: PropTypes.func.isRequired,
  ratings: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default compose(
  inject(stores => ({
    addRating: stores.ratingStore.addRating,
    ratings: stores.ratingStore.ratings,
  })),
  enhanceWithClickOutside,
)(ShowRater);
