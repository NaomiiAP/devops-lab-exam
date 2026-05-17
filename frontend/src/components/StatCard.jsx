import React from 'react';

const StatCard = ({ title, value, color }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${color}`}>
      <h3 className="text-gray-500 text-sm font-semibold uppercase">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
};

export default StatCard;
