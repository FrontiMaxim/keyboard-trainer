import React, { useState } from 'react';
import { useForm } from "react-hook-form";

import {restrictions} from './restrictions';

const {minLengthNameText, maxLenghtNameText} = restrictions;
const characterSet = ['f', 'd', 's'];

function ConstructorTask() {

   const { register, handleSubmit} = useForm();

   const [methodAdding, setMethodAdding] = useState('manually');

   const [lengthTextGeneration, setLengthTextGeneration] = useState(0);
   const [text, setText] = useState('');

    const onSubmit = data => {


        if(checkText(characterSet)) {
            data['id'] = Date.now();        
            data['text'] = text;
            console.log(data);
        } else {
            alert('Текст упражнения не прошёл проверку на соответствие! Перепроверьте его!');
        }
    } 

    // автоматическая генерация текста
    function generateText(e, characterSet) {
        e.preventDefault();
        let text = '';
        for(let i = 0; i < lengthTextGeneration; i++) {
            text += characterSet[Math.floor(Math.random() * characterSet.length)];
        }

        setText(text);
    }

    // прооверка текста на соответствие требованиям
    function checkText(characterSet) {
        for(let character of  text) {
            if(!characterSet.includes(character)) {
                return false;
            } 
        }

        return true;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <label htmlFor="nameTask">
                <p>Введите название упражнения:</p>
                <input 
                    type="text"
                    id="nameTask" 
                    minLength={minLengthNameText} 
                    maxLength={maxLenghtNameText} 
                    {...register("name")}
                />
            </label>

            <label htmlFor="levelTask">
                <p>Выберите уровень упражнения:</p>
                <select id="levelTask" /* подгрузка ограничений по уровню */>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
            </label>

            <label htmlFor="methodAddingText">
                <p>Выберите способ ввода текста:</p>
                <select id="methodForAddingText" onChange={e => setMethodAdding(e.target.value)}>
                    <option value="manually">вручную</option>
                    <option value="file">из файла</option>
                    <option value="generation">генерация системой</option>
                </select>
            </label>

            <label htmlFor="addingText">
                <p>Ввод текста:</p>
                {
                    methodAdding === "manually" && 
                    <textarea 
                        id="addingText" 
                        onChange={e => setText(e.target.value)}
                        // мин и макс длину указать
                    />
                }
                {methodAdding === "file" && <input type="file" id="addingText" />}
                {methodAdding === "generation" && 
                
                    <label htmlFor="lengthText">
                        <p>Введите длину текста, который сгенерует система:</p>
                        <input 
                            type="number" 
                            id="lengthText" 
                            onChange={e => setLengthTextGeneration(e.target.value)}
                            // мин и макс длину указать
                        />
                        <button onClick={e => generateText(e, characterSet)}>Сгенерировать</button>
                    </label>
                }
            </label>

            <label htmlFor="countError">
                <p>Сколько ошибок разрешается допустить:</p>
                <input 
                    type="number"
                    id="countError" 
                    // мин и макс количество ошибок
                    {...register("countError")}
                />
            </label>

            <label htmlFor="timePressing">
                <p>Время нажатия клавиши:</p>
                <input 
                    type="number"
                    step="0.1"
                    id="timePressing" 
                    // мин и макс количество ошибок
                    {...register("timePressing")}
                />
            </label>

            <input type="submit"/>
        </form>
    );
}

export default ConstructorTask;