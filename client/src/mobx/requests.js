import axios from 'axios';

// Rating related requests
export async function fetchRatings() {
  return axios.get(`/rating`);
}

export async function deleteRating(showId) {
  return axios.delete(`/rating/${showId}`);
}

export async function rateShow(showId, score) {
  return axios.put(
    `/rating/${showId}`,
    { score }
  );
}

export async function replaceRatings(ratings) {
  await axios.post(
    '/replace-ratings',
    ratings
  );
} 

// Recommendation related requests
export async function fetchRecommendations() {
  return axios.get(`/recommendations`);
}
