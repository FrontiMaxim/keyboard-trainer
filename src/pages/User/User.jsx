import React from 'react';
import { Line, Bar } from "react-chartjs-2";
import './User.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
  } from 'chart.js';
import { useState } from 'react';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import Information from '../../components/ModalWindow/Information/Information';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
);

function User() {

    const dataSpeed = {
        labels: ['14.02.2022', '15.02.2022', '16.02.2022', '17.02.2022'],
        datasets: [
            {
              data: [0.3, 0.5, 0.35, 0.4],
              lineTension: 0.5,
              borderColor: 'grey',
            }
        ]
    }

    const [dataChart, setData] = useState(dataSpeed);
    const [showLine, setShowLine] = useState(true);
    const [showBar, setShowBar] = useState(false);
    const [isOpenModalWindow, setIsOpenModalWindow] = useState(false);

 
    const login = 'Максим Расторгуев';

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


    const dataError = {
        labels: ['14.02.2022', '15.02.2022', '16.02.2022', '17.02.2022'],
        datasets: [
            {
              data: [6, 8, 2, 5],
              lineTension: 0.5,
              fill: true,
              borderColor: 'grey',
              backgroundColor: '#edfce9',
            }
        ]
    }

    const dataCountTrain = {
        labels: ['14.02.2022', '15.02.2022', '16.02.2022', '17.02.2022'],
        datasets: [
            {
              data: [1, 1, 2, 0],
              lineTension: 0.5,
              backgroundColor: 'grey'
            }
        ]
    }

    function changeData(e) {
        const typeData = e.target.className;
        console.log(typeData);

        switch(typeData) {
            case 'column-error':
                setData(dataError);
                setShowLine(true);
                setShowBar(false);
                break;
            case 'column-count-train':
                setData(dataCountTrain);
                setShowBar(true);
                setShowLine(false);
                break;
            default:
                setData(dataSpeed);
                setShowLine(true);
                setShowBar(false);
        }
    }

    function openModalWindow() {
        setIsOpenModalWindow(true);
    }

    function closeModalWindow() {
        setIsOpenModalWindow(false);
    }
    
    return (
    <div className='User'>

        {
            isOpenModalWindow && 
            <ModalWindow closeModalWindow={closeModalWindow}>
                <Information />
            </ModalWindow>
        }
    
        <div className='User_head'>
            <div className='User_head_login'>
                {login}
            </div>
            <button className='User_head_btn-info' onClick={openModalWindow}>
                Справочная информация
            </button>
        </div>
        <div className='User_main'>
            <div className='User_main_exercises'>

                <div className='User_main_exercises_level'>
                    Уровень сложности: 
                    <select>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                    </select>
                </div>

                <div className='User_main_exercises_list'>
                    Список упражнений
                    <ul>
                        {
                            listExercises.map(({id, name}) => {
                                return <li key={id}>{name}</li>
                            })
                        }
                    </ul>
                </div>

            </div>

            <div className='User_main_statistics'>

                Общая статистика пользователя
                <table className='User_main_statistics_table'>
                    <thead>
                        <th>Средняя скорость набора[сек/сим]</th>
                        <th>Средннее количество ошибок на упражнение</th>
                        <th>Количество тренировок</th>
                    </thead>
                    <tbody>
                        <tr onClick={changeData}>
                            <td className='column-speed'>0.43</td>
                            <td className='column-error'>5</td>
                            <td className='column-count-train'>10</td>
                        </tr>
                    </tbody>
                </table>

                {   
                    showLine &&
                    <Line
                        type="line"
                        width={150}
                        height={50}
                        data={dataChart}
                    />
                }

                {
                    showBar && 

                    <Bar
                        type="bar"
                        width={150}
                        height={50}
                        data={dataChart}
                    />
                }
            </div>
        </div>
    </div>
    )
}

export default User;