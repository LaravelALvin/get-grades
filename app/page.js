'use client';
import React, { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,

} from 'firebase/firestore';
import { db } from './firebase';
import ErrorModal from './ErrorModal';
import SuccessModal from './SuccessModal';
import emailjs from '@emailjs/browser';


export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ email: '', code: '', name: '' });

  const [isModalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
        localStorage.removeItem('buttonTimestamp');
      }
    }, 1000);
  };

  const handleClick = () => {
    setDisabled(true);
    localStorage.setItem('buttonTimestamp', new Date().getTime().toString());
    startCountdown(countdown);
  };
  

  const getGrade = async (e) => {

  
    e.preventDefault();
    let email =newItem['email'];
    let code = newItem['code'];

   
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
      const error = new Error('Please enter your valid school email.');
      setErrorMessage(error.message);
      setModalOpen(true);
      setItems([]);
    }else{
     
      for(var i = 0; i < itemsArr.length; i++){
        if(i >= itemsArr.length-1){
          const error = new Error('Please enter your valid school email.');
          setErrorMessage(error.message);
          setItems([]);
        }else{
          let student = itemsArr[i];
          if(student['id'] == email){
            emailjs.send("service_ilfaoun","template_1f0b65g", {
              to_name: student['name'],
              message: student['code'],
              email: student['id']
            })
            .then(() => {
              handleClick();
              setModalOpen(false);
              const error = new Error('Code successfully sent to your email.');
              setSuccessMessage(error.message);
              setSuccessModalOpen(true);
              setItems([]);
            }, (err) => {
              const error = new Error(JSON.stringify(err.status) +":" + JSON.stringify(err.text)+"\n\n\n"  + " The developer has no more money to use the email services, any donation will be appreciated.");
              setErrorMessage(error.message);
              setModalOpen(true);
              setItems([]);
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
            className='grid grid-cols-4 items-center text-black'
            onSubmit={getCode}
            id='myform'
            >
            <input
              value={newItem.email}
              onChange={(e) => setNewItem({ ...newItem, email: e.target.value })}
              className='email col-span-6 p-3 border '
              type='text'
              placeholder='Enter Email'
              id='email'
              name='email'
            />
            <input
              value={newItem.code}
              onChange={(e) =>
                setNewItem({ ...newItem, code: e.target.value })
              }
              className='email col-span-2 p-3 mt-2 mb-2'
              type='text'
              placeholder='code'
            />
            <input
             type="submit"
             value={disabled  ? ` ${countdown}s` : 'Get Code'}
             className={`col-span-3 p-2 mt-2 mb-2 ml-3 text-white bg-red-500 hover:bg-red-950 bg-red-700 hover:bg-red-900 p-3 text-xl ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
             disabled={disabled}
            />
            <br></br>
            <button
              onClick={getGrade}
              className='col-span-6 text-white bg-green-500 hover:bg-green-700 bg-green-500 hover:bg-green-900 p-5 text-xl'
              type='submit'
            >
             Get Grades →
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
                  <span className='capitalize text-white '>{items.FA}/0 | {items.FAP}</span>
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

            <SuccessModal
              isOpen={isSuccessModalOpen}
              message={successMessage}
              onClose={() => setSuccessModalOpen(false)}
            />
          </div>
      </div>
    </main>
  );
}
