import React from "react"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import styles from './FormLogin.module.css';
import {restrictions} from "./restrictions";
import { useNavigate } from "react-router-dom";

import { installUser } from "../../store/userSlice";
import Input from "../Input/Input";
import { useSendData } from "../../hooks/useSendData";

function FormLogin() {

    const {minLengthLogin, maxLengthLogin, minLengthPassword, maxLengthPassword} = restrictions;

    const {
        register, 
        formState: {
            errors
        },
        handleSubmit, 
    } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
    });
  
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');

    const query = useSendData();

     // регистрация
    async function signup(user) {

        const { status } = await query('/signup', 'post', null, user);
       
        if (status === 201) {
            setMessage('Регистрация прошла успешно...');
            setIsError(false);
        } else if(status === 302) {
            setMessage('Такой пользователь уже существует...');
            setIsError(true);
        }
    }


    // вход
    async function signin(user) {

        const { status, data } = await query('/signin', 'post', null, user);

        if (status === 200) {
            dispatch(installUser(data))
            if(data.role === 1) {
                navigate('/admin');
            } else if (data.role === 0) {
                navigate('/user');
            } 
        } else if(status === 404 || 500) {
            setIsError(true);
            setMessage('Такого пользователя не существует...');
        }
    }

    return (
        <form className={styles.form_login}>
            <h3 className={styles.h3}>Панель регистрации/входа</h3>
            
            <Input
                nameField='username'
                register={register}
                textLabel='Логин'
                textHelp='Допустимое количество символов'
                minLength={minLengthLogin} 
                maxLength={maxLengthLogin} 
                errors={errors}
            />


            <Input
                nameField='password'
                type='password'
                register={register}
                textLabel='Пароль'
                textHelp='Допустимое количество символов'
                minLength={minLengthPassword} 
                maxLength={maxLengthPassword} 
                errors={errors}
            />
               
            
            <div className={styles.list_btn}>
                <button  className={styles.btn} onClick={handleSubmit(signup)}>Зарегистрироваться</button>
                <button  className={styles.btn} onClick={handleSubmit(signin)}>Войти</button>
            </div>

            
            <div style={{color: isError ? 'red': 'green'}}>
                {message} 
            </div>
        
        </form>
  )
}

export default FormLogin