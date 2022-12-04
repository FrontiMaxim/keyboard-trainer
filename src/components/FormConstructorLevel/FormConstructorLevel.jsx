import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../Input/Input';
import Select from '../Select/Select';
import CheckBox from '../CheckBox/CheckBox';
import {restrictions} from './restrictions';
import { useSendData } from '../../hooks/useSendData';
import styles from './FormConstructorLevel.module.css';

function FormConstructorLevel({closeModalWindow}) {

    const  {
        minLenghtTextOneLevel,
        maxLenghtTextOneLevel,
        maxLenghtTextTwoLevel,
        maxLenghtTextThreeLevel,
        minPressKey,
        maxPressKey,
        // количество ошибок указано в процентах
        maxCountErrorOneLevel,
        maxCountErrorTwoLevel,
        maxCountErrorThreeLevel,
    } = restrictions;


    const dataOptions = [
        {text: '1', value: 1},
        {text: '2', value: 2},
        {text: '3', value: 3}
    ];

    const dataCheckBox = [
        {text: '1', value: 1},
        {text: '2', value: 2},
        {text: '3', value: 3},
        {text: '4', value: 4}
    ];

    const [level, setLevel] = useState(1);

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
    });

    const query = useSendData();


    const watchMinLenghtText = watch('minimum_exercise_length', 10);
    const watchLevel = watch('id', 1);

    /* проблема изменения watchLevel: изменеятся, даже если его не затарагиваешь, поэтому введено
    сравнение с предыдущим значением, чтобы предотвратить повторный запрос */
    // в начале watchLevel == 1
    const prevLevel = useRef(0);
    useEffect(() => {
        if(prevLevel.current !== parseInt(watchLevel)) {
            loadLevel();
            prevLevel.current = parseInt(watchLevel);
        }
    }, [watchLevel]);

    
    const loadLevel = async () => {
        const {data} = await query('/level/get', 'get', {numberLevel: watchLevel}, null);

        setValue('id', data.id);
        setValue('maximum_count_errors', data.maximum_count_errors);
        setValue('maximum_exercise_length', data.maximum_exercise_length);
        setValue('minimum_exercise_length', data.minimum_exercise_length);
        setValue('click_time', data.click_time);
        setValue('keyboard_area', data.keyboard_area.split(''));
    };

    const sendData = (data) => {
       
        data.keyboard_area =  data.keyboard_area.join('');

        query('/level/update', 'post', null, data);

        closeModalWindow();
    }

    return (
        <form  className={styles.constructor} onSubmit={handleSubmit(sendData)}>

            <h3 className={styles.h3}>Настройка уровня</h3>

            <Select 
                nameField='id' 
                register={register}
                textLabel='Уровень сложности'
                dataOptions={dataOptions}
            />

            <CheckBox 
                nameField='keyboard_area' 
                register={register} 
                textLabel='Зоны клавиатуры'
                dataCheckBox={dataCheckBox}
            />
            
            <Input 
                type='number'
                register={register}
                textLabel='Время нажатия клавиши'
                textHelp='Допустимый диапазон'
                nameField='click_time' 
                max={maxPressKey} 
                min={minPressKey} 
                errors={errors}
                step={0.1}
                getValues={getValues}
                setValue={setValue}
            />

            <Input 
                type='number'
                register={register}
                textLabel='Минимальная длина упражнения'
                textHelp='Допустимый диапазон'
                nameField='minimum_exercise_length' 
                max={
                    parseInt(watchLevel) === 1 ? maxLenghtTextOneLevel :
                    parseInt(watchLevel) === 2 ? maxLenghtTextTwoLevel : maxLenghtTextThreeLevel
                } 
                min={
                    parseInt(watchLevel) === 1 ? minLenghtTextOneLevel :
                    parseInt(watchLevel) === 2 ? maxLenghtTextOneLevel : maxLenghtTextTwoLevel
                } 
                errors={errors}
                step={1}
                getValues={getValues}
                setValue={setValue}
            />

            <Input 
                type='number'
                register={register}
                textLabel='Максимальная длина упражнения'
                textHelp='Допустимый диапазон'
                nameField='maximum_exercise_length' 
                max={
                    parseInt(watchLevel) === 1 ? maxLenghtTextOneLevel :
                    parseInt(watchLevel) === 2 ? maxLenghtTextTwoLevel : maxLenghtTextThreeLevel
                } 
                min={watchMinLenghtText} 
                errors={errors}
                step={1}
                getValues={getValues}
                setValue={setValue}
            />

            <Input 
                type='number'
                register={register}
                textLabel='Максимальное количество ошибок в %'
                textHelp='Допустимый диапазон'
                nameField='maximum_count_errors' 
                max={
                    parseInt(watchLevel) === 1 ? maxCountErrorOneLevel:
                    parseInt(watchLevel) === 2 ? maxCountErrorTwoLevel : maxCountErrorThreeLevel
                } 
                min={0} 
                errors={errors}
                step={1}
                getValues={getValues}
                setValue={setValue}
            />

            <div className={styles.list_btn}>
                <button type="submit" className={styles.btn}>Применить</button>
                <button type="button" className={styles.btn} onClick={closeModalWindow}>Отмена</button>
            </div>
        </form>
    )
}

export default FormConstructorLevel;