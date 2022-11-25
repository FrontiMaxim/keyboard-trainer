import React from 'react'
import { useState } from 'react';
import Information from '../../components/ModalWindow/Information/Information';
import ConstructorTask from '../../components/ModalWindow/ConstructorTask/ConstructorTask';
import ConstructorLevel from '../../components/ModalWindow/ConstructorLevel/ConstructorLevel';
import './Admin.css';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

function Admin() {

    const username = useSelector((state) => state.user.username);

    const [isOpenModalWindow, setIsOpenModalWindow] = useState(false);
    const [typeModalWindow, setTypeModalWindow] = useState('info');

    const [exercises, setExercises] = useState([]);
    const [users, setUsers] = useState([]);
    const [statisticExercise, setstatisticExercise] = useState({});
    const [statisticUser, setstatisticUser] = useState({});

    const listExercises = [
        {id: 0, name: 'Название_1'},
        {id: 1, name: 'Название_2'},
        {id: 2, name: 'Название_3'},
        {id: 3, name: 'Название_4'},
        {id: 4, name: 'Название_5'},
        {id: 5, name: 'Название_6'},
        {id: 6, name: 'Название_7'},
        {id: 7, name: 'Название_8'},
        {id: 8, name: 'Название_9'},
        {id: 9, name: 'Название_10'},
        {id: 10, name: 'Название_11'},
        {id: 11, name: 'Название_12'},
    ];

    function openModalWindow(event) {
        const typeBtn = event.target.dataset.type;
        
        switch (typeBtn) {
            case 'info':
                setTypeModalWindow('info');
                break
            case 'redact':
                setTypeModalWindow('redact');
                break
            case 'create':
                setTypeModalWindow('create');
                break
            case 'change':
                setTypeModalWindow('change');
                break
            default:
        }
        setIsOpenModalWindow(true);
    }

    function closeModalWindow(event) {
        setIsOpenModalWindow(false);
    }


    // реализовать удаление упражнение
    function deleteExercises() {

    }

    // загрузка упражнений и пользователей
    useEffect(() => {

    }, []);

    return (
        <div className='admin'>
            {
                isOpenModalWindow && typeModalWindow === 'info' &&
                <Information closeModalWindow={closeModalWindow} />
            }

            {
                isOpenModalWindow && (typeModalWindow === 'redact' || typeModalWindow === 'create') &&
                <ConstructorTask 
                    closeModalWindow={closeModalWindow} 
                    nameForm={typeModalWindow === 'redact' ? 'Редактивание упражнения' : 'Создание упражнения'} 
                    nameBtn={typeModalWindow === 'redact' ? 'Сохранить' : 'Создать'}
                />
            }

            {   
                isOpenModalWindow && typeModalWindow === 'change' &&
                <ConstructorLevel closeModalWindow={closeModalWindow}/>
            }
        
            <div className='admin_head'>
                <div className='admin_head_login'>
                    {username}
                    <button className='admin_head_btn-change' onClick={openModalWindow} data-type="change"> 
                         Настроить уровень
                    </button>
                    <button className='admin_head_btn-create' onClick={openModalWindow} data-type="create"> 
                         Создать упражнение
                    </button>
                </div>
                <button className='admin_head_btn-info' onClick={openModalWindow} data-type="info"> 
                    Справочная информация
                </button>
            </div>


            <div className='admin_main'>
                <div className='admin_main_exercises'>
                    <div className='admin_main_list'>
                        Список упражнений
                        <ul>
                            {
                                listExercises.map(({id, name}) => {
                                    return <li key={id}>
                                        {name}
                                        <div>
                                            <button 
                                                className='btn-redact-exercises'
                                                onClick={openModalWindow}
                                                data-type="redact"
                                            >   
                                                Редактировать
                                            </button>
                                            <button 
                                                className='btn-delete-exercises'
                                                onClick={deleteExercises}
                                            >
                                                Удалить
                                            </button>
                                         </div>
                                    </li>
                                })
                            }
                        </ul>
                    </div>

                    <table className='admin_main_table'>
                        <thead>
                            <th>Среднее количество ошибок</th>
                            <th>Среднее время выполнения</th>
                            <th>Количество выполнений</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2</td>
                                <td>5</td>
                                <td>10</td>
                            </tr>
                        </tbody>
                    </table>

                </div>

                <div className='admin_main_users'>
                    <div className='admin_main_list'>
                        Список пользователей
                        <ul>
                            {
                                listExercises.map(({id, name}) => {
                                    return <li key={id}>{name}</li>
                                })
                            }
                        </ul>
                    </div>

                    <table className='admin_main_table'>
                        <thead>
                            <th>Средняя скорость набора[символ/сек]</th>
                            <th>Среднее количество ошибок на упражнение</th>
                            <th>Количество тренировок</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2</td>
                                <td>5</td>
                                <td>10</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Admin;