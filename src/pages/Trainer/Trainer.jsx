import React from 'react';
import { useState, useRef,  useEffect } from 'react';

import PanelTrainer from '../../components/PanelTrainer/PanelTrainer';
import Textboard from '../../components/Textboard/Textboard';
import Keyboard from '../../components/Keyboard/Keyboard';

import './Trainer.css';


function Trainer() {
  const text = `Говори со мной, держи глаза открытыми - брат, не засыпай
                Никому мы не нужны убитыми, а там хоть ад, хоть рай
                Говори со мной, держи глаза открытыми - брат, не засыпай`;
                
  const specialSymbols = ['CapsLock', 'Shift', 'Control', 'Meta', 'Alt'];

  const [rigthPart, setRigthPart] = useState('');
  const [remainPart, setRemainPart] = useState(text);
  const [currentLetter, setCurrentLetter] = useState(0);
  const [errorLetter, setErrorLetter] = useState(0);
  const [letters, setLetters] = useState([]);
  
  const ref = useRef(null);

  useEffect(() => {
    setLetters(Array.from(document.querySelectorAll('[data-letter]')));
    ref.current.focus();
  }, []);
 
  function onKeyUpHandler(e) {
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
      if(text[currentLetter] == event.key) {

        letter.classList.add('pressed');
  
        setCurrentLetter(currentLetter + 1);
        setRigthPart(rigthPart + remainPart.slice(0,1));
        setRemainPart(remainPart.slice(1)); 
  
      } else if (!specialSymbols.includes(event.key)) {
        
        setErrorLetter(errorLetter + 1);
  
        letter.classList.add('error');
      }
    }
  }


  return (
    <div ref={ref} className='trainer' tabIndex={0} onKeyUp={onKeyUpHandler} onKeyDown={onKeyDownHandler}>
        <PanelTrainer length={text.length} recruited={currentLetter} error={errorLetter} />
        <Textboard rigthPart={rigthPart} remainPart={remainPart} />
        <Keyboard />
    </div>
  )
}

export default Trainer