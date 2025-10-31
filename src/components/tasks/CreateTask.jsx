import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateTask() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [success, setSuccess] = useState(false);

  const [completed, setCompleted] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueDateError, setDueDateError] = useState('');

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

  const validateDueDate = (value) => {
   if (!value) {
       setDueDateError('Due date is required');
       return false;
     }
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    if (value < today) {
      setDueDateError('Due date cannot be in the past');
      return false;
    }
    setDueDateError('');
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
    const isDueDateValid = validateDueDate(dueDate);
    if (!isTitleValid || !isDescriptionValid || !isDueDateValid) {
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
        body: JSON.stringify({ title, description, completed, dueDate })
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

                <label>
                    Completed:
                    <input
                      type="checkbox"
                      checked={completed}
                      onChange={(e) => setCompleted(e.target.checked)}
                    />
                </label>
                <br />

                <label>
                    Due date:
                    <input
                      type="date"
                      value={dueDate}
                      //required     // or you can only get required
                      onChange={(e) => {
                          setDueDate(e.target.value);
                          if (dueDateError) validateDueDate(e.target.value);
                          }}
                    />
                    {dueDateError && <p style={{ color: 'red' }}>{dueDateError}</p>}
                </label>
                <br />

                <button type="submit">Create Task</button>
                <button type="button" onClick={() => navigate('/tasks')}>
                  Cancel
                </button>
          </form>
      )}
    </div>
  );
}
