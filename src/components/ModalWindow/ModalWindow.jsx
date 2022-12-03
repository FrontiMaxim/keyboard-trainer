import React from 'react'
import styles from './ModalWindow.module.css';

function ModalWindow({children}) {
  return (
    <div className={styles.modal_window}>
        {children}
    </div>
  )
}

export default ModalWindow