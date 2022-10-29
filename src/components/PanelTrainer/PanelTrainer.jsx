import React from 'react';
import './PanelTrainer.css';

function PanelTrainer({length = 0, recruited = 0, errorLetter = 0,  allowedNumberErrors = 0, minutes = '00', seconds = '00'}) {
  return (
    <div className='panel_trainer'>

        <div className='panel_trainer_length'>
            <span>Упражнение: </span> 
            {recruited} / {length}
        </div>

        <div className='panel_trainer_error'>
            <span>Количество ошибок: </span> 
            {errorLetter} / {allowedNumberErrors}
        </div>

        <div className='panel_trainer_time'>
            <span>Время: </span> 
            {minutes.toString().length === 1 ? 0 : ''}{minutes}
            :
            {seconds.toString().length === 1 ? 0 : ''}{seconds}
        </div>

    </div>
  )
}

export default PanelTrainer;