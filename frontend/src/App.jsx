import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ProjectView from './pages/ProjectView';
import { projectsApi } from './services/api';

function App() {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await projectsApi.getProjects();
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (data) => {
    try {
      const response = await projectsApi.createProject(data);
      setProjects([...projects, response.data]);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await projectsApi.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      if (activeProject?.id === id) {
        setActiveProject(null);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleSelectProject = (project) => {
    setActiveProject(project);
  };

  if (loading && projects.length === 0) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        projects={projects}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
        onSelectProject={handleSelectProject}
        activeProject={activeProject}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeProject ? (
          <ProjectView project={activeProject} />
        ) : (
          <Dashboard />
        )}
      </div>
    </div>
  );
}

export default App;
