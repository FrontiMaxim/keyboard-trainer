import React from 'react'
import { useState } from 'react';
import Information from '../../components/ModalWindow/Information/Information';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import FormConstructorLevel from '../../components/FormConstructorLevel/FormConstructorLevel';
import FormConstructorExercise from '../../components/FormConstructorExercise/FormConstructorExercise';
import './Admin.css';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Admin() {

    const username = useSelector((state) => state.user.username);

    const [isOpenModalWindow, setIsOpenModalWindow] = useState(false);
    const [typeModalWindow, setTypeModalWindow] = useState('info');

    const [exercises, setExercises] = useState([]);
    const [idExercise, setIdExercises] = useState(0);

    const navigate = useNavigate();


    const [users, setUsers] = useState([]);
    const [statisticExercise, setStatisticExercise] = useState({
        averageError: 0,
        averageTimeExecution: 0,
        countExecution: 0
    });
    
    const [statisticUser, setStatisticUser] = useState({
        averageError: 0,
        averageSpeed: 0,
        countExecution: 0
    });

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


    // удаление упражнения
    async function deleteExercises(e, id) {
        await axios.delete('/exercise/delete', {
            params: {idExercise: id}
        })
        loadExercise();
    }

    // загрузка пользователей
    function loadUsers() {
        axios.get('/user/get/all')
        .then(response => {
            setUsers(response.data);
        });
    }

    // загрузка упражнений
    async function loadExercise() {
        await axios.get('/exercise/get/all')
        .then(response => {
            console.log(response);
            setExercises(response.data);
        });
    }

    // загрузка упражнений и пользователей
    useEffect(() => {

        if (isOpenModalWindow === false) {
            loadUsers();
            loadExercise();
        }
    }, [isOpenModalWindow]);


    async function loadStatisticExercises(e, id) {
        await axios.get('/exercise/statistics/get', {
            params: {idExercise: id}
        })
        .then(response => {
            setStatisticExercise(response.data)
        });
    }


    async function loadStatisticUser(e, id) {
        axios.get('/user/statistics/get', {
            params: {idUser: id}
        })
        .then(response => {
            console.log(response);
            setStatisticUser(response.data)
        });
    }


    return (
        <div className='admin'>

            {
                 isOpenModalWindow && 
                 <ModalWindow>           
                     {
                         typeModalWindow === 'info' &&
                         <Information closeModalWindow={closeModalWindow} />
                     }
                     {
                         (typeModalWindow === 'redact' || typeModalWindow === 'create') &&
                         <FormConstructorExercise 
                             closeModalWindow={closeModalWindow} 
                             nameForm={typeModalWindow === 'redact' ? 'Редактирование упражнения' : 'Создание упражнения'} 
                             nameBtn={typeModalWindow === 'redact' ? 'Сохранить' : 'Создать'}
                             loadExercise={loadExercise}
                             id={idExercise}
                         />
                     }
     
                     {   
                         typeModalWindow === 'change' &&
                         <FormConstructorLevel closeModalWindow={closeModalWindow}/>
                     }
                 </ModalWindow>
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
                <div>
                    <button  className='User_head_btn-info'>
                        <Link className='link'
                            target="_blank"
                            to="/guide"
                        >
                            Руководство пользователя
                        </Link>
                    </button>
                    <button className='admin_head_btn-info' onClick={openModalWindow} data-type="info"> 
                        Справочная информация
                    </button>
                    <button  onClick={() => {navigate('/')}}> 
                        Выйти
                    </button>
                </div>
            </div>
           
            <div className='admin_main'>
                <div className='admin_main_exercises'>
                    <div className='admin_main_list'>
                        Список упражнений
                        <ul>
                            {
                                exercises.map(({id, name, ...data}) => {
                                    return <li key={id} id={id} onClick={(e) => { loadStatisticExercises(e, id) }}>
                                        {name}
                                        <div>
                                            <button 
                                                className='btn-redact-exercises'
                                                onClick={(e) => {
                                                    setIdExercises(id);
                                                    openModalWindow(e);
                                                }}
                                                data-type="redact"
                                            >   
                                                Редактировать
                                            </button>
                                            <button 
                                                className='btn-delete-exercises'
                                                onClick={(e) => { deleteExercises(e, id) }}
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
                                <td>{statisticExercise.averageError}</td>
                                <td>{statisticExercise.averageTimeExecution}</td>
                                <td>{statisticExercise.countExecution}</td>
                            </tr>
                        </tbody>
                    </table>

                </div>

                <div className='admin_main_users'>
                    <div className='admin_main_list'>
                        Список пользователей
                        <ul>
                            {
                                users.map(({id, username, role, ...data}) => {
                                    if (role !== 1) return <li key={id} id={id} onClick={(e) => loadStatisticUser(e, id)}>{username}</li>
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
                                <td>{statisticUser.averageSpeed}</td>
                                <td>{statisticUser.averageError}</td>
                                <td>{statisticUser.countExecution}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Admin;