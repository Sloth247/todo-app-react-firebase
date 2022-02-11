import './TaskList.scss';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { useTheme } from '../hooks/useTheme';

// images
import Cross from '../images/icon-cross.svg';

// firebase
import { projectFirestore } from '../firebase/config';

export default function Task({
  id,
  description,
  index,
  moveCard,
  check,
  setCheck,
}) {
  const { mode } = useTheme();
  const handleDelete = (id) => {
    projectFirestore.collection('tasks').doc(id).delete();
  };

  const handleCompleted = (id) => {
    projectFirestore.collection('tasks').doc(id).update({
      check: true,
    });
  };

  const handleUncompleted = (id) => {
    projectFirestore.collection('tasks').doc(id).update({
      check: false,
    });
  };

  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: 'card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  //   const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <li
      className={mode === 'light' ? 'task-container' : 'task-container dark'}
      ref={ref}
      data-handler-id={handlerId}
    >
      <div className="task-inner">
        <form className="checkbox-container">
          {check ? (
            <input
              type="checkbox"
              className="checkbox"
              checked={check}
              onChange={(e) => {
                setCheck(e.target.value);
                handleUncompleted(id);
              }}
              id="selectable-element"
            />
          ) : (
            <input
              type="checkbox"
              className="checkbox"
              checked={check}
              onChange={(e) => {
                setCheck(e.target.value);
                handleCompleted(id);
              }}
            />
          )}
        </form>
        <div className="text-container">
          <span
            className={
              mode === 'light' && check
                ? 'task-description checked'
                : mode === 'dark' && check
                ? 'task-description checked dark'
                : mode === 'light' && !check
                ? 'task-description'
                : mode === 'dark' && !check
                ? 'task-description dark'
                : null
            }
          >
            {description}
          </span>
        </div>
      </div>
      <button className="delete-btn" onClick={() => handleDelete(id)}>
        <img src={Cross} alt="delete task" />
      </button>
    </li>
  );
}
