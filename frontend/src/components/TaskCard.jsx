import React from 'react';

const TaskCard = ({ task, onUpdateStatus, onDeleteTask }) => {
  const statusColors = {
    'TODO': 'bg-yellow-100 text-yellow-800',
    'IN PROGRESS': 'bg-blue-100 text-blue-800',
    'DONE': 'bg-green-100 text-green-800',
  };

  const priorityColors = {
    'HIGH': 'text-red-600',
    'MEDIUM': 'text-yellow-600',
    'LOW': 'text-green-600',
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        <button
          onClick={() => onDeleteTask(task.id)}
          className="text-red-500 hover:text-red-700"
        >
          🗑️
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mt-1">Priority: <span className={`font-semibold ${priorityColors[task.priority]}`}>{task.priority}</span></p>
      {task.deadline && <p className="text-sm text-gray-600">Deadline: {task.deadline}</p>}

      <div className="flex justify-between items-center mt-4">
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${statusColors[task.status]}`}>
          {task.status}
        </span>
        
        <select
          value={task.status}
          onChange={(e) => onUpdateStatus(task.id, e.target.value)}
          className="text-sm border border-gray-300 rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="TODO">To Do</option>
          <option value="IN PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>
    </div>
  );
};

export default TaskCard;
