import React, { useState } from 'react'
import { useForm } from "react-hook-form";

import {restrictions} from './restrictions';

import '../Constructor.css';
import './ConstructorLevel.css';
import axios from 'axios';
import { useEffect } from 'react';


const {minLenghtTextOneLevel,
    maxLenghtTextOneLevel,
    maxLenghtTextTwoLevel,
    maxLenghtTextThreeLevel,
    minPressKey,
    maxPressKey,
    maxCountErrorOneLevel,
    maxCountErrorTwoLevel,
    maxCountErrorThreeLevel} = restrictions;

function ConstructorLevel({closeModalWindow}) {

    const { register, handleSubmit, setValue} = useForm({
        defaultValues: {
            id: 1,
            maximum_count_errors: 0,
            maximum_exercise_length: 0,
            minimum_exercise_length: 0,
            click_time: 0,
            keyboard_area: [1, 2] 
        },
    });


    const onSubmit = (data) => {
        let keyboard_area = data.keyboard_area;
        data.keyboard_area =  keyboard_area.join('');
        console.log(data);

        axios.post('/level/update', data).catch(err => console.log(err));

        closeModalWindow();
    };

    const [level, setLevel] = useState('1');
    const [minLenghtText, setMinLenghtText] = useState(10);


    // загрузка уровня по умолчанию и при выборе
    useEffect(() => {
        downloadLevel();
    }, [level]);


    function downloadLevel() {
        axios.get('/level/get', {
            params: { numberLevel: level },
        })
        .then(response => {
            const data = response.data;
            console.log(data)
            setValue('id', data.id);
            setValue('maximum_count_errors', data.maximum_count_errors);
            setValue('maximum_exercise_length', data.maximum_exercise_length);
            setValue('minimum_exercise_length', data.minimum_exercise_length);
            setValue('click_time', data.click_time);
            setValue('keyboard_area', data.keyboard_area.split(''));
        })
        .catch(err => console.log(err));
    }
    
    return (
        <div className='modalWindow'>
            <form className='constructor level' onSubmit={handleSubmit(onSubmit)}>
                <h3>Настройка уровня</h3>
                <label htmlFor="numberLevel">
                    <p>Уровень сложности:</p>
                    <select id="numberLevel" {...register("id")} onChange={(e) => setLevel(e.target.value)}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </label>

                <div className='zoneKeyboard'>
                    <p>Зоны клавиатуры:</p>
                    <label htmlFor="zone1">1</label>
                    <input type="checkbox" id="zone1" name="zones" value="1" {...register("keyboard_area")}/>

                    <label htmlFor="zone2">2</label>
                    <input type="checkbox" id="zone2" name="zones" value="2" {...register("keyboard_area")}/>

                    <label htmlFor="zone3">3</label>
                    <input type="checkbox" id="zone3" name="zones" value="3" {...register("keyboard_area")}/>

                    <label htmlFor="zone4">4</label>
                    <input type="checkbox" id="zone4" name="zones" value="4" {...register("keyboard_area")}/>
                </div>   
                    
                <label htmlFor="timePressing">
                    <p>Время нажатия клавиши:</p>
                    <input 
                        type="number"
                        step="0.1"
                        id="timePressing" 
                        min={minPressKey}
                        max={maxPressKey}
                        {...register("click_time")}
                    />
                    <div className="prompt">Допустимый диапазон: {minPressKey}-{maxPressKey}</div>
                </label>

                <label htmlFor="minLenghtText">
                    <p>Минимальная длина упражнения:</p>
                    <input 
                        type="number"
                        id="minLenghtText" 
                        min={
                            level === '1' ? minLenghtTextOneLevel :
                            level === '2' ? maxLenghtTextOneLevel : maxLenghtTextTwoLevel
                        }
                        max={
                            level === '1' ? maxLenghtTextOneLevel :
                            level === '2' ? maxLenghtTextTwoLevel : maxLenghtTextThreeLevel
                        }
                        {...register("minimum_exercise_length")}
                        onChange={(e) => setMinLenghtText(e.target.value)}
                    />
                    <div className="prompt">
                        Допустимый диапазон: {   
                            level === '1' ? minLenghtTextOneLevel :
                            level === '2' ? maxLenghtTextOneLevel : maxLenghtTextTwoLevel
                        }
                        - 
                        {
                            level === '1' ? maxLenghtTextOneLevel :
                            level === '2' ? maxLenghtTextTwoLevel : maxLenghtTextThreeLevel
                        }
                    </div>
                </label>

                <label htmlFor="maxLenghtText">
                    <p>Максимальная длина упражнения:</p>
                    <input 
                        type="number"
                        id="maxLenghtText" 
                        min={minLenghtText}
                        max={
                            level === '1' ? maxLenghtTextOneLevel :
                            level === '2' ? maxLenghtTextTwoLevel : maxLenghtTextThreeLevel
                        }
                        {...register("maximum_exercise_length")}
                    />
                    <div className="prompt">
                        Допустимый диапазон: {minLenghtText}
                        - 
                        {
                            level === '1' ? maxLenghtTextOneLevel :
                            level === '2' ? maxLenghtTextTwoLevel : maxLenghtTextThreeLevel
                        }
                    </div>
                </label>

                <label htmlFor="maxCountError">
                    <p>Максимальное количество ошибок в %:</p>
                    <input 
                        type="number"
                        id="maxCountError" 
                        min="0"
                        max={level === '1' ? maxCountErrorOneLevel:
                            level === '2' ? maxCountErrorTwoLevel : maxCountErrorThreeLevel}
                        {...register("maximum_count_errors")}
                    />
                    <div className="prompt">
                        Допустимый диапазон: 
                        0-{
                            level === '1' ? maxCountErrorOneLevel:
                            level === '2' ? maxCountErrorTwoLevel : maxCountErrorThreeLevel
                        }
                    </div>
                </label>

                <div className='constructor_list-btn'>
                    <button type="submit">Применить</button>
                    <button type="button" className='btn-cancel' onClick={closeModalWindow}>Отмена</button>
                </div>
            </form>
        </div>
    )
}

export default ConstructorLevel;