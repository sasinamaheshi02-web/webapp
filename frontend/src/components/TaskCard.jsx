import api from '../api/axios';

const priorityColors = {
  LOW: 'bg-green-900 text-green-300',
  MEDIUM: 'bg-yellow-900 text-yellow-300',
  HIGH: 'bg-red-900 text-red-300'
};

const statusColors = {
  TODO: 'bg-gray-700 text-gray-300',
  IN_PROGRESS: 'bg-blue-900 text-blue-300',
  COMPLETED: 'bg-green-900 text-green-300'
};

export default function TaskCard({ task, onUpdate, userRole }) {
  const handleStatusChange = async (e) => {
    try {
      await api.put(`/tasks/${task.id}`, { status: e.target.value });
      onUpdate();
    } catch (err) {
      console.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${task.id}`);
      onUpdate();
    } catch (err) {
      console.error('Failed to delete task');
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-white">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-400 mb-3">{task.description}</p>
      )}

      <div className="flex justify-between items-center mt-3">
        <select
          value={task.status}
          onChange={handleStatusChange}
          className={`text-xs px-2 py-1 rounded font-medium cursor-pointer border-0 ${statusColors[task.status]}`}
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        {(userRole === 'ADMIN' || userRole === 'PROJECT_MANAGER') && (
          <button
            onClick={handleDelete}
            className="text-xs text-red-500 hover:text-red-400 transition"
          >
            Delete
          </button>
        )}
      </div>

      {task.dueDate && (
        <p className="text-xs text-gray-500 mt-2">
          📅 Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      {task.assignedTo && (
        <p className="text-xs text-gray-500 mt-1">
          👤 {task.assignedTo.name}
        </p>
      )}
    </div>
  );
}