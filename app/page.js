'use client';
import React, { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,

} from 'firebase/firestore';
import { db } from './firebase';
import ErrorModal from './ErrorModal';

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ email: '', code: '' });

  const [isModalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
 
  

  // Add item to database
  // const addItem = async (e) => {
  //   e.preventDefault();
  //   if (newItem.name !== '' && newItem.price !== '') {
  //     // setItems([...items, newItem]);
  //     await addDoc(collection(db, 'items'), {
  //       name: newItem.name.trim(),
  //       price: newItem.price,
  //     });
  //     setNewItem({ name: '', price: '' });
  //   }
  // };

  // Read items from database
  // useEffect(() => {
  //   const q = query(collection(db, 'items'));
  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     let itemsArr = [];

  //     querySnapshot.forEach((doc) => {
  //       itemsArr.push({ ...doc.data(), id: doc.id });
  //     });
  //     setItems(itemsArr);
  //     return () => unsubscribe();
  //   });
  // }, []);

  const getGrade = async (e) => {

  
    e.preventDefault();
    let email =newItem['email'];
    let code = newItem['code'];

    // const classCode = Math.floor(Math.random() * 900000);
    // console.log(String(classCode).padStart(6, '0'));

    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
          let itemsArr = [];
          querySnapshot.forEach((doc) => {
            itemsArr.push({ ...doc.data(), id: doc.id });
          });
          for(var i = 0; i < itemsArr.length; i++){
            let student = itemsArr[i];
            if(student['id'] == email){
              if(student['code'] == code){
                setItems(student);
                console.log(student);
                setModalOpen(false);
                return () => unsubscribe();
              }else{
                const error = new Error('Invalid Code');
                setErrorMessage(error.message);
                setModalOpen(true);
                setItems([]);
                
              }
              break;
            }else{
              
              
              const error = new Error('Please enter your valid school email.');
              setErrorMessage(error.message);
              setModalOpen(true);
              setItems([]);
            }
          }
        });
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between sm:p-24 p-4'>
      <div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm '>
        <h1 className='text-4xl sm:text-5xl md:text-6xl gradient p-4 text-center'>Computer Science 3 Grade</h1>
        <div className='bg-slate-800 p-4 rounded-lg'>
          <form className='grid grid-cols-6 items-center text-black'>
            <input
              value={newItem.email}
              onChange={(e) => setNewItem({ ...newItem, email: e.target.value })}
              className='col-span-3 p-3 border'
              type='text'
              placeholder='Enter Email'
            />
            <input
              value={newItem.code}
              onChange={(e) =>
                setNewItem({ ...newItem, code: e.target.value })
              }
              className='col-span-2 p-3 border mx-3'
              type='text'
              placeholder='code'
            />
            <button
              onClick={getGrade}
              className='text-white bg-green-500 hover:bg-green-700 bg-slate-950 hover:bg-slate-900 p-3 text-xl'
              type='submit'
            >
              Go →
              
              
            </button>
          </form>
          <ul>
              <li
                className='my-4 w-full flex justify-between bg-slate-950'
              >
                <div className='p-4 w-full flex justify-between'>
                  <span className=' text-white '>NAME: </span>
                  <span className='capitalize text-white '>{items.name}</span>
                </div>
              </li>
              <li
                className='my-4 w-full flex justify-between bg-slate-950'
              >
                <div className='p-4 w-full flex justify-between'>
                  <span className=' text-white '>Summative Exam(35%): </span>
                  <span className='capitalize text-white '>{items.SE}/60 | {items.SEP}</span>
                </div>
              </li>
              <li
                className='my-4 w-full flex justify-between bg-slate-950'
              >
                <div className='p-4 w-full flex justify-between'>
                  <span className=' text-white '>Alternative Assessment(40%): </span>
                  <span className='capitalize text-white '>{items.AA}/100 | {items.AAP}</span>
                </div>
              </li>
              <li
                className='my-4 w-full flex justify-between bg-slate-950'
              >
                <div className='p-4 w-full flex justify-between'>
                  <span className=' text-white '>Formative Assessment(25%): </span>
                  <span className='capitalize text-white '>{items.FA}/70 | {items.FAP}</span>
                </div>
              </li>
              <li
                className='my-4 w-full flex justify-between bg-slate-950'
              >
                <div className='p-4 w-full flex justify-between'>
                  <span className=' text-white '>Tentative grade of the current quarter: </span>
                  <span className='capitalize text-white '> {items.second} | {items.grade}</span>
                </div>
              </li>
              <li
                className='my-4 w-full flex justify-between bg-slate-950'
              >
                <div className='p-4 w-full flex justify-between'>
                  <span className=' text-white '>Previous Grade: </span>
                  <span className='capitalize text-white '>{items.first}</span>
                </div>
              </li>
              <li
                className='my-4 w-full flex justify-between bg-slate-950'
              >
                <div className='p-4 w-full flex justify-between'>
                  <span className=' text-white '>Final Grade: </span>
                  <span className='capitalize text-white '>{items.final}</span>
                </div>
              </li>
          </ul>
        </div>
          <div>
            <ErrorModal
              isOpen={isModalOpen}
              message={errorMessage}
              onClose={() => setModalOpen(false)}
            />
          </div>
      </div>
    </main>
  );
}
