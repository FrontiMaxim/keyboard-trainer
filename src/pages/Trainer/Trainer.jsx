import React from 'react';
import { useState, useRef,  useEffect } from 'react';

import PanelTrainer from '../../components/PanelTrainer/PanelTrainer';
import Textboard from '../../components/Textboard/Textboard';
import Keyboard from '../../components/Keyboard/Keyboard';

import './Trainer.css';


function Trainer() {


  // объект для формирования результата
  let resultExercises = {
    idUser: undefined,
    idExercises: undefined,
    speed: 0.0,
    countError: 0,
    date: '00.00.0000',
    time: '00:00'
  };

  const text = 'Говори со мной, держи глаза открытыми - брат, не засыпай.';

  const v = 0.5; // скорость набора
  let time = text.length * v; // время на набор данных  
  const percentError = 5;
  const allowedNumberErrors = Math.round(text.length * percentError / 100);
                
  const specialSymbols = ['CapsLock', 'Shift', 'Control', 'Meta', 'Alt'];

  const [rigthPart, setRigthPart] = useState('');
  const [remainPart, setRemainPart] = useState(text);
  const [currentLetter, setCurrentLetter] = useState(0);
  const [errorLetter, setErrorLetter] = useState(0);
  const [letters, setLetters] = useState([]);
  const [isPlay, setIsPlay] = useState(false);
  const [idInterval, setIdInterval] = useState(0);

  const [showKeyboard, setShowKeyboard] = useState(true);

  const [timer, setTimer] = useState({
    m: Math.trunc(time / 60),
    s: Math.round(time - Math.trunc(time / 60) * 60)
  });

  let minutes = Math.trunc(time / 60);
  let seconds = Math.round(time - minutes * 60);

  const m = minutes;
  const s = seconds;

  let pressTimeStart = 0;
  let pressTimeEnd = 0;
  
  let pressTimes = [];

  function calculatePressingTime(start, end) {
    let delta = (end - start) / 1000;
    pressTimes.push(delta);
  }

  function countdown() {
    if(seconds === 0) {
      if(minutes === 0) {
        completeExercises();
      } else {
        seconds = 59;
        minutes -= 1;
        setTimer({m: minutes, s : seconds})
      }
    } else {
      seconds -= 1;
      setTimer(prev => prev = {...prev, s : seconds});
    }
  }

  const ref = useRef(null);

  useEffect(() => {
    setLetters(Array.from(document.querySelectorAll('[data-letter]')));
    ref.current.focus();
  }, []);
 
  function completeExercises() {
    setIsPlay(false);
    clearInterval(idInterval);

    let sumPress = pressTimes.reduce((sum, time) => {
      return sum + time;
    }, 0);

    const averageTimePress = sumPress / pressTimes.length;

    resultExercises.speed = averageTimePress;
    resultExercises.countError = errorLetter;
    resultExercises.time = `${m - timer.m}:${s -timer.s}`;

    const date = new Date();
    resultExercises.date = date.toLocaleDateString();


    console.log(resultExercises);
  }

  useEffect(() => {
    if(isPlay) {
      setIdInterval(setInterval(() => {
        countdown();
      }, 1000));
    }
  }, [isPlay])


  function onKeyUpHandler() {

    pressTimeStart = new Date().getTime();
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

      if(!isPlay && event.key === 'Enter') {

        setIsPlay(true);

      } else if (isPlay) {
        if(text[currentLetter] === event.key) {

          pressTimeEnd = new Date().getTime();
          calculatePressingTime(pressTimeStart, pressTimeEnd);

          letter.classList.add('pressed');
    
          setCurrentLetter(currentLetter + 1);

          if(currentLetter === (text.length - 1)) {
            completeExercises();
          }

          setRigthPart(rigthPart + remainPart.slice(0,1));
          setRemainPart(remainPart.slice(1)); 
    
        } else if (!specialSymbols.includes(event.key)) {
          
          setErrorLetter(errorLetter + 1);
    
          letter.classList.add('error');
        }
      }
    }
  }

  function onChangeHandler() {
    setShowKeyboard(!showKeyboard);
  }


  return (
    <div ref={ref} className='trainer' tabIndex={0} onKeyUp={onKeyUpHandler} onKeyDown={onKeyDownHandler}>
        <PanelTrainer
           length={text.length} 
           recruited={currentLetter} 
           errorLetter={errorLetter} 
           allowedNumberErrors={allowedNumberErrors}
           minutes={timer.m} 
           seconds={timer.s} 
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