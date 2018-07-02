const fs = require('fs');
const path = require('path');

const neoDriver = require('../../database/driver');
const { executeCypherQuery } = require('../../database/helpers');

/**
 * Run a Cypher query, handling all session/driver creation and cleanup
 */
exports.executeQueryScript = async function (queries) {
  const session = neoDriver.session();

  if (!Array.isArray(queries)) {
    queries = [queries];
  }

  for (const { name, params } of queries) {
    console.log(`== Running query: ${name}`);
    const query = fs
      .readFileSync(path.resolve(__dirname, '../', `cypher/${name}.cyp`))
      .toString();
    
    const { result, error } = await executeCypherQuery(session, query, params);
    
    if (error) {
      console.log('==== Cypher query ERROR');
      console.log(error);
    } else {
      console.log('==== Cypher query SUCCESS');
      console.log(result);
    }
  }
  
  session.close();
  neoDriver.close();
}
