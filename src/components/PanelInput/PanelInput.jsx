import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useDispatch } from 'react-redux';

import {restrictions} from "./restrictions";
import './PanelInput.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { installUser } from "../../store/userSlice";

const {minLengthLogin, maxLengthLogin, minLengthPassword, maxLengthPassword} = restrictions;

function PanelInput() {

  const {register, handleSubmit} = useForm();
  
  const navigate = useNavigate();

  const dispatch = useDispatch();

  let action = 'registration';

  const onSubmit = (data) => {
    if(action === 'registration') {
      signup(data);
    } else if (action === 'login') {
      signin(data);
    }
  }

  const [isRegistration, setIsRegistration] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('message');


  // регистрация
  async function signup(data) {
  
    try {
      let status = await axios.post('/signup', data);
      status = await status.status;
      if(status === 201) {
        setIsRegistration(true);
        setMessage('Регистрация прошла успешно...');
        setIsError(false);
      } else {
        setIsError(true);
        setMessage('Ошибка при регистрации...');
      }
    } catch(e) {
        console.log(e);
    }
  }


  // вход
  async function signin(data) {
   
    try {
      let result = await (axios.post('/signin', data));
      let status = await result.status;

      if (status === 200) {
        let user = await result.data;
        dispatch(installUser(user));

        if(user.role === 1) {
          navigate('/admin');
        } else if (user.role === 0) {
          navigate('/user');
        } 
      }  else {
        setIsError(true);
        setMessage('Такого пользователя не существует...');
      }
    } catch(e) {
        console.log(e);
    }
}


  return (
    <form className="panel_input" onSubmit={handleSubmit(onSubmit)}>
      <h3>Панель регистрации/входа</h3>
      <label htmlFor="login">
          <input 
              id="login" 
              type="text" 
              placeholder="Логин" 
              minLength={minLengthLogin} 
              maxLength={maxLengthLogin} 
              {...register("username")}
          />
          <div className="prompt">Количество символов: {minLengthLogin}-{maxLengthLogin}</div>
      </label>
      <label htmlFor="password">
          <input 
              id="password" 
              type="password" 
              placeholder="Пароль" 
              minLength={minLengthPassword} 
              maxLength={maxLengthPassword} 
              {...register("password")}
          />
          <div className="prompt">Количество символов: {minLengthPassword}-{maxLengthPassword}</div>
      </label>
      <div className="panel_input_submits">
          <input 
            className="panel_input_submits_registration" 
            type="submit" 
            value="Зарегистрироваться" 
            onClick={() =>  {
              action = 'registration'
            }}
          />
          <input 
            className="panel_input_submits_input" 
            type="submit" 
            value="Войти" 
            onClick={() =>  {
              action = 'login'
            }}
          />
      </div>

      {
        (isError || isRegistration)  &&
        <div style={{color: isError ? 'red': 'green'}}>
          {message} 
        </div>
      }
    </form>
  )
}

export default PanelInput;