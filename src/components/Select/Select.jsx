import React from 'react';

function Select({nameField, register, textLabel, dataOptions}) {
  return (
    <label>
        <p>{textLabel + ':'}</p>
        <select {...register(nameField)}>
            {
                dataOptions.map(({ text, value }) => <option key={`option${text}`} value={value}>{text}</option>)
            }   
        </select>
    </label>
  )
}

export default Select;