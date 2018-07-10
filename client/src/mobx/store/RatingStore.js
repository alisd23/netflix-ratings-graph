import { observable, action, decorate } from 'mobx';

import * as requests from '../requests';

class RatingStore {
  ratings = [];
  ratingsLoading = false;
  ratingsError = null;

  addRating = (show, score) => {
    // Optimistic UI update
    const newRating = { show, score };
    this.ratings = [newRating, ...this.ratings];
    
    // Fire and forget put rating request
    requests.rateShow(show.id, score);
  }

  updateRating = (show, score) => {
    // Optimistic UI update
    const newRatings = [...this.ratings];
    const existingRatingIndex = newRatings.findIndex(r => r.show.id === show.id);
    const existingRating = newRatings[existingRatingIndex];
    newRatings[existingRatingIndex] = {
      ...existingRating,
      score
    }
    this.ratings = newRatings;
    
    // Fire and forget put rating request
    requests.rateShow(show.id, score);
  }

  deleteRating = (show) => {
    // Optimistic UI update
    const newRatings = [...this.ratings];
    const existingRatingIndex = newRatings.findIndex(r => r.show.id === show.id);

    if (existingRatingIndex === -1) {
      return;
    }

    newRatings.splice(existingRatingIndex, 1);
    this.ratings = newRatings;
    
    // Fire and forget delete request
    requests.deleteRating(show.id);
  }

  setRatings = async (ratings) => {
    this.ratingsLoading = true;
    this.ratingsError = null;
    try {
      await requests.replaceRatings(ratings);
    } finally {
      this.loadRatings();
    }
  }

  clearRatings = () => {
    this.setRatings([]);
  }

  loadRatings = async () => {
    this.ratingsLoading = true;
    this.ratingsError = null;
    try {
      const response = await requests.fetchRatings();
      this.ratings = response.data;
    } catch (e) {
      this.ratingsError = 'Could not fetch ratings';
    } finally {
      this.ratingsLoading = false;
    }
  }
}

export default decorate(RatingStore, {
  ratings: observable.ref,
  ratingsLoading: observable.ref,
  ratingsError: observable.ref,
  addRating: action,
  updateRating: action,
  deleteRating: action,
  setRatings: action,
  loadRatings: action,
  clearRatings: action,
});
