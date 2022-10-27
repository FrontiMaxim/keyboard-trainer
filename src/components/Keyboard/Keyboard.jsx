import React from 'react'
import {keys} from './infoKeys';
import './Keyboard.css';

function Keyboard() {


  return (
    <div className="keyboard">
        {
            keys.map(({letter, value}, index) => 
            <div
            key={`${index}${letter}`} 
            data-letter={letter}
            className="keyboard_key"
            >
              {value}
            </div>)
        }
    </div>
  )
}

export default Keyboard