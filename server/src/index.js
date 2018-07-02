const express = require('express')
const neoDriver = require('../database/driver');
const { executeCypherQuery } = require('../database/helpers');

const app = express();

app.get('/movies', searchMoviesHandler);

async function searchMoviesHandler(req, res) {
  const searchString = req.query.searchFilter;
  const searchRegex = `(?i).*${searchString}.*`;
  
  const query = `
    MATCH (movie:Movie)
    WHERE movie.title =~ {searchRegex}
    RETURN movie.id as id, movie.title as title, movie.year as year
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
    .send(result.records
      .map(record => record.toObject())
      .map(movie => ({
        ...movie,
        year: movie.year.toInt()
      }))
    );
}

app.listen(8000, () => console.log('== Server listening on port 8000'));