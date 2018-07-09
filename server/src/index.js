const express = require('express')

const { searchShowsHandler, addRating, getRatings } = require('./handlers');

const app = express();

app.get('/shows', searchShowsHandler);
app.put('/rating/:showId/:score', addRating);
app.get('/rating', getRatings);

app.listen(8000, () => console.log('== Server listening on port 8000'));
