import React, { useState } from 'react';

const Sidebar = ({ projects, onCreateProject, onDeleteProject, onSelectProject, activeProject }) => {
  const [newProjectName, setNewProjectName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onCreateProject({ name: newProjectName });
      setNewProjectName('');
    }
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">TaskFlow</h1>
      
      <div className="mb-6">
        <button
          onClick={() => onSelectProject(null)}
          className={`w-full text-left p-2 rounded ${!activeProject ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
        >
          📊 Dashboard
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <h2 className="text-sm font-semibold text-gray-400 mb-2 uppercase">Projects</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id} className="mb-1 flex justify-between items-center group">
              <button
                onClick={() => onSelectProject(project)}
                className={`flex-1 text-left p-2 rounded ${activeProject?.id === project.id ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                📁 {project.name}
              </button>
              <button
                onClick={() => onDeleteProject(project.id)}
                className="ml-2 text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-700"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="New Project Name"
          className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          type="submit"
          className="w-full mt-2 bg-blue-600 p-2 rounded hover:bg-blue-700 transition duration-200"
        >
          + Create Project
        </button>
      </form>
    </div>
  );
};

export default Sidebar;
