import { useEffect, useState } from 'react';

import { useTheme } from '../hooks/useTheme';

// styles
import './TaskList.scss';

// images
import Cross from '../images/icon-cross.svg';

// firebase
import { projectFirestore } from '../firebase/config';

// beautiful dnd lib
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

export default function TaskList({ tasks, setCheck, num, setData }) {
  const { mode } = useTheme();
  const [updatedTasks, setUpdatedTasks] = useState(null);
  const [filterAll, setFilterAll] = useState(null);
  const [filterActive, setFilterActive] = useState(null);
  const [filterCompleted, setFilterCompleted] = useState(null);

  useEffect(() => {
    setUpdatedTasks(tasks);
  }, [tasks]);

  const handleDelete = (id) => {
    projectFirestore.collection('tasks').doc(id).delete();
  };

  const handleFilterAll = () => {
    projectFirestore
      .collection('tasks')
      .orderBy('createdAt', 'asc')
      .onSnapshot(
        (snapshot) => {
          console.log(snapshot);
          let results = [];
          snapshot.docs.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
          });
          setFilterAll(true);
          setFilterActive(false);
          setFilterCompleted(false);
          setData(results);
        },
        (err) => {
          console.log(err.message);
        }
      );
  };

  const handleFilterActive = () => {
    projectFirestore
      .collection('tasks')
      .where('check', '==', false)
      .orderBy('createdAt', 'asc')
      .onSnapshot(
        (querySnapshot) => {
          let results = [];
          querySnapshot.docs.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
          });
          setFilterAll(false);
          setFilterActive(true);
          setFilterCompleted(false);
          setData(results);
        },
        (err) => {
          console.log(err.message);
        }
      );
  };

  const handleFilterCompleted = () => {
    projectFirestore
      .collection('tasks')
      .where('check', '==', true)
      .orderBy('createdAt', 'asc')
      .onSnapshot(
        (querySnapshot) => {
          let results = [];
          querySnapshot.docs.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
          });
          setFilterAll(false);
          setFilterActive(false);
          setFilterCompleted(true);
          setData(results);
        },
        (err) => {
          console.log(err.message);
        }
      );
  };

  const handleClear = () => {
    projectFirestore
      .collection('tasks')
      .where('check', '==', true)
      .onSnapshot(
        (querySnapshot) => {
          querySnapshot.docs.forEach((doc) => {
            doc.ref.delete();
          });
        },
        (err) => {
          console.log(err.message);
        }
      );
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

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    console.log(result);
    // const items = Array.from(updatedTasks);
    // const [reorderedItem] = items.splice(result.source.index, 1);
    // items.splice(result.destination.index, 0, reorderedItem);
    setUpdatedTasks((updatedTasks) =>
      reorder(updatedTasks, result.source.index, result.destination.index)
    );
  };

  const reorder = (tasks, sourceIndex, destinationIndex) => {
    const result = [...tasks];
    const [reordereditem] = result.splice(sourceIndex, 1);
    result.splice(destinationIndex, 0, reordereditem);
    return result;
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="tasklist">
        {(provided) => (
          <ul
            className={
              mode === 'light'
                ? 'tasklist-container'
                : 'tasklist-container dark'
            }
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {updatedTasks &&
              updatedTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <li
                      className={
                        mode === 'light'
                          ? 'task-container'
                          : 'task-container dark'
                      }
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="task-inner">
                        <form className="checkbox-container">
                          <label
                            htmlFor="tasklist-checkbox"
                            className="sr-only"
                          >
                            check if completed
                          </label>
                          {task.check ? (
                            <input
                              type="checkbox"
                              className={
                                mode === 'light' ? 'checkbox' : 'checkbox dark'
                              }
                              checked={task.check}
                              onChange={(e) => {
                                setCheck(e.target.value);
                                handleUncompleted(task.id);
                              }}
                              id="tasklist-checkbox"
                            />
                          ) : (
                            <input
                              type="checkbox"
                              className={
                                mode === 'light' ? 'checkbox' : 'checkbox dark'
                              }
                              checked={task.check}
                              onChange={(e) => {
                                setCheck(e.target.value);
                                handleCompleted(task.id);
                              }}
                              id="tasklist-checkbox"
                            />
                          )}
                        </form>
                        <div className="text-container">
                          <span
                            className={
                              mode === 'light' && task.check
                                ? 'task-description checked'
                                : mode === 'dark' && task.check
                                ? 'task-description checked dark'
                                : mode === 'light' && !task.check
                                ? 'task-description'
                                : mode === 'dark' && !task.check
                                ? 'task-description dark'
                                : null
                            }
                          >
                            {task.description}
                          </span>
                        </div>
                      </div>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(task.id)}
                      >
                        <img src={Cross} alt="delete task" />
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
            <li
              className={
                mode === 'light' ? 'tasklist-lastrow' : 'tasklist-lastrow dark'
              }
            >
              <span>{num} items left</span>
              <div
                className={
                  mode === 'light'
                    ? 'filter-btn-container'
                    : 'filter-btn-container dark'
                }
              >
                <button
                  className={
                    mode === 'light' && filterAll
                      ? 'filter-btn activated'
                      : mode === 'light' && !filterAll
                      ? 'filter-btn'
                      : mode === 'dark' && filterAll
                      ? 'filter-btn dark activated'
                      : mode === 'dark' && !filterAll
                      ? 'filter-btn dark'
                      : null
                  }
                  onClick={handleFilterAll}
                >
                  All
                </button>
                <button
                  className={
                    mode === 'light' && filterActive
                      ? 'filter-btn activated'
                      : mode === 'light' && !filterActive
                      ? 'filter-btn'
                      : mode === 'dark' && filterActive
                      ? 'filter-btn dark activated'
                      : mode === 'dark' && !filterActive
                      ? 'filter-btn dark'
                      : null
                  }
                  onClick={handleFilterActive}
                >
                  Active
                </button>
                <button
                  className={
                    mode === 'light' && filterCompleted
                      ? 'filter-btn activated'
                      : mode === 'light' && !filterCompleted
                      ? 'filter-btn'
                      : mode === 'dark' && filterCompleted
                      ? 'filter-btn dark activated'
                      : mode === 'dark' && !filterCompleted
                      ? 'filter-btn dark'
                      : null
                  }
                  onClick={handleFilterCompleted}
                >
                  Completed
                </button>
              </div>
              <button
                className={mode === 'light' ? 'clear-btn' : 'clear-btn dark'}
                onClick={handleClear}
              >
                Clear Completed
              </button>
            </li>
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}
