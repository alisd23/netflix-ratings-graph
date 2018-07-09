import { observable, action, decorate } from 'mobx';

class ShowRatingStore {
  ratings = [];

  addRating = (show, score) => {
    const newRating = { show, score };
    this.ratings = [...this.ratings, newRating];
  }

  updateRating = (show, score) => {
    const newRatings = [...this.ratings];
    const existingRatingIndex = newRatings.findIndex(r => r.show.id === show.id);
    const existingRating = newRatings[existingRatingIndex];
    newRatings[existingRatingIndex] = {
      ...existingRating,
      score
    }
    this.ratings = newRatings;
  }
}

export default decorate(ShowRatingStore, {
  ratings: observable.ref,
  addRating: action,
  updateRating: action,
});
