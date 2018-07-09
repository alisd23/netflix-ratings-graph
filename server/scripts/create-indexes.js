const { executeQueryScript } = require('./utils/execute-query-script');

executeQueryScript([
  { name: 'create-show-index' },
  { name: 'create-user-index' }
]);
