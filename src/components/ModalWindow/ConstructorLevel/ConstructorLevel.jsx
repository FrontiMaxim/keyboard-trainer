import React, { useState } from 'react'
import { useForm } from "react-hook-form";

import {restrictions} from './restrictions';

import '../Constructor.css';
import './ConstructorLevel.css';


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

    const { register, handleSubmit} = useForm();

    const onSubmit = (data) => {
        let zones = data.zones;
        data.zones = zones.join('');
        console.log(data);
        closeModalWindow();
    };

    const [level, setLevel] = useState('1');
    const [minLenghtText, setMinLenghtText] = useState(10);
    
    return (
        <div className='modalWindow'>
            <form className='constructor level' onSubmit={handleSubmit(onSubmit)}>
                <h3>Настройка уровня</h3>
                <label htmlFor="numberLevel">
                    <p>Уровень сложности:</p>
                    <select id="numberLevel" {...register("level")} onChange={(e) => setLevel(e.target.value)}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </label>

                <div className='zoneKeyboard'>
                    <p>Зоны клавиатуры:</p>
                    <label htmlFor="zone1">1</label>
                    <input type="checkbox" id="zone1" name="zones" value="1" {...register("zones")}/>

                    <label htmlFor="zone2">2</label>
                    <input type="checkbox" id="zone2" name="zones" value="2" {...register("zones")}/>

                    <label htmlFor="zone3">3</label>
                    <input type="checkbox" id="zone3" name="zones" value="3" {...register("zones")}/>

                    <label htmlFor="zone4">4</label>
                    <input type="checkbox" id="zone4" name="zones" value="4" {...register("zones")}/>
                </div>   
                    
                <label htmlFor="timePressing">
                    <p>Время нажатия клавиши:</p>
                    <input 
                        type="number"
                        step="0.1"
                        id="timePressing" 
                        min={minPressKey}
                        max={maxPressKey}
                        {...register("timePressing")}
                    />
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
                        {...register("minLenghtText")}
                        onChange={(e) => setMinLenghtText(e.target.value)}
                    />
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
                        {...register("maxLenghtText")}
                    />
                </label>

                <label htmlFor="maxCountError">
                    <p>Максимальное количество ошибок в %:</p>
                    <input 
                        type="number"
                        id="maxCountError" 
                        min="0"
                        max={level === '1' ? maxCountErrorOneLevel:
                            level === '2' ? maxCountErrorTwoLevel : maxCountErrorThreeLevel}
                        {...register("maxCountError")}
                    />
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