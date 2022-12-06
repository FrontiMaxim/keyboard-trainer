import React from 'react';
import { useState, useRef,  useEffect } from 'react';
import { useSelector } from 'react-redux';

import PanelTrainer from '../../components/PanelTrainer/PanelTrainer';
import Textboard from '../../components/Textboard/Textboard';
import Keyboard from '../../components/Keyboard/Keyboard';

import './Trainer.css';
import Alert from '../../components/Alert/Alert';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Trainer() {

  const specialSymbols = ['Shift', 'Control', 'Meta', 'Alt'];

  const exercise = useSelector((state) => state.exercise);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
      
  const [rigthPart, setRigthPart] = useState('');
  const [remainPart, setRemainPart] = useState(exercise.text);

  const [currentLetter, setCurrentLetter] = useState(0);
  const [countError, setCountError] = useState(0);

  const [letters, setLetters] = useState([]);

  const [isPlay, setIsPlay] = useState(false);

  const [idInterval, setIdInterval] = useState(undefined);

  const [showKeyboard, setShowKeyboard] = useState(true);

  const [timeStart, setTimeStart] = useState(0);
  const [timeEnd, setTimeEnd] = useState(0);

  const [attempts, setAttempts] = useState(1);

  const [messageAlert, setMessageAlert] = useState('Чтобы начать выполнять упражнение, нажмите Enter');
  const [showAlert, setShowAlert] = useState(false);
  const [kindAlert, setKindAlert] = useState('normal');

  const [minutes, setMinutes] = useState(Math.trunc(exercise.time / 60));
  const [seconds, setSeconds] = useState(Math.round(exercise.time - Math.trunc(exercise.time / 60) * 60));


  const ref = useRef(null);

  useEffect(() => {
    setLetters(Array.from(document.querySelectorAll('[data-letter]')));
    ref.current.focus();
    setShowAlert(true);
  }, []);


  // слежка за игрой
  useEffect(() => {
    if(isPlay) {
      setIdInterval(setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000));
    } else {
      clearInterval(idInterval);
    }
  }, [isPlay]);
 

  // проверка на ввод последнего символа текста для окончания тренировки
  useEffect(() => {
    
    if(currentLetter === (exercise.text.length)) {
      completeExercises('successfully', 'Упражнение завершено! Вас автоматически перебросит на Важу страницу...');
    }
    
  }, [currentLetter]);


  useEffect(() => {
    if(seconds === 0) {
      if(minutes === 0) {
        console.log("!")
        completeExercises('unsuccessfully', 'Время вышло! Вас автоматически перебросит на Важу страницу...');
      } else {
        setSeconds(59);
        setMinutes(prev => prev - 1);
      }
    } 
  }, [seconds]);


  useEffect(() => {

    if (timeEnd !== 0) {

      const delta = (timeEnd - timeStart) / 1000;

      const result = {
        user: user,
        exercise: exercise,
        typing_speed: Math.floor((currentLetter + 1) / delta),
        count_errors: countError,
        date: new Date().toLocaleDateString(),
        execution_time: `${Math.round(delta)}`
      }

      axios.post('/statistics/create', result);
    }
   
  }, [timeEnd]);



  useEffect(() => {
    if (countError === exercise.acceptable_count_errors + 1) {
      completeExercises('unsuccessfully', 'Превышен лимит ошибок! Упражнение не выполнено! Вас автоматически перебросит на Важу страницу...');
    }
  }, [countError]);

  function completeExercises(status, text) {

    setIsPlay(false);
    setAttempts(0);
    
    setShowAlert(false);

    switch(status) {
      case 'successfully':
        setKindAlert('normal');
        setTimeEnd(new Date().getTime());
        break;
      case 'unsuccessfully':
        setKindAlert('error');
        setTimeEnd(new Date().getTime());
        break;
      default:
        setKindAlert('error');
    }

    setMessageAlert(text);
    setShowAlert(true);

    setTimeout(() => {
      navigate('/user');
    }, 6000);   
  }


  function onKeyUpHandler() {

    let letters = document.querySelectorAll('.pressed');

    if(letters) {
      letters.forEach(item => item.classList.remove('pressed'));
    } 

    letters = document.querySelectorAll('.error');

    if(letters) {
      letters.forEach(item => item.classList.remove('error'));
    }
  }


  function onKeyDownHandler(event) {
    const letter = letters.find(letter => letter.dataset.letter.includes(event.key));
   
    if(letter) {

      if(!isPlay && attempts === 1 && event.key === 'Enter') {

        setIsPlay(true);
        setTimeStart(new Date().getTime());
        setShowAlert(false);

      } else if (event.key === 'CapsLock') {
        ref.current.focus();
      } else if (isPlay) {
        if(exercise.text[currentLetter] === event.key) {

          letter.classList.add('pressed');
    
          setCurrentLetter(prev => prev + 1);
          setRigthPart(prev => prev + remainPart.slice(0,1));
          setRemainPart(prev => prev.slice(1)); 
    
        } else if (!specialSymbols.includes(event.key)) {
          
          setCountError(prev => prev + 1);
    
          letter.classList.add('error');
        }
      }
    }
  }

  function onChangeHandler() {
    setShowKeyboard(!showKeyboard);
    ref.current.focus();
  }

  // преждевременный выход 
  function goOut() {
    if(currentLetter !== (exercise.text.length)) {
      completeExercises('', 'Вы ещё не закончили упражнение! Данные не сохранятся! Вас автоматически перебросит на Важу страницу...');
    }
  }


  return (
    <div ref={ref} className='trainer' tabIndex={0} onKeyUp={onKeyUpHandler} onKeyDown={onKeyDownHandler}>

        <div className='head-trainer'>
          <button className='btn-go-out' onClick={goOut}>Выход</button>
          {
            showAlert && <Alert kind={kindAlert}>{messageAlert}</Alert>
          }
        </div>

        <PanelTrainer
           length={exercise.text.length} 
           recruited={currentLetter} 
           errorLetter={countError} 
           allowedNumberErrors={exercise.acceptable_count_errors}
           minutes={minutes} 
           seconds={seconds} 
          />
        <Textboard rigthPart={rigthPart} remainPart={remainPart} />
        <input type="checkbox" className='trainer_checkbox' onChange={onChangeHandler}/>

        {
          showKeyboard && <Keyboard />
        }
    </div>
  )
}

export default Trainer