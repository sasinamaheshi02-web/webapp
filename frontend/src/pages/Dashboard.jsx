import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const { user } = useAuth();

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data.tasks);
    } catch (err) {
      console.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = filter === 'ALL'
    ? tasks
    : tasks.filter(t => t.status === filter);

  const counts = {
    ALL: tasks.length,
    TODO: tasks.filter(t => t.status === 'TODO').length,
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    COMPLETED: tasks.filter(t => t.status === 'COMPLETED').length,
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">

        <div className="grid grid-cols-4 gap-4 mb-6">
          {Object.entries(counts).map(([key, count]) => (
            <div key={key} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <p className="text-2xl font-bold text-blue-400">{count}</p>
              <p className="text-xs text-gray-400 mt-1">{key.replace('_', ' ')}</p>
            </div>
          ))}
        </div>

        {(user?.role === 'ADMIN' || user?.role === 'PROJECT_MANAGER') && (
          <TaskForm onTaskCreated={fetchTasks} />
        )}

        <div className="flex gap-2 mb-6">
          {['ALL', 'TODO', 'IN_PROGRESS', 'COMPLETED'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded text-sm font-medium transition ${
                filter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={fetchTasks}
                userRole={user?.role}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}