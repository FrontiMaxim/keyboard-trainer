import React from 'react'
import {keys} from './infoKeys';
import './Keyboard.css';

function Keyboard() {


  return (
    <div className="keyboard">
        {
            keys.map(({code, value}, index) => 
            <button 
            key={`${index}${code}`} 
            id={code} 
            className="keyboard_key"
            >
              {value}
            </button>)
        }
    </div>
  )
}

export default Keyboard