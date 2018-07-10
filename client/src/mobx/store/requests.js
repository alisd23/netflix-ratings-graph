import axios from 'axios';

export async function fetchRatings() {
  return axios.get(`/rating`);
}

export async function deleteRating(showId) {
  return axios.delete(`/rating/${showId}`);
}

export async function rateShow(showId, score) {
  return axios.put(
    `/rating/${showId}`,
    { params: { score }}
  );
}

export async function replaceRatings(ratings) {
  await axios.post(
    '/replace-ratings',
    ratings
  );
} 
