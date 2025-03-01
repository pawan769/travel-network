const recommendItemsForUser = (userId, itemUserMatrix, similarityMatrix) => {
  const scores = {};
  const userInteractions = {};


  Object.entries(itemUserMatrix).forEach(([itemId, interactions]) => {
    if (interactions[userId]) {
      userInteractions[itemId] = interactions[userId];
    }
  });

  
  Object.keys(userInteractions).forEach((interactedItemId) => {
    const similarItems = similarityMatrix[interactedItemId] || {};

    Object.entries(similarItems).forEach(([itemId, similarityScore]) => {
      if (!userInteractions[itemId]) {
        scores[itemId] = (scores[itemId] || 0) + similarityScore;
      }
    });
  });

 
  const sortedRecommendations = Object.entries(scores)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .map(([itemId, score]) => {
      
      return itemId;
    });

  return { sortedRecommendations, scores };
};

export default recommendItemsForUser;
