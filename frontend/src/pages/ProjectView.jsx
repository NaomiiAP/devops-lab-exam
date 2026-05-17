import React, { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';
import { tasksApi } from '../services/api';

const ProjectView = ({ project }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await tasksApi.getTasks(project.id);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [project.id]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await tasksApi.addTask(project.id, {
        title: newTaskTitle,
        priority: newTaskPriority,
        status: 'TODO'
      });
      setTasks([...tasks, response.data]);
      setNewTaskTitle('');
      setNewTaskPriority('MEDIUM');
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await tasksApi.updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await tasksApi.deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const tasksByStatus = (status) => tasks.filter(t => t.status === status);

  if (loading) {
    return <div className="p-6">Loading tasks...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 flex-1 flex flex-col">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.name}</h1>
      <p className="text-gray-600 mb-6">{project.description}</p>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="bg-white p-4 rounded-lg shadow-md mb-6 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">New Task</label>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Task title"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200 h-10"
        >
          + Add Task
        </button>
      </form>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* To Do */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center justify-between">
            To Do
            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">{tasksByStatus('TODO').length}</span>
          </h2>
          <div className="flex-1 overflow-y-auto">
            {tasksByStatus('TODO').map(task => (
              <TaskCard key={task.id} task={task} onUpdateStatus={handleUpdateStatus} onDeleteTask={handleDeleteTask} />
            ))}
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center justify-between">
            In Progress
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{tasksByStatus('IN PROGRESS').length}</span>
          </h2>
          <div className="flex-1 overflow-y-auto">
            {tasksByStatus('IN PROGRESS').map(task => (
              <TaskCard key={task.id} task={task} onUpdateStatus={handleUpdateStatus} onDeleteTask={handleDeleteTask} />
            ))}
          </div>
        </div>

        {/* Done */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center justify-between">
            Done
            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">{tasksByStatus('DONE').length}</span>
          </h2>
          <div className="flex-1 overflow-y-auto">
            {tasksByStatus('DONE').map(task => (
              <TaskCard key={task.id} task={task} onUpdateStatus={handleUpdateStatus} onDeleteTask={handleDeleteTask} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectView;
