USING PERIODIC COMMIT 12500
LOAD CSV FROM {csvFile} AS line
MATCH (show:Movie { id: line[0] })
MERGE (user:User { id: line[1] })
MERGE (user)-[:RATED { score: toInteger(line[2]), date: date(line[3]) }]->(show)
