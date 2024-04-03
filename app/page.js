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
import LoadingModal from './loadingModal';


export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ email: '', code: '', name: '' });

  const [isModalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [disabled, setDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate an async operation, e.g., fetching data
    const fetchData = async () => {
      // Simulating a delay
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsLoading(false);
    };

    fetchData();
  }, []);

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
      const email = newItem['email'];
      const code = newItem['code'];
    setIsLoading(true);

    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const student = findStudent(querySnapshot, email, code);
      setIsLoading(false);
      if (student) {
        setItems(student);
        setModalOpen(false);
      } else {
        handleInvalidInput();
      }
  
      return () => unsubscribe();
    });
  };
  
  const findStudent = (querySnapshot, email, code) => {
    for (const doc of querySnapshot.docs) {
      const student = { ...doc.data(), id: doc.id };
  
      if (student['id'] === email && student['code'] === code) {
        return student;
      }
    }
  
    return null;
  };
  
  const handleInvalidInput = () => {
    const error = new Error('Invalid Code');
    setErrorMessage(error.message);
    setModalOpen(true);
    setItems([]);
  };

  

  const getCode = async (e) => {
    e.preventDefault();
    let email = newItem['email'];
    emailjs.init('x80W0qhFuxrQZ8iu1');
    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];
      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
  
      if (email === "") {
        const error = new Error('Please enter your valid school email.');
        setErrorMessage(error.message);
        setModalOpen(true);
        setItems([]);
      } else {
        itemsArr.forEach((student, i) => {
          if (i >= itemsArr.length - 1) {
            const error = new Error('Please enter your valid school email.');
            setErrorMessage(error.message);
            setItems([]);
          } else if (student['id'] === email) {
            emailjs
              .send('service_ilfaoun', 'template_1f0b65g', {
                to_name: student['name'],
                message: student['code'],
                email: student['id'],
              })
              .then(
                () => {
                  handleClick();
                  setModalOpen(false);
                  const error = new Error('Code successfully sent to your email.');
                  setSuccessMessage(error.message);
                  setSuccessModalOpen(true);
                  setItems([]);
                },
                (err) => {
                  const error = new Error(
                    `${JSON.stringify(err.status)}: ${JSON.stringify(err.text)}\n\n\n The developer has no more money to use the email services, any donation will be appreciated.`
                  );
                  setErrorMessage(error.message);
                  setModalOpen(true);
                  setItems([]);
                }
              );
          }
        });
      }
    });
  };

  const handleScoreChange = (e) => {
    let score = 0;
    score = parseInt(e.target.value);
    
    score = isNaN(score) ? 0 : Math.min(score, 60);
    

    let alternative = parseFloat(items.AAP);
    let formative = parseFloat(items.FAP);
    let exam = (score/60)*100*.35;
    
    let tentGrade = alternative + formative + parseFloat(exam);
    const tentativeGrade = calculateTentativeGrade(tentGrade); // Calculate grade based on score
    tentGrade = tentGrade.toFixed(2);
    setItems({
      ...items,
      second: tentGrade +'%',
      grade: tentativeGrade
    });
  };
  

  const calculateTentativeGrade = (tentGrade) => {
    // Your logic to calculate the grade based on the score
    // For demonstration purposes, let's assume a simple logic
    

    switch (true) {
      case tentGrade >= 96:
        return 1.00;
      case tentGrade >= 90 && tentGrade < 96:
        return 1.25;
      case tentGrade >= 84 && tentGrade < 90:
        return 1.50;
      case tentGrade >= 78 && tentGrade < 84:
        return 1.75;
      case tentGrade >= 72 && tentGrade < 78:
        return 2.00;
      case tentGrade >= 66 && tentGrade < 72:
        return 2.25;
      case tentGrade >= 60 && tentGrade < 66:
        return 2.50;
      case tentGrade >= 55 && tentGrade < 60:
        return 2.75;
      case tentGrade >= 50 && tentGrade < 55:
        return 3.00;
      case tentGrade >= 40 && tentGrade < 50:
        return 4.00;
      case tentGrade >= 0 && tentGrade < 40:
        return 5.00;
      default:
        return "Invalid percentage";
    }
  };
  


  return (
    <main className='flex min-h-screen flex-col items-center justify-between sm:p-24 p-4'>
      <div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm '>
        <h1 className='mt--20 text-4xl sm:text-5xl md:text-6xl gradient p-4 text-center'>Get Grades</h1>
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
                  <span className=' text-white '>3rd Quarter Examination(35%): </span>
                  {/* <span className='capitalize text-white '> {items.SE}/60 | {items.SEP}</span> */}
                  <input
                    type="text"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    className="bg-gray-800 rounded-md px-3 py-1 text-white text-sm capitalize"
                    placeholder="Enter your score /60"
                    id="score"
                    maxLength="2"
                    max={60}
                    onChange={handleScoreChange}
                  />
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
                  <span className='capitalize text-white '>{items.FA}/65 | {items.FAP}</span>
                </div>
              </li>
              <li
                className='my-4 w-full flex justify-between bg-slate-950'
              >
                <div className='p-4 w-full flex justify-between'>
                  <span className=' text-white '>Tentative grade : </span>
                  <span className='capitalize text-white '> {items.second} | {items.grade} </span>
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
        <div className='bg-slate-900 p-4 rounded-lg mt-5'>
          <h5 className='text-3xl sm:text-1xl md:text-1xl text-rose-500 p-4 text-left'>Reminder</h5>
          <h6 className='text-2xl sm:text-1xl md:text-1xl text-rose-500 p-3 text-left'>Quarter Exam, FA4, and AA2 are not yet included in the computation.</h6>
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
          <div>
            <h1>Welcome to Next.js</h1>
            <LoadingModal isLoading={isLoading} />
          </div>
      </div>
    </main>
  );
}
