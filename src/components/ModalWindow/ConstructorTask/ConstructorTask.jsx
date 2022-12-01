import React, { useState } from 'react';
import { useForm } from "react-hook-form";

import {restrictions} from './restrictions';
import './ConstructorTask.css';
import '../Constructor.css';
import { useEffect } from 'react';
import axios from 'axios';

const {minLengthNameText, maxLengthNameText} = restrictions;

const letterForZone = {
    '1': 'Ёё!1ЙйФфЯя+=ЪъЭэ,.',
    '2': '"2№3ЦцЫыЧчУуВвСс_-ЖжЮюБбДдЗз',
    '3': ';4КкАаМм ЬьЛлЩщ(9)0',
    '4': '%5ЕеПпИиГгОоТтРрНн:6*8'
}

function ConstructorTask({closeModalWindow, nameForm, nameBtn, id, loadExercise}) {

   const { register, handleSubmit, setValue} = useForm({
        defaultValues: {
            id: '',
            name: '',
            text: 1,
            acceptable_count_errors: 0,
        },
    });

    const [infoLevel, setInfoLevel ] = useState({
        id: 1,
        maximum_count_errors: 0,
        maximum_exercise_length: 0,
        minimum_exercise_length: 0,
        click_time: 0,
        keyboard_area: [1, 2] 
    });

   const [methodAdding, setMethodAdding] = useState('manually');

   const [lengthTextGeneration, setLengthTextGeneration] = useState(0);
   const [text, setText] = useState('');

   const [level, setLevel] = useState('1');

   const [ characters, setCharacters ] = useState('');

    const onSubmit = async (data) => {
       
        if(checkText(characters)) {      
            data['text'] = text;
            data['level'] = infoLevel;

            if (nameForm === 'Редактирование упражнения') {
                axios.post('/exercise/update', data)
            } else {
                axios.post('/exercise/create', data);
            }
            await loadExercise();
        } else {
            alert('Текст упражнения не прошёл проверку на соответствие! Перепроверьте его!');
        }

        closeModalWindow();
    } 


    //подгрузка упражнения
    useEffect(() => {
        if (nameForm === 'Редактирование упражнения') {
            axios.get('/exercise/get', {
                params: {idExercise: id}
            })
            .then(response => {
                const data = response.data;
                console.log(response)
                setValue('id', data.id);
                setValue('name', data.name);
                setValue('acceptable_count_errors', data.acceptable_count_errors);
                
                setLevel(data.level);
                setText(data.text);
            })
            .catch(err => {
                console.log(err);
            });
        }
    }, []);


    // подгрузка ограничений уровня
    useEffect(() => {
        axios.get('/level/get', {
            params: { numberLevel: level },
        })
        .then(response => {
            const data = response.data;
            setInfoLevel({
                id: data.id,
                click_time: data.click_time,
                maximum_count_errors: data.maximum_count_errors,
                maximum_exercise_length: data.maximum_exercise_length,
                minimum_exercise_length: data.minimum_exercise_length,
            });

            setCharacters('');
            console.log(data)
            data.keyboard_area.split('').map(z => setCharacters(prev => prev += letterForZone[z]));
        })
        .catch(err => console.log(err));
    }, [level]);


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
                        {...register("name")}
                    />
                    <div className="prompt">Допустимая длина названия: {minLengthNameText}-{maxLengthNameText}</div>
                </label>

                <label htmlFor="levelTask">
                    <p>Выберите уровень сложности:</p>
                    <select id="levelTask" onChange={(e) => setLevel(e.target.value)} value={level}>
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
                    <div className="prompt">Допустимые символы: {characters}</div>
                </label>


                {
                    methodAdding === "manually" && 
                    <label htmlFor="addingText">
                        <p>Введите текст:</p>
                        <textarea 
                            id="addingText" 
                            onChange={e => setText(e.target.value)}
                            minLength={infoLevel.minimum_exercise_length}
                            maxLength={infoLevel.maximum_exercise_length}
                            value={text}
                        />
                        <div className="prompt">Допустимая длина текста: {infoLevel.minimum_exercise_length}-{infoLevel.maximum_exercise_length}</div>
                    </label>
                }
                {
                    methodAdding === "file" && 
                    <label htmlFor="addingText">
                        <input type="file" id="addingText" onChange={readFile}/>
                        <textarea  value={text} 
                            minLength={infoLevel.minimum_exercise_length}
                            maxLength={infoLevel.maximum_exercise_length}
                        />
                        <div className="prompt">Допустимая длина текста: {infoLevel.minimum_exercise_length}-{infoLevel.maximum_exercise_length}</div>
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
                            min={infoLevel.minimum_exercise_length}
                            max={infoLevel.maximum_exercise_length}
                        />
                        <div className="prompt">Допустимая длина текста: {infoLevel.minimum_exercise_length}-{infoLevel.maximum_exercise_length}</div>
                        
                        <button type="button" className="btn-generate" onClick={generateText}>Сгенерировать</button>
                        <textarea value={text}
                            minLength={infoLevel.minimum_exercise_length}
                            maxLength={infoLevel.maximum_exercise_length}
                        />
                        <div className="prompt">Допустимая длина текста: {infoLevel.minimum_exercise_length}-{infoLevel.maximum_exercise_length}</div>
                    </label>
                }


                <label htmlFor="countError">
                    <p>Сколько ошибок разрешается допустить:</p>
                    <input 
                        type="number"
                        id="countError" 
                        min='0'
                        max={Math.round(infoLevel.maximum_count_errors / 100 * text.length)}
                        {...register("acceptable_count_errors")}
                    />
                    <div className="prompt">Допустимый диапозон: 0-{Math.round(infoLevel.maximum_count_errors / 100 * text.length)}</div>
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