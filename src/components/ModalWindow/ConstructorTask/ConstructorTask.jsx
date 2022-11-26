import React, { useState } from 'react';
import { useForm } from "react-hook-form";

import {restrictions} from './restrictions';
import './ConstructorTask.css';
import '../Constructor.css';
import { useEffect } from 'react';
import axios from 'axios';

const {minLengthNameText, maxLengthNameText} = restrictions;

const letterForZone = {
    1: 'Ёё!1ЙйФфЯя+=ЪъЭэ,.',
    2: '"2№3ЦцЫыЧчУуВвСс_-ЖжЮюБбДдЗз',
    3: ';4КкАаМм ЬьЛлЩщ(9)0',
    4: '%5ЕеПпИиГгОоТтРрНн:6*8'
}

function ConstructorTask({closeModalWindow, nameForm, nameBtn, id}) {


   const { register, handleSubmit, setValue} = useForm({
        defaultValues: {
            id: '',
            nameExercise: '',
            level: 1,
            allowedCountError: 0,
        },
    });

    const [infoLevel, setInfoLevel ] = useState({
        maxCountError: 0,
        maxLengthText: 0,
        minLengthText: 0
    });

   const [methodAdding, setMethodAdding] = useState('manually');

   const [lengthTextGeneration, setLengthTextGeneration] = useState(0);
   const [text, setText] = useState('');

   const [ characters, setCharacters ] = useState('');

    const onSubmit = (data) => {
       
        // if(checkText(characterSet)) {      
        //     data['text'] = text;
        //     console.log(data);
        // } else {
        //     alert('Текст упражнения не прошёл проверку на соответствие! Перепроверьте его!');
        // }

        closeModalWindow();
    } 


    // подгрузка упражнений
    // useEffect(() => {
    //     if (nameForm === 'Редактивание упражнения') {
    //         axios.get('./', {
    //             params: id
    //         })
    //         .then(data => {
    //             setValue('id', data.id);
    //             setValue('nameExercise', data.nameExercise);
    //             setValue('level', data.level);
    //             setValue(' allowedCountError', data.allowedCountError);
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         });
    //     }
    // }, []);


    // // подгрузка ограничений уровня
    // useEffect(() => {
    //     axios.get('./', {
    //         params: register.level
    //     })
    //     .then(data => {
    //         setInfoLevel({
    //             maxCountError: data.maxCountError,
    //             maxLenghtText: data.maxLenghtText,
    //             minLenghtText: data.minLenghtText,
    //         });

    //         characterSet = '';
    //         data.zones.map(z => characterSet += letterForZone[z]);
    //     })
    //     .catch(err => console.log(err));
    // }, [register.level]);


    // автоматическая генерация текста
    function generateText() {
        let text = '';
        for(let i = 0; i < lengthTextGeneration; i++) {
            text += characters[Math.floor(Math.random() * characters.length)];
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
                        maxLength={maxLengthNameText} 
                        {...register("nameExercise")}
                    />
                    <div className="prompt">Допустимая длина названия: {minLengthNameText}-{maxLengthNameText}</div>
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
                            minLength={infoLevel.minLengthText}
                            maxLength={infoLevel.maxLengthText}
                        />
                        <div className="prompt">Допустимая длина текста: {infoLevel.minLengthText}-{infoLevel.maxLengthText}</div>
                    </label>
                }
                {
                    methodAdding === "file" && 
                    <label htmlFor="addingText">
                        <input type="file" id="addingText" onChange={readFile}/>
                        <textarea readonly value={text} 
                            minLength={infoLevel.minLengthText}
                            maxLength={infoLevel.maxLengthText}
                        />
                        <div className="prompt">Допустимая длина текста: {infoLevel.minLengthText}-{infoLevel.maxLengthText}</div>
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
                            minLength={infoLevel.minLengthText}
                            maxLength={infoLevel.maxLengthText}
                        />
                        <div className="prompt">Допустимая длина текста: {infoLevel.minLengthText}-{infoLevel.maxLengthText}</div>
                        
                        <button type="button" className="btn-generate" onClick={generateText}>Сгенерировать</button>
                        <textarea readonly value={text}
                            minLength={infoLevel.minLengthText}
                            maxLength={infoLevel.maxLengthText}
                        />
                        <div className="prompt">Допустимая длина текста: {infoLevel.minLengthText}-{infoLevel.maxLengthText}</div>
                    </label>
                }


                <label htmlFor="countError">
                    <p>Сколько ошибок разрешается допустить:</p>
                    <input 
                        type="number"
                        id="countError" 
                        minLength='0'
                        maxLength={infoLevel.maxCountError}
                        {...register("allowedCountError")}
                    />
                    <div className="prompt">Допустимый диапозон: 0-{infoLevel.maxCountError}</div>
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