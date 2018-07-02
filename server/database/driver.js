const fs = require('fs');
const path = require('path');
const neo4j = require('neo4j-driver').v1;

const neo4jConfig = require('../config/neo4j.json');

// Create a driver instance, for the user neo4j with password neo4j.
const neoDriver = neo4j.driver(
  `bolt://${neo4jConfig.hostname}:${neo4jConfig.port}`,
  neo4j.auth.basic(neo4jConfig.username, neo4jConfig.password)
);

module.exports = neoDriver;
