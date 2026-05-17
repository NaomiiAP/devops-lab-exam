import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import { projectsApi, tasksApi } from '../services/api';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          projectsApi.getProjects(),
          tasksApi.getAllTasks()
        ]);
        setProjects(projectsRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'DONE').length;
  const pendingTasks = tasks.filter(t => t.status !== 'DONE').length;

  const todoTasks = tasks.filter(t => t.status === 'TODO').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN PROGRESS').length;

  // Pie Chart Data (Completed vs Pending)
  const pieData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [completedTasks, pendingTasks],
        backgroundColor: ['#10B981', '#F59E0B'],
        borderColor: ['#047857', '#B45309'],
        borderWidth: 1,
      },
    ],
  };

  // Bar Chart Data (Tasks by Status)
  const barData = {
    labels: ['To Do', 'In Progress', 'Done'],
    datasets: [
      {
        label: 'Tasks',
        data: [todoTasks, inProgressTasks, completedTasks],
        backgroundColor: ['#EF4444', '#3B82F6', '#10B981'],
        borderColor: ['#B91C1C', '#1D4ED8', '#047857'],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Tasks by Status',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 flex-1 overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Projects" value={totalProjects} color="border-blue-500" />
        <StatCard title="Total Tasks" value={totalTasks} color="border-purple-500" />
        <StatCard title="Completed Tasks" value={completedTasks} color="border-green-500" />
        <StatCard title="Pending Tasks" value={pendingTasks} color="border-yellow-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Completion Status</h2>
          <div className="w-full max-w-xs">
            <Pie data={pieData} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to TaskFlow</h2>
        <p className="text-gray-600">
          Select a project from the sidebar to view its tasks or create a new project to get started.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
