import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {restrictions} from "./restrictions";
import './PanelInput.css';

const {minLengthLogin, maxLengthLogin, minLengthPassword, maxLengthPassword} = restrictions;

function PanelInput() {

  const {register, handleSubmit} = useForm();

  const onSubmit = data => console.log(data);

  const [isRegistration, setIsRegistration] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('message');


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
              {...register("login")}
          />
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
      </label>
      <div className="panel_input_submits">
          <input className="panel_input_submits_registration" type="submit" value="Зарегистрироваться"/>
          <input className="panel_input_submits_input" type="submit" value="Войти"/>
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