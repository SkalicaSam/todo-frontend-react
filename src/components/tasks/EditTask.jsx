import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { validateTask } from '../utils/Validators';

export default function EditTask({ onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({ title: '', description: '', completed: false, dueDate: '' });
  const [apiError, setApiError] = useState(null);  // for backend errors
  const [errors, setErrors] = useState({}); // for validation errors

const validateForm = () => {
  const newErrors = validateTask(task); // returns error object
  setErrors(newErrors);  // ← Updates state, React automatically re-renders component because state changed
  return Object.keys(newErrors).length === 0; // true if no errors
};

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
          setApiError('Task not found');
        }
      } catch (err) {
        setApiError('Network error');
      }
    };
    fetchTask();
  }, [id]);


  const handleSubmit = async (e) => {
    e.preventDefault();
     if (!validateForm()) return;
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

      if (response.status === 403) {
        if (typeof onLogout === 'function') {  // type controll function
          onLogout();
        }
        navigate('/login');
        return;
      }
      if (response.ok) {
        navigate('/tasks');
      } else {
        setApiError('Failed to update task');
      }
    } catch (err) {
      setApiError('Network error');
    }
  };


  return (
    <div>
      <h2>Edit Task</h2>
      {apiError  && <p style={{ color: 'red' }}>{apiError}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={task.title}
          onChange={(e) => {
              setTask({...task, title: e.target.value});
              setErrors({...errors, title: ''});
             }}
        />
        {errors.title && <p style={{ color: 'red', margin: 0 }}>{errors.title}</p>}

        <textarea
          placeholder="Description"
          value={task.description}
          onChange={(e) => setTask({...task, description: e.target.value})}
        />
        {errors.description && <p style={{ color: 'red', margin: 0 }}>{errors.description}</p>}
        <br />
        <label>
          Completed:
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => setTask({ ...task, completed: e.target.checked })}
          />
        </label>
        <br />
        <label>
          Due date:
          <input
            type="date"
            value={task.dueDate}
            onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
          />
          {errors.dueDate && <p style={{ color: 'red', margin: 0 }}>{errors.dueDate}</p>}
        </label>
        <br />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
