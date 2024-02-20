'use client';
import React, { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,

} from 'firebase/firestore';
import { db } from './firebase';
import ErrorModal from './ErrorModal';
import emailjs from '@emailjs/browser';

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ email: '', code: '', name: '' });
  const [newStudent, setStudent] = useState([]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [disabled, setDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const storedTimestamp = localStorage.getItem('buttonTimestamp');
    const currentTime = new Date().getTime();
    
    if (storedTimestamp) {
      const elapsedSeconds = Math.floor((currentTime - parseInt(storedTimestamp)) / 1000);
      const remainingTime = Math.max(60 - elapsedSeconds, 0);
      
      if (remainingTime > 0) {
        setDisabled(true);
        setCountdown(remainingTime);
        startCountdown(remainingTime);
      }else{
        setDisabled(false);
        setCountdown('');
        localStorage.removeItem('buttonTimestamp');
      }
    }
  }, []);

  const startCountdown = (initialTime) => {
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(prev - 1, 0));
      
      if (countdown === 0) {
        clearInterval(interval);
        setDisabled(false);
        setCountdown('');
        localStorage.removeItem('buttonTimestamp');
      }
    }, 1000);
  };

  const handleClick = () => {
    setDisabled(true);
    localStorage.setItem('buttonTimestamp', new Date().getTime().toString());
    startCountdown(countdown);
  };
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
                //console.log(student);
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

  const getCode = async (e) =>{
    e.preventDefault();
    let email = newItem['email'];
    const serviceID = 'default_service';
    const templateID = 'template_1f0b65g';
    emailjs.init('x80W0qhFuxrQZ8iu1');
    const q = query(collection(db, 'items'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];
      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });

    if(email==""){
      const error = new Error('EMPTY');
      setErrorMessage(error.message);
      setModalOpen(true);
      setItems([]);
    }else{
     
      for(var i = 0; i < itemsArr.length; i++){
        if(i >= itemsArr.length-1){
          const error = new Error('Please enter your valid school email.');
          setErrorMessage(error.message);
          setModalOpen(true);
          setItems([]);
        }else{
          let student = itemsArr[i];
          if(student['id'] == email){
            setStudent(student);
           
            emailjs.sendForm(serviceID, templateID, e.target)
            .then(() => {
              handleClick();
              const error = new Error('Code successfully sent to your email.');
              setErrorMessage(error.message);
              setModalOpen(true);
              setItems([]);
            }, (err) => {
              alert(JSON.stringify(err));
            });
          }
        }
        
      }
    } 

   
    });


    
   
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between sm:p-24 p-4'>
      <div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm '>
        <h1 className='text-4xl sm:text-5xl md:text-6xl gradient p-4 text-center'>Computer Science 3 Grade</h1>
        <div className='bg-slate-800 p-4 rounded-lg'>
          <form 
            className='grid grid-cols-6 items-center text-black'
            onSubmit={getCode}
            id='myform'
            >
            <input
              value={newItem.email}
              onChange={(e) => setNewItem({ ...newItem, email: e.target.value })}
              className='email col-span-3 p-3 border '
              type='text'
              placeholder='Enter Email'
              id='email'
              name='email'
            />
            <input
              value={newStudent.code}
              className='hidden disabled email col-span-3 p-3 border '
              type='text'
              id='message'
              name="message"
            />
            <input
              value={newStudent.name}
              className='hidden disabled email col-span-3 p-3 border '
              type='text'
              id='to_name'
              name="to_name"
            />
            <input
             type="submit"
             value={disabled  ? ` ${countdown}s` : 'Get Code'}
             className={`text-white bg-green-500 hover:bg-green-700 bg-slate-950 hover:bg-slate-900 p-3 text-xl ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
             disabled={disabled}
            />
            <input
              value={newItem.code}
              onChange={(e) =>
                setNewItem({ ...newItem, code: e.target.value })
              }
              className='col-span-1 p-3 border mx-3'
              type='text'
              placeholder='code'
            />
            <button
              onClick={getGrade}
              className='text-white bg-green-500 hover:bg-green-700 bg-slate-950 hover:bg-slate-900 p-3 text-xl'
              type='submit'
            >
              →
            </button>
          </form>
          <ul>
              <li
                className='my-4 w-full flex justify-between bg-slate-950'
              >
                <div className='p-4 w-full flex justify-between'>
                  <span className=' text-white '>Name: </span>
                  <span className='capitalize text-white '>{items.name}</span>
                </div>
              </li>
              <li
                className='my-4 w-full flex justify-between bg-slate-950'
              >
                <div className='p-4 w-full flex justify-between'>
                  <span className=' text-white '>Summative Examination(35%): </span>
                  <span className='capitalize text-white '> {items.SE}/60 | {items.SEP}</span>
                </div>
              </li>
              <li
                className='my-4 w-full flex justify-between bg-slate-950'
              >
                <div className='p-4 w-full flex justify-between'>
                  <span className=' text-white '>Alternative Assessments(40%): </span>
                  <span className='capitalize text-white '>{items.AA}/100 | {items.AAP}</span>
                </div>
              </li>
              <li
                className='my-4 w-full flex justify-between bg-slate-950'
              >
                <div className='p-4 w-full flex justify-between'>
                  <span className=' text-white '>Formative Assessments(25%): </span>
                  <span className='capitalize text-white '>{items.FA}/70 | {items.FAP}</span>
                </div>
              </li>
              <li
                className='my-4 w-full flex justify-between bg-slate-950'
              >
                <div className='p-4 w-full flex justify-between'>
                  <span className=' text-white '>Tentative quarter grade : </span>
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
