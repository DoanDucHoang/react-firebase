import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  QuerySnapshot,
  where,
  query,
  doc,
  deleteDoc,
  orderBy,
  startAt,
  limit,
  startAfter,
  getDoc,
} from 'firebase/firestore';
import { async } from '@firebase/util';

function App() {
  const [name, setName] = useState('');
  const [point, setPoint] = useState(0);
  const [idTodo, setIdTodo] = useState('');
  const [done, setDone] = useState(false);
  const [order, setOrder] = useState(false);
  const [over, setOver] = useState(false);
  const [updateName, setUpdateName] = useState('');
  const [updatePoint, setUpdatePoint] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [lastDoc, setLastDoc] = useState([]);

  const addTodo = async e => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'todos'), {
        name: name,
        point: point,
      });
      setName('');
      setPoint(0);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const fetchTodos = async () => {
    const temp = collection(db, 'todos');
    const q = query(temp, limit(4));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));
    setTodoList(data);
  };

  const orderByHandle = async e => {
    e.preventDefault();
    const temp = collection(db, 'todos');
    const q = query(temp, orderBy('point', 'asc'), limit(1));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));
    setOrder(true);
    setTodoList(data);
  };

  const filterOver5Handle = async e => {
    e.preventDefault();
    const temp = collection(db, 'todos');
    const q = query(temp, orderBy('point'), startAt(5));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));
    setTodoList(data);
  };

  const filterLess5Handle = async e => {
    e.preventDefault();
    const temp = collection(db, 'todos');
    const q = query(temp, where('point', '<', 5));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));
    console.log(data);
    setTodoList(data);
  };

  const filterPoint9Or10Handle = async e => {
    e.preventDefault();
    const temp = collection(db, 'todos');
    const q = query(temp, where('point', 'in', [9, 10]));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));
    setTodoList(data);
  };

  const nextPageHandle = async () => {
    if (order) {
      const q = query(
        collection(db, 'todos'),
        orderBy('point', 'asc'),
        startAfter(lastDoc),
        limit(1)
      );
      const doc = await getDocs(q);
      if (doc.size == 0) {
        setOver(true);
      }
      const data = doc.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      const last = doc.docs[doc.docs.length - 1];
      setTodoList(data);
      setLastDoc(last);
    } else {
      const first = query(collection(db, 'todos'), limit(4));
      const doc = await getDocs(first);
      const last = doc.docs[doc.docs.length - 1];
      const next = query(collection(db, 'todos'), startAfter(last), limit(4));
      const querySnapshot = await getDocs(next);
      const data = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTodoList(data);
    }
  };

  const updateTodo = async e => {
    e.preventDefault();
    const docRef = doc(db, 'todos', idTodo);
    await updateDoc(docRef, {
      name: updateName,
      point: updatePoint,
    });
    setUpdateName('');
    setIdTodo('');
    setUpdatePoint('');
    setName('');
    setPoint('');
  };

  const deleteTodo = async id => {
    await deleteDoc(doc(db, 'todos', id));
  };

  useEffect(() => {
    const fetch = async () => {
      const first = query(
        collection(db, 'todos'),
        orderBy('point', 'asc'),
        limit(1)
      );
      const doc = await getDocs(first);
      const data = doc.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      const last = doc.docs[doc.docs.length - 1];
      setTodoList(data);
      setLastDoc(last);
    };
    fetch();
  }, [order]);

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="App">
      {!idTodo ? (
        <div className="App__form">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Enter your point"
            value={point}
            onChange={e => setPoint(Number(e.target.value))}
          />
          <button onClick={addTodo}>Submit</button>
        </div>
      ) : (
        <div className="App__form">
          <input
            type="text"
            placeholder="Enter your name"
            value={updateName}
            onChange={e => setUpdateName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Enter your point"
            value={updatePoint}
            onChange={e => setUpdatePoint(e.target.value)}
          />
          <button onClick={updateTodo}>Update</button>
        </div>
      )}
      <div className="App__DataDisplay">
        <button onClick={orderByHandle}>order by point</button>
        <button onClick={filterOver5Handle}>filter point &#8805; 5</button>
        <button onClick={filterLess5Handle}>filter point &#60; 5</button>
        <button onClick={filterPoint9Or10Handle}>filter point 9 or 10</button>
        {over ? (
          <button disabled>next</button>
        ) : (
          <button
            onClick={() => {
              nextPageHandle();
            }}
          >
            next
          </button>
        )}
        <table>
          <tbody>
            <tr>
              <th>Title</th>
              <th>Point</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>

            {todoList?.map((data, i) => (
              <tr key={i}>
                <td>{data.name}</td>
                <td>{data.point}</td>
                <td>
                  {' '}
                  <button
                    onClick={() => {
                      setName(data.name);
                      setPoint(data.point);
                      setIdTodo(data.id);
                      setUpdateName(data.name);
                      setUpdatePoint(data.point);
                    }}
                  >
                    Update
                  </button>{' '}
                </td>
                <td>
                  {''}
                  <button
                    onClick={() => {
                      deleteTodo(data.id);
                    }}
                  >
                    Delete
                  </button>{' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
