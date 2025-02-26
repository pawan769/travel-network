const recommendItemsForUser = (userId, itemUserMatrix, similarityMatrix) => {
  const scores = {};
  const userInteractions = {};

  // Get all items the user has interacted with
  Object.entries(itemUserMatrix).forEach(([itemId, interactions]) => {
    if (interactions[userId]) {
      userInteractions[itemId] = interactions[userId];
    }
  });

  // Calculate scores based on similar items
  Object.keys(userInteractions).forEach((interactedItemId) => {
    const similarItems = similarityMatrix[interactedItemId] || {};

    Object.entries(similarItems).forEach(([itemId, similarityScore]) => {
      if (!userInteractions[itemId]) {
        scores[itemId] = (scores[itemId] || 0) + similarityScore;
      }
    });
  });

  // Log the scores before sorting
  console.log("Recommendation Scores (Before Sorting):", scores);

  // Sort items by score
  const sortedRecommendations = Object.entries(scores)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .map(([itemId, score]) => {
      console.log(`Post ID: ${itemId}, Score: ${score}`);
      return itemId;
    });

  return sortedRecommendations;
};

export default recommendItemsForUser;
