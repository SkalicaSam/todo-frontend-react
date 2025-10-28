import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateTask() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [success, setSuccess] = useState(false);

  // Validation for title
  const validateTitle = (value) => {
    if (!value.trim()) {
      setTitleError('Title is required');
      return false;
    }
    if (value.length < 3) {
      setTitleError('Title must be at least 3 characters');
      return false;
    }
    setTitleError('');
    return true;
  };

  // Validation for description
  const validateDescription = (value) => {
    if (!value.trim()) {
      setDescriptionError('Description is required');
      return false;
    }
    if (value.length < 10) {
      setDescriptionError('Description must be at least 10 characters');
      return false;
    }
    setDescriptionError('');
    return true;
  };

  // Handlers for changes
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    if (titleError) validateTitle(value); // Cleaning error if writing
  };
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    if (descriptionError) validateDescription(value); // Cleaning error if writing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isTitleValid = validateTitle(title);
    const isDescriptionValid = validateDescription(description);
    if (!isTitleValid || !isDescriptionValid) {
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/tasks');
        }, 2500);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to create task');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <div>
      <h2>Create New Task</h2>
      {success ? (
          <div>
            <p style={{ color: 'green' }}>Task created successfully!</p>
            <p>Redirecting to tasks list...</p>
          </div>
            //  {success && <p style={{ color: 'green' }}>Task created successfully!</p>} {/* success message */}
      ) : (
          <form onSubmit={handleSubmit}>
                <div>
                  <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={handleTitleChange}
                  />
                  {titleError && <p style={{ color: 'red' }}>{titleError}</p>}
                </div>

                <div>
                  <textarea
                    placeholder="Description"
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                  {descriptionError && <p style={{ color: 'red' }}>{descriptionError}</p>}
                </div>

                <button type="submit">Create Task</button>
                <button type="button" onClick={() => navigate('/tasks')}>
                  Cancel
                </button>
          </form>
      )}
    </div>
  );
}
