const fs = require('fs');
const path = require('path');

const neoDriver = require('../database/driver');
const { executeCypherQuery } = require('../database/helpers');

const recommendationsQuery = fs
  .readFileSync(path.resolve(__dirname, '..', 'scripts', 'cypher', 'get-recommendations.cyp'))
  .toString();

/**
 * Converts a show record to an object with correct converted types
 * @param {object} rawShow 
 */
function mapShow(rawShow) {
  const showProperties = rawShow.properties;
  return {
    ...showProperties,
    year: showProperties.year.toInt()
  }
}

/**
 * Gets all shows which contains the supplied search string.
 * @param {string} searchString 
 */
exports.searchShows = async function(searchString) {
  const searchRegex = `(?i).*${searchString}.*`;
  
  const query = `
    MATCH (show:Movie)
    WHERE show.title =~ {searchRegex}
    RETURN show
    LIMIT 20
  `;

  const session = neoDriver.session();
  const { error, result } = await executeCypherQuery(session, query, { searchRegex });

  if (error) {
    return { error };
  }

  return {
    shows: result.records.map(record => mapShow(record.get('show')))
  }
}

/**
 * Gets show recommendations for the supplied user, returning the show objects and the
 * 'recommendation score' assigned to it
 * @param {string} userId 
 */
exports.getRecommendations = async function(userId) {
  const query = recommendationsQuery;

  const session = neoDriver.session();
  const { error, result } = await executeCypherQuery(session, query, { userId });

  if (error) {
    return { error };
  }

  return {
    recommendations: result.records
      .map(record => ({
        show: mapShow(record.get('candidate')),
        score: record.get('score'),
      }))
  }
}

/**
 * Gets all ratings for the supplied user, returning the rated show object and the score given
 * @param {string} userId 
 */
exports.getRatings = async function(userId) {
  const query = `
    MATCH (user:User { id: {userId} })
    MATCH (user)-[rating:RATED]->(show:Movie)
    RETURN show, rating.score AS score
  `;

  const session = neoDriver.session();
  const { error, result } = await executeCypherQuery(session, query, { userId });

  if (error) {
    return { error };
  }

  return {
    ratings: result.records
      .map(record => ({
        show: mapShow(record.get('show')),
        score: record.get('score'),
      }))
  }
}

/**
 * Adds or updates or rating for the supplied show and user, setting the rating score
 * to the value supplied by score
 * @param {string} showId 
 * @param {string} userId 
 * @param {number} score 
 */
exports.rateShow = function(showId, userId, score) {
  const query = `
    MATCH (show:Movie { id: {showId} })
    MATCH (user:User { id: {userId} })
    MERGE (user)-[rating:RATED]->(show)
    SET rating.score = {score}
  `;

  const session = neoDriver.session();
  return executeCypherQuery(session, query, { showId, userId, score });
}

/**
 * Adds or updates a list of ratings for the supplied user, in one query
 * @param {array} ratings 
 * @param {string} userId 
 */
exports.rateShowsBulk = function(ratings, userId) {
  const query = `
    UNWIND $ratings AS ratingObj
    MATCH (user:User { id: {userId} })
    MATCH (show:Movie { id: ratingObj.showId })
    MERGE (user)-[rating:RATED]->(show)
    SET rating.score = ratingObj.score
  `;

  const session = neoDriver.session();
  return executeCypherQuery(session, query, { ratings, userId });
}


/**
 * Deletes the rating for the supplied show, rated by the supplied user.
 * @param {string} showId 
 * @param {string} userId 
 */
exports.deleteRating = function(showId, userId) {
  const query = `
    MATCH (show:Movie { id: {showId} })
    MATCH (user:User { id: {userId} })
    MATCH (user)-[rating:RATED]->(show)
    DELETE rating
  `;
  
  const session = neoDriver.session();
  return executeCypherQuery(session, query, { showId, userId });
}

/**
 * Deletes all ratings for the supplied user
 * @param {string} userId 
 */
exports.clearRatings = function(userId) {
  const query = `
    MATCH (user:User { id: {userId} })
    MATCH (user)-[rating:RATED]->()
    DELETE rating
  `;

  const session = neoDriver.session();
  return executeCypherQuery(session, query, { userId });
}
