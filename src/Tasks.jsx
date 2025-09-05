import React, { useEffect, useState } from 'react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const credentials = localStorage.getItem('credentials');
        const response = await fetch('http://localhost:8080/api/tasks', {
          headers: {
            'Authorization': `Basic ${credentials}`
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

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h2>Your Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <strong>{task.title}</strong>: {task.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}