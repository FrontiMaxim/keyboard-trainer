import React from 'react';
import { useState, useRef,  useEffect } from 'react';

import PanelTrainer from '../../components/PanelTrainer/PanelTrainer';
import Textboard from '../../components/Textboard/Textboard';
import Keyboard from '../../components/Keyboard/Keyboard';

import './Trainer.css';


function Trainer() {
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

  const [timer, setTimer] = useState({
    m: Math.trunc(time / 60),
    s: Math.round(time - Math.trunc(time / 60) * 60)
  });

  let minutes = Math.trunc(time / 60);
  let seconds = Math.round(time - minutes * 60);

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
        setIsPlay(false);
        clearInterval(idInterval);
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

    setIdInterval(setInterval(() => {
      isPlay && countdown();
    }, 1000));
  }, [isPlay]);
 
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
            setIsPlay(false);
            clearInterval(idInterval);
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
        <Keyboard />
    </div>
  )
}

export default Trainer