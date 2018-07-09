const express = require('express')
const neoDriver = require('../database/driver');
const { executeCypherQuery } = require('../database/helpers');

const app = express();

app.get('/shows', searchShowsHandler);

async function searchShowsHandler(req, res) {
  const searchString = req.query.searchFilter;
  const searchRegex = `(?i).*${searchString}.*`;
  
  const query = `
    MATCH (show:Movie)
    WHERE show.title =~ {searchRegex}
    RETURN show.id as id, show.title as title, show.year as year
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
      .map(show => ({
        ...show,
        year: show.year.toInt()
      }))
    );
}

app.listen(8000, () => console.log('== Server listening on port 8000'));