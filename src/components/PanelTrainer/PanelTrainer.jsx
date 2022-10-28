import React from 'react';
import './PanelTrainer.css';

function PanelTrainer({length = 0, recruited = 0, error = 0, time = '00:00'}) {
  return (
    <div className='panel_trainer'>

        <div className='panel_trainer_length'>
            <span>Упражнение: </span> 
            {recruited} / {length}
        </div>

        <div className='panel_trainer_error'>
            <span>Количество ошибок: </span> 
            {error}
        </div>

        <div className='panel_trainer_time'>
            <span>Время: </span> 
            {time}
        </div>

    </div>
  )
}

export default PanelTrainer;