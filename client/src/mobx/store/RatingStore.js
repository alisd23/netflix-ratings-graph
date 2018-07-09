import { observable, action, decorate } from 'mobx';

import { fetchRatings } from './requests';

class ShowRatingStore {
  ratings = [];

  addRating = (show, score) => {
    // Optimistic UI update
    // Call insert API
    const newRating = { show, score };
    this.ratings = [...this.ratings, newRating];
  }

  updateRating = (show, score) => {
    // Optimistic UI update
    // Call update API
    const newRatings = [...this.ratings];
    const existingRatingIndex = newRatings.findIndex(r => r.show.id === show.id);
    const existingRating = newRatings[existingRatingIndex];
    newRatings[existingRatingIndex] = {
      ...existingRating,
      score
    }
    this.ratings = newRatings;
  }

  deleteRating = (show) => {
    // Optimistic UI update
    // Call delete API
    const newRatings = [...this.ratings];
    const existingRatingIndex = newRatings.findIndex(r => r.show.id === show.id);

    if (existingRatingIndex === -1) {
      return;
    }

    newRatings.splice(existingRatingIndex, 1);
    this.ratings = newRatings;
  }

  setRatings = (ratings) => {
    // Call API
    // Reload ratings on success
  }

  getRatings = async () => {
    const ratings = await fetchRatings();
    this.ratings = ratings;
  }
}

export default decorate(ShowRatingStore, {
  ratings: observable.ref,
  addRating: action,
  updateRating: action,
  deleteRating: action,
  setRatings: action,
  getRatings: action,
});
