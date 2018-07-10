const repository = require('./repository');

// Globally shared userId between all users
// (TODO: generate ids per user)
const userId = '0000';

/**
 * Handler for the REST endpoint for searching shows by title match
 */
exports.searchShowsHandler = async function(req, res) {
  const searchString = req.query.searchFilter;

  const { error, shows } = await repository.searchShows(searchString);

  if (error) {
    return res
      .status(500)
      .send(error.message);
  }
  return res
    .status(200)
    .send(shows);
}

/**
 * Handler for the REST endpoint to get all ratings for the current user
 */
exports.getRatingsHandler = async function(_req, res) {
  const { error, ratings } = await repository.getRatings(userId);

  if (error) {
    return res
      .status(500)
      .send(error.message);
  }
  return res
    .status(200)
    .send(ratings);
}

/**
 * Handler for the REST endpoint to add a new show rating for the current user
 */
exports.rateShowHandler = async function(req, res) {
  const { showId } = req.params;
  const { score } = req.query;

  const { error } = await repository.rateShow(showId, userId, score);

  if (error) {
    return res
      .status(500)
      .send(error.message);
  }
  return res
    .status(200)
    .send();
}

/**
 * Handler for the REST endpoint to delete a rating for the given show and current user
 */
exports.deleteRatingHandler = async function(req, res) {
  const { showId } = req.params;
  
  const { error } = await repository.deleteRating(showId, userId);

  if (error) {
    return res
      .status(500)
      .send(error.message);
  }
  return res
    .status(200)
    .send();
}

/**
 * Handler for replacing all ratings for the current user with the supplied ratings
 */
exports.replaceRatingsHandler = async function(req, res) {
  const ratings = req.body;

  if (!ratings) {
    return res
      .status(400)
      .send();
  }

  const { error: clearError } = await repository.clearRatings(userId);

  if (clearError) {
    return res
      .status(500)
      .send(error.message);
  }
  
  const { error: rateError } = await repository.rateShowsBulk(ratings, userId);

  if (rateError) {
    return res
      .status(500)
      .send(error.message);
  }

  return res
    .status(200)
    .send();
}