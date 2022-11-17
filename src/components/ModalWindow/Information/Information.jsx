import React from 'react';
import './Information.css';

function Information() {
  return (
    <div className='information'>
        <h2>Информация о разработчикаx</h2>
        <hr />
        <p><strong>Лабораторный практикум по дисциплине: </strong>"Технологии программирования"</p>
        <p><strong>Тема: </strong>"Автоматизированная система «Клавиатурный тренажер» с функциями администратора"</p>
        <p><strong>Разработчики: </strong>студенты группы 6403-090301D :</p>
        <ul>
            <li>Расторгуев Максим</li>
            <li>Константин Коваленко</li>
            <li>Нехожин Олег</li>
        </ul>
        <p><strong>Руководитель: </strong>Зеленко Лариса Сергеевна</p>
        <p>Самарский университет 2022</p>
    </div>
  )
}

export default Information