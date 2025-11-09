
export const validateTask = (task) => {
      const newErrors = {};
      const titleTrim = task.title.trim();
      if (!titleTrim) {
        newErrors.title = 'Title is required';
      } else if (titleTrim.length <= 2) {
           newErrors.title = 'Title must be at least 2 characters';
      }

      const descTrim = task.description.trim();
      if (!descTrim) {
        newErrors.description = 'Description is required';
      } else if (descTrim.length <= 3) {
        newErrors.description = 'Description must be at least 3 characters';
      }

      if (task.dueDate) {
        const selectedDate = new Date(task.dueDate);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (!selectedDate) {
          newErrors.dueDate('Due date cannot must be selected');
        } else if (selectedDate < today) {
          newErrors.dueDate = 'Due date cannot be in the past';
        }
      }
      return  newErrors;
};
