import React, { useState } from 'react';
import { useForm } from "react-hook-form";

import {restrictions} from './restrictions';

const {minLengthNameText, maxLenghtNameText} = restrictions;
const characterSet = ['f', 'd', 's'];

function ConstructorTask() {

   const {register, handleSubmit} = useForm();

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

    function readFile(files) {
        const file = files[0];

        const reader = new FileReader();

        reader.onload = (e) => {
            const text = JSON.parse(e.target.result).text;
            setText(text);
        }
        reader.readAsText(file);
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
                <p>Выберите уровень сложности:</p>
                <select id="levelTask" {...register("level")}>
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

            
            {
                methodAdding === "manually" && 
                <label htmlFor="addingText">
                    <p>Введите текст:</p>
                    <textarea 
                        id="addingText" 
                        onChange={e => setText(e.target.value)}
                        // мин и макс длину указать
                    />
                </label>
            }
            {
                methodAdding === "file" && 
                <label htmlFor="addingText">
                    <input type="file" id="addingText" onChange={(e) => readFile(e.target.files)}/>
                    <textarea readOnly /*ограничения по уровню*/>
                        {text}
                    </textarea>
                </label>
                
            }
            {
                methodAdding === "generation" && 
                <label htmlFor="addingText">
                    <p>Введите длину текста, который сгенерует система:</p>
                    <input 
                        type="number" 
                        id="lengthText" 
                        onChange={e => setLengthTextGeneration(e.target.value)}
                        // мин и макс длину указать
                    />
                    <button onClick={e => generateText(e, characterSet)}>Сгенерировать</button>
                    <textarea readOnly /*ограничения по уровню */>
                        {text}
                    </textarea>
                </label>
            }
            

            <label htmlFor="countError">
                <p>Сколько ошибок разрешается допустить:</p>
                <input 
                    type="number"
                    id="countError" 
                    // мин и макс количество ошибок
                    {...register("countError")}
                />
            </label>

            <input type="submit" value="Создать"/>
        </form>
    );
}

export default ConstructorTask;