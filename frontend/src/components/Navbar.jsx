import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleColors = {
    ADMIN: 'text-red-400',
    PROJECT_MANAGER: 'text-yellow-400',
    COLLABORATOR: 'text-green-400'
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-blue-400">ProTask</h1>
        <span className="text-gray-500 text-sm">IT Project Management</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-white text-sm font-medium">{user?.name}</p>
          <p className={`text-xs font-medium ${roleColors[user?.role]}`}>
            {user?.role?.replace('_', ' ')}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}