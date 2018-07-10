import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Subject, empty, from } from 'rxjs';
import { takeUntil, switchMap, tap, catchError } from 'rxjs/operators';

import './ShowPoster.scss';

const omdbUrl = 'http://www.omdbapi.com';
const omdbApiKey = '8baff3e'

class ShowPoster extends Component {
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
      return (
        <img
          src={imageSrc}
          alt={this.props.title}
          onError={this.onShowError}
        />
      );
    }
  }

  fetchPosterUrl = () => {
    const title = this.props.title.replace(/\s+/g, '+')
    let AddRatingSectionUrl = `${omdbUrl}?apiKey=${omdbApiKey}&t=${title}`;

    if (this.props.year) {
      AddRatingSectionUrl += `&y=${this.props.year}`;
    }

    from(fetch(AddRatingSectionUrl))
      .pipe(
        takeUntil(this.unmounted$),
        switchMap(res => from(res.json())),
        tap(this.onShowSuccess),
        catchError(() => {
          this.onShowError();
          return empty();
        })
      )
      .subscribe();
  }

  onShowSuccess = (show) => {
    if (show && show.Poster && show.Poster !== 'N/A') {
      this.setState({ imageSrc: show.Poster });
    } else {
      this.setState({ error: true });
    }
  }

  onShowError = () => {
    this.setState({ error: true });
  }

  // =============== //
  //  Lifecycle
  // =============== //

  render() {
    return (
      <div className="show-poster">
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

ShowPoster.propTypes = {
  title: PropTypes.string.isRequired,
  year: PropTypes.number
}

export default ShowPoster;
