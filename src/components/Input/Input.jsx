import React from 'react';
import { useEffect } from 'react';
import styles from './Input.module.css';

function Input({type='text', 
                nameField, 
                maxLength, 
                minLength, 
                max,
                min, 
                register, 
                errors, 
                step, 
                textLabel, 
                textHelp, 
                getValues, 
                setValue
            }) {


    // логика на автоматическое исправление полей
    useEffect(() => {

        if(max && min && getValues && setValue) {

            const value = getValues(nameField);
            if(value < min ) {
                setValue(nameField, min);
            } else if(value > max) {
                setValue(nameField, max);
            }
        }
       
    }, [errors[nameField]]);


    return (
        <label>
            <p className={styles.p}>{textLabel + ':'}</p>
            <div  className={styles.prompt}>{`${textHelp}: ${minLength ? minLength : min} - ${maxLength ? maxLength : max}`}</div>
            <input 
                className={styles.input}
                type={type} 
                step={step}
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
                        max: {
                            value: max,
                            message: `Выход за диапазон`
                        },
                        min: {
                            value: min,
                            message: `Выход за диапазон`
                        }
                    })
                }
                
            />
            {
                errors[nameField] && <div className={styles.error}>{errors[nameField].message}</div>
            }
        </label>
    );
}

export default Input;