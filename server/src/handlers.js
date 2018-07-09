const neoDriver = require('../database/driver');
const { executeCypherQuery } = require('../database/helpers');

// Globally shared userId between all users
// (TODO: generate ids per user)
const userId = '0000';

function mapShow(rawShow) {
  const showProperties = rawShow.properties;
  return {
    ...showProperties,
    year: showProperties.year.toInt()
  }
}

/**
 * Handler for the REST endpoint for searching shows by title match
 */
exports.searchShowsHandler = async function(req, res) {
  const searchString = req.query.searchFilter;
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
    return res
      .status(500)
      .send(error.message);
  }
  return res
    .status(200)
    .send(result.records.map(record => mapShow(record.get('show'))));
}

/**
 * Handler for the REST endpoint to add a new show rating for the current user
 */
exports.addRating = async function(req, res) {
  const { showId, score } = req.params;
  const query = `
    MATCH (show: Movie { id: {showId} })
    MATCH (user:User { id: {userId} })
    MERGE (user)-[:RATED { score: {score}  }]->(show)
  `;

  const session = neoDriver.session();
  const { error } = await executeCypherQuery(session, query, { showId, userId, score });

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
 * Handler for the REST endpoint to get all ratings for the current user
 */
exports.getRatings = async function(req, res) {
  const query = `
    MATCH (user:User { id: {userId} })
    MATCH (user)-[rating:RATED]->(show:Movie)
    RETURN show, rating.score AS score
  `;

  const session = neoDriver.session();
  const { error, result } = await executeCypherQuery(session, query, { userId });

  if (error) {
    return res
      .status(500)
      .send(error.message);
  }
  return res
    .status(200)
    .send(result.records
      .map(record => ({
        show: mapShow(record.get('show')),
        score: record.get('score').toInt()
      }))
    );
}
