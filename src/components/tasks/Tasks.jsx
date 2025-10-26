import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
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
      }
    };

    fetchTasks();
  }, []);

  // Filter tasks based on search term
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (taskId) => {
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
      } else {
        setError('Failed to delete task');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
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
      </div>

      {filteredTasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {filteredTasks.map(task => (
            <li key={task.id}>
              <strong>{task.title}</strong>: {task.description}
              <div style={{ marginLeft: '1rem' }}>
                <Link to={`/edit-task/${task.id}`}>
                  <button style={{ marginRight: '0.5rem' }}>Edit</button>
                </Link>
                <button onClick={() => handleDelete(task.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}