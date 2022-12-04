import React from 'react'
import { useState } from 'react';

function Textarea({ 
    nameField, 
    maxLength, 
    minLength, 
    register, 
    errors, 
    textHelp, 
    alphabet,
    }) {


    const [forbiddenCharacters, setForbiddenCharacters] = useState([]);

    const chooseWrongLetters = (text) => {
        const array = [];
        for(let character of text) {
            if(!alphabet.includes(character)) {
                if(!array.includes(character)) {
                    array.push(character);
                }
            } 
        }
        console.log(array)
        setForbiddenCharacters(array);
    }

    return (
        <label>
            <div>{`${textHelp}: ${minLength} - ${maxLength}`}</div>
            <div>{`Допустимые символы: ${alphabet}`}</div>
            <textarea   
                minLength={minLength}
                maxLength={maxLength}
                {
                    ...register(nameField, {
                        required: 'Поле обязательно к заполнению...',
                        maxLength: {
                            value: maxLength,
                            message: `Количество символов превышено`
                        },
                        minLength: {
                            value: minLength,
                            message: `Количество символов недостаточно`
                        },
                        pattern: {
                            value: new RegExp(`[${alphabet}]*`),
                            message: `Найдены запрещённые символы: ${forbiddenCharacters}`
                        },
                        onChange: (e) => chooseWrongLetters(e.target.value)
                    })
                }
            />
            {
                errors[nameField] && <div>{errors[nameField].message}</div>
            }
        </label>
    )
}

export default Textarea