import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title"); // title, date, priority
  const [isLoading, setIsLoading] = useState(true);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    if (deleteSuccess) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [deleteSuccess]);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/tasks', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          setError('Failed to load tasks');
        }
      } catch (err) {
        setError('Network error');
      } finally {
          setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filter tasks based on search term
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "date":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      default:
        return 0;
    }
  });

  const handleDelete = async (taskId) => {
      if (!window.confirm("Are you sure you want to delete this task?")) {
        return;
      }
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId));
        setDeleteSuccess(true);
        setTimeout(() => setDeleteSuccess(false), 3000); // Hide after 3 seconds
      } else {
        setError('Failed to delete task');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  if (isLoading) {
     return <p>Loading tasks…</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>

      {deleteSuccess && <p style={{ color: 'green' }}>Task was deleted succesfuly !</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Your Tasks</h2>
        <Link to="/create-task">
          <button style={{ marginBottom: '1rem' }}>Create New Task</button>
        </Link>
      </div>

      {/* Search input */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.5rem', width: '300px' }}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: '0.5rem' }}
        >
          <option value="title">Sort by Title</option>
          <option value="date">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>

      {sortedTasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {sortedTasks.map(task => (
            <li key={task.id}>
              <strong>{task.title}</strong>: {task.description}
              <br />
                <span style={{ fontSize: '0.9rem' }}>
                  Completed: {task.completed ? 'Yes' : 'No'} |
                  Due: {task.dueDate || '—'}
                </span>
                <br />
              <div style={{ marginLeft: '1rem' }}>
                <Link to={`/edit-task/${task.id}`}>
                  <button style={{ marginRight: '0.5rem' }}>Edit</button>
                </Link>
                <button onClick={() => handleDelete(task.id)}>Delete</button>
              </div>
              <br />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}