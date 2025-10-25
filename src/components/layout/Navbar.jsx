import { Link } from 'react-router-dom';

export default function Navbar({ isLoggedIn, onLogout }) {
  return (
    <nav>
      <Link to="/">Home</Link> |{' '}
      {isLoggedIn ? (
        <>
          <Link to="/tasks">My Tasks</Link> |{' '}
          <button onClick={onLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link> |{' '}
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}