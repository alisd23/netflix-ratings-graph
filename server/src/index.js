const express = require('express')
const bodyParser = require('body-parser')

const handlers = require('./handlers');

const app = express();

// Middlewares
app.use(bodyParser.json())

// REST endpoints
app.get('/shows', handlers.searchShowsHandler);

app.get('/rating', handlers.getRatingsHandler);
app.put('/rating/:showId', handlers.rateShowHandler);
app.delete('/rating/:showId', handlers.deleteRatingHandler);
app.post('/replace-ratings', handlers.replaceRatingsHandler)

app.listen(8000, () => console.log('== Server listening on port 8000'));
