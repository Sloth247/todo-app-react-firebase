import { useEffect, useState } from 'react';
import { useTheme } from './hooks/useTheme';

import './App.scss';
import Header from './components/Header';
import TaskList from './components/TaskList';
import Attribution from './components/Attribution';

import { projectFirestore } from './firebase/config';

function App() {
  const { mode } = useTheme();
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(false);
  const [check, setCheck] = useState(false);
  const [num, setNum] = useState('');

  useEffect(() => {
    setIsPending(true);

    projectFirestore
      .collection('tasks')
      .orderBy('createdAt', 'asc')
      .onSnapshot(
        (snapshot) => {
          console.log(snapshot);
          if (snapshot.empty) {
            setError('No Tasks to load');
            setIsPending(false);
          } else {
            let results = [];
            snapshot.docs.forEach((doc) => {
              results.push({ id: doc.id, ...doc.data() });
            });
            setData(results);
            setIsPending(false);
            setNum(snapshot.size);
          }
        },
        (err) => {
          setError(err.message);
          setIsPending(false);
        }
      );

    projectFirestore
      .collection('tasks')
      .where('check', '==', false)
      .onSnapshot(
        (querySnapshot) => {
          console.log(querySnapshot);
          let results = [];
          querySnapshot.docs.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
          });
          setNum(querySnapshot.size);
          setIsPending(false);
        },
        (err) => {
          console.log(err.message);
        }
      );
  }, []);

  return (
    <div className={mode === 'light' ? 'App' : 'App dark'}>
      <Header check={check} setCheck={setCheck} />
      <main className={mode === 'light' ? 'main wrapper' : 'main dark wrapper'}>
        {data && (
          <TaskList
            tasks={data}
            error={error}
            isPending={isPending}
            setCheck={setCheck}
            num={num}
            setData={setData}
          />
        )}
        <p className="instruction">Drag and drop to reorder list</p>
      </main>
      <Attribution />
    </div>
  );
}

export default App;
