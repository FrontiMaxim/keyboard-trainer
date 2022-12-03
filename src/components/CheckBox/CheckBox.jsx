import React from 'react';

function CheckBox({nameField, register, textLabel, dataCheckBox}) {
    return (
        <>
            <p>{textLabel + ':'}</p>
            {
                dataCheckBox.map(({text, value}) => 
                    <span key={`checkbox${text}`}>
                        <label>{text}</label>
                        <input type="checkbox" value={value} {...register(nameField)}/>            
                    </span>
                    )
            }
        </>
    )
}

export default CheckBox;