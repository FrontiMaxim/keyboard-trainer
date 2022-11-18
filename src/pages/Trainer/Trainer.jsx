import React from 'react';
import { useState, useRef,  useEffect } from 'react';

import PanelTrainer from '../../components/PanelTrainer/PanelTrainer';
import Textboard from '../../components/Textboard/Textboard';
import Keyboard from '../../components/Keyboard/Keyboard';

import './Trainer.css';


function Trainer() {

  const specialSymbols = ['Shift', 'Control', 'Meta', 'Alt'];

  // объект упражнения
  const [exercises, setExercises] = useState({
    id: 0,
    text: '',
    allowedCountError: 0,
    time: 0
  });
      
  // объект результата
  const [resultTrain, setResultTrain] = useState({});

  const [rigthPart, setRigthPart] = useState('');
  const [remainPart, setRemainPart] = useState('');

  const [currentLetter, setCurrentLetter] = useState(0);
  const [countLetter, setCountLetter] = useState(0);

  const [letters, setLetters] = useState([]);

  const [isPlay, setIsPlay] = useState(false);

  const [idInterval, setIdInterval] = useState(undefined);

  const [showKeyboard, setShowKeyboard] = useState(true);

  const [timeStart, setTimeStart] = useState(0);
  const [timeEnd, setTimeEnd] = useState(0);

  const [attempts, setAttempts] = useState(1);

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);


  const ref = useRef(null);

  // получение упражнения с сервера
  useEffect(() => {

    setExercises({
      id: 1,
      text: 'Говори со мной, держи глаза открытыми - брат, не засыпай.',
      allowedNumberErrors: 3,
      time: 29 // время должно прийти в секундах (выделять минуты и секунды на клиенте)
    });

    setLetters(Array.from(document.querySelectorAll('[data-letter]')));
    ref.current.focus();
  }, []);


  // слежка за объектом упражнения и настройка времени
  useEffect(() => {
    let time = exercises.time;
     
    if(time !== 0) {
      setMinutes(Math.trunc(time / 60));
      setSeconds(Math.round(time - Math.trunc(time / 60) * 60));

      setRemainPart(exercises.text);
    }
  }, [exercises]);


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
    if(exercises.text.length !== 0) {
      if(currentLetter === (exercises.text.length)) {
        completeExercises();
      }
    }
  }, [currentLetter]);


  useEffect(() => {
    if (exercises.time !== 0) {
      if(seconds === 0) {
        if(minutes === 0) {
          completeExercises();
        } else {
          setSeconds(59);
          setMinutes(prev => prev - 1);
        }
      } 
    }
  }, [seconds]);


  useEffect(() => {

    if (timeEnd !== 0) {

      const delta = (timeEnd - timeStart) / 1000;
      const result = {
        idUser: undefined,
        idExercises: undefined,
        speed: Math.floor((currentLetter + 1) / delta),
        countError: countLetter,
        date: new Date().toLocaleDateString(),
        time: `${Math.trunc(delta / 60)}:${Math.round(delta - Math.trunc(delta / 60) * 60)}`
      }
  
      setResultTrain({
        ...result
      });
    }
   
  }, [timeEnd]);



  useEffect(() => {
    console.log(resultTrain)
  }, [resultTrain])


  function completeExercises() {
    setIsPlay(false);
    setAttempts(0);
    setTimeEnd(new Date().getTime());
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

      } else if (event.key === 'CapsLock') {
        ref.current.focus();
      } else if (isPlay) {
        if(exercises.text[currentLetter] === event.key) {

          letter.classList.add('pressed');
    
          setCurrentLetter(prev => prev + 1);
          setRigthPart(prev => prev + remainPart.slice(0,1));
          setRemainPart(prev => prev.slice(1)); 
    
        } else if (!specialSymbols.includes(event.key)) {
          
          setCountLetter(countLetter + 1);
    
          letter.classList.add('error');
        }
      }
    }
  }

  function onChangeHandler() {
    setShowKeyboard(!showKeyboard);
    ref.current.focus();
  }


  return (
    <div ref={ref} className='trainer' tabIndex={0} onKeyUp={onKeyUpHandler} onKeyDown={onKeyDownHandler}>
        <PanelTrainer
           length={exercises.text.length} 
           recruited={currentLetter} 
           errorLetter={countLetter} 
           allowedNumberErrors={exercises.allowedNumberErrors}
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