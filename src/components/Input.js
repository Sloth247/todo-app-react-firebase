import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';

// components
import './Input.scss';

// Firebase
import { projectFirestore, timestamp } from '../firebase/config';

export default function Input({ check, setCheck }) {
  const { mode } = useTheme();
  const [description, setDescription] = useState('');

  const handleKeyUp = async (e) => {
    e.preventDefault();
    if ((e.key === 'Enter') & (e.keyCode === 13)) {
      const doc = {
        check,
        description,
        createdAt: timestamp.fromDate(new Date()),
      };
      try {
        await projectFirestore.collection('tasks').add(doc);
        setDescription('');
        if (check) {
          setCheck(false);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <form
      className={mode === 'light' ? 'form' : 'form dark'}
      onSubmit={handleKeyUp}
    >
      <div className="checkbox-container">
        <label htmlFor="check-input" className="sr-only">
          Check if the task is completed
        </label>
        <input
          type="checkbox"
          className={mode === 'light' ? 'checkbox' : 'checkbox dark'}
          value={check}
          checked={check}
          onChange={(e) => setCheck(e.target.checked)}
          onKeyUp={handleKeyUp}
          id="check-input"
        />
      </div>
      <div className="text-container">
        <label htmlFor="task-input" className="sr-only">
          Input a task
        </label>
        <input
          type="text"
          placeholder="Create a new todo..."
          className={mode === 'light' ? 'text-input' : 'text-input dark'}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyUp={handleKeyUp}
          id="task-input"
        />
      </div>
    </form>
  );
}
