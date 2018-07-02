const { executeQueryScript } = require('./utils/execute-query-script');

executeQueryScript([
  { name: 'create-movie-index' },
  { name: 'create-user-index' }
]);
