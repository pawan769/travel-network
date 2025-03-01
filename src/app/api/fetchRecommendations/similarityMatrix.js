const cosineSimilarity = (itemA, itemB) => {
    const commonUsers = Object.keys(itemA).filter(
      (userId) => userId in itemB
    );

    if (commonUsers.length === 0) return 0;

    let dotProduct = 0,
      normA = 0,
      normB = 0;
    commonUsers.forEach((userId) => {
      dotProduct += (itemA[userId] || 0) * (itemB[userId] || 0);
      normA += Math.pow(itemA[userId] || 0, 2);
      normB += Math.pow(itemB[userId] || 0, 2);
    });

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  };

  
  const calculateItemSimilarityMatrix = (itemUserMatrix) => {
    const items = Object.keys(itemUserMatrix);
    const similarityMatrix = {};

    items.forEach((itemA) => {
      similarityMatrix[itemA] = {};
      items.forEach((itemB) => {
        if (itemA !== itemB) {
          similarityMatrix[itemA][itemB] = cosineSimilarity(
            itemUserMatrix[itemA],
            itemUserMatrix[itemB]
          );
        }
      });
    });
    
    return similarityMatrix;
  };

  export default calculateItemSimilarityMatrix;