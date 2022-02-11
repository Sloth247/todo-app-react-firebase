import { useState, useCallback } from 'react';

import { useTheme } from '../hooks/useTheme';

import update from 'immutability-helper';

// styles
import './TaskList.scss';

import Task from './Task';

// firebase
import { projectFirestore } from '../firebase/config';

// beautiful dnd lib
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

export default function TaskList({ check, tasks, setCheck, num, setData }) {
  const { mode } = useTheme();
  const [cards, setCards] = useState(tasks);

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setCards((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      })
    );
  }, []);
  const renderCard = useCallback((card, index) => {
    return (
      <Task
        key={card.id}
        index={index}
        id={card.id}
        check={card.check}
        setCheck={card.setCheck}
        description={card.description}
        moveCard={moveCard}
      />
    );
  }, []);

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

  //   const handleOnDragEnd = (result) => {
  //     if (!result.destination) return;
  //     console.log(result);
  //     const items = Array.from(updatedTasks);
  //     const [reorderedItem] = items.splice(result.source.index, 1);
  //     items.splice(result.destination.index, 0, reorderedItem);

  //     setUpdatedTasks(items);
  //   };

  return (
    <ul
      className={
        mode === 'light' ? 'tasklist-container' : 'tasklist-container dark'
      }
    >
      {cards && cards.map((card, i) => renderCard(card, i))}
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
            className={mode === 'light' ? 'filter-btn' : 'filter-btn dark'}
            onClick={handleFilterAll}
          >
            All
          </button>
          <button
            className={mode === 'light' ? 'filter-btn' : 'filter-btn dark'}
            onClick={handleFilterActive}
          >
            Active
          </button>
          <button
            className={mode === 'light' ? 'filter-btn' : 'filter-btn dark'}
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
    </ul>
  );
}
