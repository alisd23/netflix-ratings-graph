import { observable, action, decorate } from 'mobx';

import * as requests from '../requests';

class RecommendationStore {
  recommendations = null;
  recommendationsLoading = false;
  recommendationsError = null;

  loadRecommendations = async () => {
    this.recommendationsLoading = true;
    this.recommendationsError = null;
    try {
      const response = await requests.fetchRecommendations();
      this.recommendations = response.data;
    } catch (e) {
      this.recommendationsError = 'Could not fetch recommendations';
    } finally {
      this.recommendationsLoading = false;
    }
  }
}

export default decorate(RecommendationStore, {
  recommendations: observable.ref,
  recommendationsLoading: observable.ref,
  recommendationsError: observable.ref,
  loadRecommendations: action,
});
