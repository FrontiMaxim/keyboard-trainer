import React from 'react';
import styles from './Select.module.css';

function Select({nameField, register, textLabel, dataOptions}) {
  return (
    <label>
        <p className={styles.p}>{textLabel + ':'}</p>
        <select {...register(nameField)}>
            {
                dataOptions.map(({ text, value }) => <option key={`option${text}`} value={value}>{text}</option>)
            }   
        </select>
    </label>
  )
}

export default Select;