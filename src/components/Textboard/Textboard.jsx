import React from 'react';
import { useEffect } from 'react';
import './Textboard.css';

function Textboard() {

  let letters = [];
  useEffect(() => {
    letters = Array.from(document.querySelectorAll('[data-letter]'));
  }, []);
 
  function onKeyUpHandler(event) {
    const letter = letters.find(letter => letter.dataset.letter.includes(event.key));
   
    if(letter) {
      console.log(letter);
      letter.classList.add('pressed');
      
    }
  }

  function onKeyDownHandler(event) {
    const letter = document.querySelector('.pressed');
    letter.classList.remove('pressed');
  }

  return (
    <input type="text" className='textboard' onKeyUp={onKeyUpHandler} onKeyDown={onKeyDownHandler}/>
  )
}

export default Textboard;