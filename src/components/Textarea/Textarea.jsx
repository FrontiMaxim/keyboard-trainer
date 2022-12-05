import React from 'react'
import styles from './Textarea.module.css';

function Textarea({ 
    nameField, 
    maxLength, 
    minLength, 
    register, 
    errors, 
    textHelp, 
    alphabet,
    textLabel
    }) {

    // поиск запрещённых символов
    const chooseWrongLetters = (text) => {
        const array = [];
        for(let character of text) {
            if(!alphabet.includes(character)) {
                if(!array.includes(character)) {
                    array.push(character);
                }
            } 
        }

        const result = {
            isMatch: array.length === 0,
            array
        }
        return result;
    }

    return (
        <label>
            <p className={styles.p}>{textLabel + ':'}</p>
            <div className={styles.prompt}>{`${textHelp}: ${minLength} - ${maxLength}`}</div>
            <div className={styles.prompt}>{`Допустимые символы: ${alphabet}`}</div>
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
                        validate: (value) => {
                            const {isMatch, array} = chooseWrongLetters(value);
            
                            return !isMatch ? `Найдены запрещённые символы: ${array}` : true;
                        }
                    })
                }
            />
            {
                errors[nameField] && <div className={styles.error}>{errors[nameField].message}</div>
            }
        </label>
    )
}

export default Textarea