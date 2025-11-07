import { Routes, Route, useNavigate } from 'react-router-dom';
import useAuth from './components/auth/useAuth';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Tasks from './components/tasks/Tasks';
import CreateTask from './components/tasks/CreateTask';
import EditTask from './components/tasks/EditTask';

function App() {
  const { user, loading, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <Navbar isLoggedIn={!!user} onLogout={handleLogout} />
      <Routes>
         {/* Public routes */}
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/register" element={<Register onLogin={login} />} />
{/*         <Route path="/" element={<h1>Welcome, {user?.username}!</h1>} /> */}
        <Route path="/" element={  user ?
                    (
                      <h1>Welcome, {user.username}!</h1>
                    ) : (
                      <h1>Welcome, but you're not logged in!</h1>
                    )
                  }  />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/create-task" element={<CreateTask />} />
          <Route path="/edit-task/:id" element={<EditTask onLogout={handleLogout} />} />
        </Route>

      </Routes>
    </>
  );
}

export default App;