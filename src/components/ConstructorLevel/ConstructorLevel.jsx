import React, { useState } from 'react'
import { useForm } from "react-hook-form";

import {restrictions} from './restrictions';


const {minLenghtTextOneLevel,
    maxLenghtTextOneLevel,
    maxLenghtTextTwoLevel,
    maxLenghtTextThreeLevel,
    minPressKey,
    maxPressKey,
    maxCountErrorOneLevel,
    maxCountErrorTwoLevel,
    maxCountErrorThreeLevel} = restrictions;

function ConstructorLevel() {

    const { register, handleSubmit} = useForm();

    const onSubmit = data => console.log(data);

    const [level, setLevel] = useState('1');
    const [minLenghtText, setMinLenghtText] = useState(10);
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="numberLevel">
                <p>Уровень сложности:</p>
                <select id="numberLevel" {...register("level")} onChange={(e) => setLevel(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
            </label>

            <label htmlFor="numberLevel">
                <p>Зоны клавиатуры:</p>
                <select id="numberLevel" {...register("zones")}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
            </label>

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

            <input type="submit" value="Применить"/>
        </form>
    )
}

export default ConstructorLevel;