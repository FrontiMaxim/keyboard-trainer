import React from 'react';
import './Guide.css';
import guide1 from './guide_1.jpg';
import guide2 from './guide_2.jpg';
import guide3 from './guide_3.jpg';
import guide4 from './guide_4.jpg';
import guide5 from './guide_5.jpg';
import guide6 from './guide_6.jpg';
import guide7 from './guide_7.jpg';
import guide8 from './guide_8.jpg';

function Guide({closeModalWindow}) {
  return (
    <div className='modalWindow'>
        <div className='information'>
          <h2>Руководство пользователя</h2>
          <hr />
          <div className='guide'>
            <img src={guide1} />
            <img src={guide2} />
            <img src={guide3} />
            <img src={guide4} />
            <img src={guide5} />
            <img src={guide6} />
            <img src={guide7} />
            <img src={guide8} />
          </div>
          <button className='btn-close-modalWindow' onClick={closeModalWindow}>Закрыть</button>
      </div>
    </div>
  )
}

export default Guide;