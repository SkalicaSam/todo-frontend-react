import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateTask() {
  const navigate = useNavigate();
  const [task, setTask] = useState({ title: '', description: '' });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(task)
      });

      if (response.ok) {
        navigate('/tasks');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create task');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div>
      <h2>Create New Task</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={task.title}
          onChange={(e) => setTask({...task, title: e.target.value})}
          required
        />
        <textarea
          placeholder="Description"
          value={task.description}
          onChange={(e) => setTask({...task, description: e.target.value})}
          required
        />
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}
