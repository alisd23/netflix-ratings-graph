export async function fetchRatings() {
  return fetch(`/rating`).then(res => res.json());
}