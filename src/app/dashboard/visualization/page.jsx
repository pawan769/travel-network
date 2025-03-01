"use client";

import { useSelector } from "react-redux";

const RecommendationsVisualization = () => {
  const itemUserMatrix = useSelector((state) => state.app.itemUserMatrix) || {};
  const recommendationScores =
    useSelector((state) => state.app.recommendedScores) || {};
  const similarityMatrix =
    useSelector((state) => state.app.similarityMatrix) || {};


  const allUsers = new Set();
  Object.values(itemUserMatrix).forEach((item) => {
    Object.keys(item).forEach((user) => allUsers.add(user));
  });
  const userIds = Array.from(allUsers);

  // Get all item IDs for Similarity Matrix
  const allItems = new Set(Object.keys(similarityMatrix));
  Object.values(similarityMatrix).forEach((similarities) => {
    Object.keys(similarities).forEach((item) => allItems.add(item));
  });
  const itemIds = Array.from(allItems);

  return (
    <div className="container mx-auto p-4 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Recommendation System Visualization
      </h1>

      {/* Item-User Matrix Table */}
      <h2 className="text-2xl text-gray-700 mb-4">Item-User Matrix</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border-collapse border border-gray-200 mr-28">
          <thead>
            <tr>
              <th className="border border-gray-200 p-2 bg-gray-100 ">
                Post ID/User ID
              </th>
              {userIds.map((user) => (
                <th
                  key={user}
                  className="border border-gray-200 p-2 bg-gray-100"
                >
                  {user.slice(0, 8)}...
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(itemUserMatrix).map(([itemId, users]) => (
              <tr key={itemId}>
                <td className="border border-gray-200 p-2">
                  {itemId}
                </td>
                {userIds.map((user) => (
                  <td
                    key={`${itemId}-${user}`}
                    className={`border border-gray-200 p-2 text-center ${
                      users[user] === 1 ? "bg-yellow-100" : ""
                    }`}
                  >
                    {users[user] || 0}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Similarity Matrix Table */}
      <h2 className="text-2xl text-gray-700 mb-4">Similarity Matrix</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 p-2 bg-gray-100 w-96">
                Post ID/Post ID
              </th>
              {itemIds.map((item) => (
                <th
                  key={item}
                  className="border border-gray-200 p-2 bg-gray-100"
                >
                  {item.slice(0, 8)}...
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(similarityMatrix).map(([itemId, similarities]) => (
              <tr key={itemId}>
                <td className="border border-gray-200 p-2">
                  {itemId.slice(0, 8)}...
                </td>
                {itemIds.map((item) => (
                  <td
                    key={`${itemId}-${item}`}
                    className={`border border-gray-200 p-2 text-center ${
                      similarities[item] > 0 ? "bg-yellow-100" : ""
                    }`}
                  >
                    {similarities[item] !== undefined
                      ? similarities[item].toFixed(2)
                      : 0}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recommendation Scores Table */}
      <h2 className="text-2xl text-gray-700 mb-4">Recommendation Scores</h2>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200 p-2 bg-gray-100">User ID</th>
            <th className="border border-gray-200 p-2 bg-gray-100">Score</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(recommendationScores)
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
            .map(([userId, score]) => (
              <tr key={userId} className={score > 0 ? "bg-yellow-100" : ""}>
                <td className="border border-gray-200 p-2">
                  {userId}
                </td>
                <td className="border border-gray-200 p-2 text-center">
                  {score?.toFixed(2)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecommendationsVisualization;
