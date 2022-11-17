import React from 'react';
import './ModalWindow.css';

function ModalWindow({children, closeModalWindow}) {
  return (
    <div className='modalWindow'>
        <div className='modalWindow_workspace'>
            {
                children
            }
            <button className='btn-close-modalWindow' onClick={closeModalWindow}>Закрыть</button>
        </div>
    </div>
  )
}

export default ModalWindow;