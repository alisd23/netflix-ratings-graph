USING PERIODIC COMMIT
LOAD CSV FROM {csvFile} AS line
CREATE (:Show {
  id: line[0],
  year: toInteger(line[1]),
  title: line[2]
})
