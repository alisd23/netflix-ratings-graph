// Programme recommendation query
MATCH (subject:User { id: {userId} })
MATCH (subject)-[subjectRating:RATED]->(watchedMovie:Movie)<-[userRating:RATED]-(user:User)
WITH
	watchedMovie,
	user,
  apoc.coll.sum(collect(2 - abs(subjectRating.score - userRating.score))) AS similarity,
  subject
WITH user, similarity, subject
// Calculate similarity of each user from the rating pairs: -2 (dissimilar) to 2 (similar)
// No need to forward users with 0 similarity as they will contribute 0 to a movie's recommendation score
ORDER BY similarity DESC
// Only use similar users for calculating movie scores
WHERE similarity <> 0
WITH user, similarity, subject
LIMIT 1000
MATCH (user)-[rating:RATED]->(candidate:Movie)
WHERE NOT exists((subject)-[:RATED]->(candidate))
// Calculate list of scores for each candidate movie by combining user similarity with candidate user rating
WITH candidate, collect((rating.score - 4) * similarity) AS scores
WITH candidate, scores, size(scores) as scoresCount
RETURN
	candidate,
  apoc.coll.sum(scores) * log(scoresCount + 1) / (scoresCount) AS score
ORDER BY score DESCENDING
LIMIT 50