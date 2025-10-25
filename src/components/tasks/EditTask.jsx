import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({ title: '', description: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setTask(data);
        } else {
          setError('Task not found');
        }
      } catch (err) {
        setError('Network error');
      }
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(task)
      });

      if (response.ok) {
        navigate('/tasks');
      } else {
        setError('Failed to update task');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div>
      <h2>Edit Task</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={task.title}
          onChange={(e) => setTask({...task, title: e.target.value})}
        />
        <textarea
          placeholder="Description"
          value={task.description}
          onChange={(e) => setTask({...task, description: e.target.value})}
        />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
