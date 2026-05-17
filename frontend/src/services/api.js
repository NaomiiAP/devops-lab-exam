import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const projectsApi = {
  getProjects: () => api.get('/projects/'),
  createProject: (data) => api.post('/projects/', data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
};

export const tasksApi = {
  getAllTasks: () => api.get('/tasks'),
  getTasks: (projectId) => api.get(`/projects/${projectId}/tasks`),
  addTask: (projectId, data) => api.post(`/projects/${projectId}/tasks`, data),
  updateTaskStatus: (taskId, status) => api.put(`/tasks/${taskId}`, { status }),
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
};

export default api;
