import React, { useState } from 'react';
import { useForm } from "react-hook-form";

import {restrictions} from './restrictions';
import './ConstructorTask.css';
import '../Constructor.css';

const {minLengthNameText, maxLenghtNameText} = restrictions;
const characterSet = ['f', 'd', 's'];

function ConstructorTask({closeModalWindow, nameForm, nameBtn}) {

   const {register, handleSubmit} = useForm();

   const [methodAdding, setMethodAdding] = useState('manually');

   const [lengthTextGeneration, setLengthTextGeneration] = useState(0);
   const [text, setText] = useState('');

    const onSubmit = (data) => {
       
        if(checkText(characterSet)) {      
            data['text'] = text;
            console.log(data);
        } else {
            alert('Текст упражнения не прошёл проверку на соответствие! Перепроверьте его!');
        }

        closeModalWindow();
    } 

    // автоматическая генерация текста
    function generateText(e, characterSet) {
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

    function readFile(e) {
        const file = e.target.files[0];
     
        const reader = new FileReader();

        reader.onload = (e) => {
            const text = JSON.parse(e.target.result).text;
            setText(text);
        }
        
        reader.readAsText(file);
    }

    
    return (
        <div className='modalWindow'>
            <form className='constructor' onSubmit={handleSubmit(onSubmit)}>
                <h3>{nameForm}</h3>
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
                        <input type="file" id="addingText" onChange={readFile}/>
                        <textarea readonly value={text} /*ограничения по уровню*/ />
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
                        <button type="button" className="btn-generate" onClick={e => generateText(e, characterSet)}>Сгенерировать</button>
                        <textarea readonly value={text}/*ограничения по уровню */ />
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

                <div className='constructor_list-btn'>
                    <button type="submit">{nameBtn}</button>
                    <button type="button" className='btn-cancel' onClick={closeModalWindow}>Отмена</button>
                </div>
                
            </form>
        </div>
    );
}

export default ConstructorTask;