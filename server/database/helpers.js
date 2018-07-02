/**
 * Execute the supplied cypher query string
 * @param {object} session cypher driver session
 * @param {string} query string cypher query
 * @param {object} params cypher query parameters 
 */
exports.executeCypherQuery = async (session, query, params) => {
  return session
    .run(query, params)
    .then((result) => ({ result }))
    .catch((error) => ({ error }));
} 