import React, { useEffect } from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../Input/Input';
import Select from '../Select/Select';
import {restrictions} from './restrictions';
import { useSendData } from '../../hooks/useSendData';
import styles from './FormConstructorExercise.module.css';
import InputFile from '../InputFile/InputFile';
import Textarea from '../Textarea/Textarea';

function FormConstructorExercise({closeModalWindow, nameForm, nameBtn, id, loadExercise}) {


    const letterForZone = {
        '1': 'Ёё!1ЙйФфЯя+=ЪъЭэ,.',
        '2': '"2№3ЦцЫыЧчУуВвСс_-ЖжЮюБбДдЗз',
        '3': ';4КкАаМм ЬьЛлЩщ(9)0',
        '4': '%5ЕеПпИиГгОоТтРрНн:6*8'
    }

    const  {
        minLengthNameText,
        maxLengthNameText,
    } = restrictions;


    const dataOptions = [
        {text: '1', value: 1},
        {text: '2', value: 2},
        {text: '3', value: 3}
    ];

    const dataMethodInput = [
        {text: 'вручную', value: 'manually'},
        {text: 'из файла', value: 'file'},
        {text: 'генерация системой', value: 'generation'}
    ];      

    const {
        register,
        formState: {
            errors
        },
        watch,
        handleSubmit, 
        setValue,
        getValues
    } = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        defaultValues: {
            name: '',
            level: 1,
            method_input: 'manually',
            length_text_generation: 0,
            text: '',
            acceptable_count_errors: 0,
        },
    });

    const [levelRestrictions, setLevelRestrictions] = useState({
        maximum_count_errors: 0,
        maximum_exercise_length: 0,
        minimum_exercise_length: 0,
        keyboard_area: [] 
    });


    const watchText = watch('text', '');
    const watchMethodInput = watch('method_input', 'manually');
    const watchLengthTextGeneration = watch('length_text_generation', 0);
    const watchLevel = watch('level', 1); 
 
 
    const [ alphabet, setAlphabet ] = useState('');

    // подгрузка уровня
    useEffect(() => {
        loadingLevelRestrictions(); 
    }, [watchLevel]);


    // метод для подгрузки уровня
    const loadingLevelRestrictions = async () => {
        const { data } = await query('/level/get', 'get', { numberLevel: watchLevel }, null);

        setLevelRestrictions({
            maximum_count_errors: data.maximum_count_errors,
            maximum_exercise_length: data.maximum_exercise_length,
            minimum_exercise_length: data.minimum_exercise_length,
            keyboard_area: data.keyboard_area.split('')
        });

        let newAlphabet = '';
        data.keyboard_area.split('').map(z =>  newAlphabet += letterForZone[z])
        setAlphabet(newAlphabet);
    }


    // подгрузка упражнения
    useEffect(() => {
        if (nameForm === 'Редактирование упражнения') {
            loadingExercise();
        }
    }, []);


    // метод для подгрузки упражнения, если форма в режиме редактирования упражнения
    const loadingExercise = async () => {
        const { data } = await query('/exercise/get', 'get', {idExercise: id}, null);

        setValue('id', data.id);
        setValue('name', data.name);
        setValue('acceptable_count_errors', data.acceptable_count_errors);
        setValue('level', data.level);
        setValue('text', data.text)
    }


    // автоматическая генерация текста
    function generateText() {
        let text = '';
        for(let i = 0; i < parseInt(watchLengthTextGeneration); i++) {
            text += alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        setValue('text', text);
    }


    function readFile(e) {
        const file = e.target.files[0];
     
        const reader = new FileReader();

        reader.onload = (e) => {
            const text = JSON.parse(e.target.result).text;
            setValue('text', text);
        }
        
        reader.readAsText(file);
    }

    const query = useSendData();

    const loadLevel = async () => {
        const {data} = await query('/level/get', 'get', {numberLevel: watchLevel}, null);

        setValue('id', data.id);
        setValue('maximum_count_errors', data.maximum_count_errors);
        setValue('maximum_exercise_length', data.maximum_exercise_length);
        setValue('minimum_exercise_length', data.minimum_exercise_length);
        setValue('click_time', data.click_time);
        setValue('keyboard_area', data.keyboard_area.split(''));
    };

    const sendData = async (data) => {

        delete data['method_input'];
        delete data['length_text_generation'];
      
        console.log(data);

        if (nameForm === 'Редактирование упражнения') {
            query('/exercise/update', data);
        } else {
            query('/exercise/create', data);
        }

        await loadExercise();
        closeModalWindow();
    }
    
    return (
        <form  className={styles.constructor} onSubmit={handleSubmit(sendData)}>

            <h3 className={styles.h3}>{nameForm}</h3>
   
            <Input 
                nameField='name'
                register={register}
                errors={errors}
                maxLength={maxLengthNameText} 
                minLength={minLengthNameText} 
                textLabel='Введите название упражнения'
                textHelp='Допустимое количество символов'
            />

            <Select 
                nameField='level' 
                register={register}
                textLabel='Уровень сложности'
                dataOptions={dataOptions}
            />

            <Select 
                nameField='method_input'
                register={register}
                textLabel='Cпособ ввода текста'
                dataOptions={dataMethodInput}
            />

            {
                watchMethodInput === 'file' && 
                <InputFile readFile={readFile} accept={['.json']} />
            }
            {
                watchMethodInput === 'generation' && 
                <>
                    <Input 
                        type='number'
                        register={register}
                        textLabel='Введите длину текста, который сгенерует система'
                        textHelp='Допустимый диапазон'
                        nameField='length_text_generation' 
                        min={levelRestrictions.minimum_exercise_length}
                        max={levelRestrictions.maximum_exercise_length}
                        errors={errors}
                        step={1}
                    />

                    <button onClick={generateText}>Сгенерировать</button>
                </>
                
            }

            <Textarea 
                nameField='text'
                minLength={levelRestrictions.minimum_exercise_length}
                maxLength={levelRestrictions.maximum_exercise_length}
                register={register} 
                errors={errors}
                textHelp='Допустимое количество символов'
                alphabet={alphabet}
            />
  
            <Input 
                type='number'
                register={register}
                textLabel='Сколько ошибок разрешается допустить'
                textHelp='Допустимый диапазон'
                nameField='acceptable_count_errors' 
                max={Math.round(levelRestrictions.maximum_count_errors / 100 * watchText.length)} 
                min={0} 
                errors={errors}
                step={1}
            />

            <div className={styles.list_btn}>
                <button type="submit" className={styles.btn}>Применить</button>
                <button type="button" className={styles.btn} onClick={closeModalWindow}>Отмена</button>
            </div>
        </form>
    )
}

export default FormConstructorExercise;