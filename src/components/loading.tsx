import React from "react";

const LoadingCard = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
    <div className="w-12 h-12 bg-gray-200 rounded-lg mb-3"></div>
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-3 bg-gray-200 rounded mb-3 w-2/3"></div>
    <div className="h-6 bg-gray-200 rounded mb-3"></div>
    <div className="h-8 bg-gray-200 rounded"></div>
  </div>
);

export default LoadingCard;
