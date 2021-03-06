const process = require('process');
const fileUrl = require('file-url');

const { executeQueryScript } = require('./utils/execute-query-script');

// Pick up last argument as csv file location
const csvFileArg = process.argv[process.argv.length - 1];
const csvFile = fileUrl(csvFileArg);

executeQueryScript([
  {
    name: 'seed-ratings',
    params: { csvFile },
  }
]);
