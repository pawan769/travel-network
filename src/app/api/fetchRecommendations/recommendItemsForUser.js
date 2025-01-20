const recommendItemsForUser = (userId, itemUserMatrix, similarityMatrix) => {
  const scores = {};
  const userInteractions = {};

  // Get all items the user has interacted with
  Object.entries(itemUserMatrix).forEach(([itemId, interactions]) => {
    if (interactions[userId]) {
      userInteractions[itemId] = interactions[userId];
    }
  });
  console.log("userInteractions:", userInteractions);

  // Calculate scores based on similar items
  Object.keys(userInteractions).forEach((interactedItemId) => {
    const similarItems = similarityMatrix[interactedItemId] || {};
    console.log("similarItems:", similarItems);
    Object.entries(similarItems).forEach(([itemId, similarityScore]) => {
      if (!userInteractions[itemId]) {
        scores[itemId] = (scores[itemId] || 0) + similarityScore;
      }
    });
  });
  console.log("scores:", scores);

  // Sort items by score
  return Object.entries(scores)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .map(([itemId]) => itemId);
};

export default recommendItemsForUser;
