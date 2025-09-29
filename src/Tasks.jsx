import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
            setError('Neplatné přihlášení');
        return;
        }
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

          <h2>Your Tasks</h2><br></br>

          <Link to="/create-task">
                  <button style={{ marginBottom: '1rem' }}>Create New Task</button>
          </Link>
        </div>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {tasks.map(task => (
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