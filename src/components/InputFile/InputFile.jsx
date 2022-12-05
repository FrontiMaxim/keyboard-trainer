import React from 'react'
import { useState } from 'react';
import styles from './InputFile.module.css';

function InputFile({accept, setValue}) {

    const [isMatchStructure, setIsMatchStructure] = useState(true);

    function readFile(e) {
      const file = e.target.files[0];
  
      const reader = new FileReader();

      reader.onload = (e) => {
          const json = JSON.parse(e.target.result);
          if(json.hasOwnProperty('text')) {
            setValue('text', json.text);
            setIsMatchStructure(true);
          } else {
            setIsMatchStructure(false);
          }
          
      }
      
      reader.readAsText(file);
    }

    return (
      <>
        <input type="file" onChange={readFile} accept={accept.join(', ')}/>
        {
          !isMatchStructure && <div className={styles.error}>Файл несоответсвует нужной структуре...</div>
        }
      </>
    )
}

export default InputFile