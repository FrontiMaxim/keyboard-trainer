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
import Information from '../../components/ModalWindow/Information/Information';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {installExercise} from '../../store/exerciseSlice';
import ModalWindow from '../../components/ModalWindow/ModalWindow';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
);

function User() {

    const username = useSelector((state) => state.user.username);
    const idUser = useSelector((state) => state.user.id);

    const [showLine, setShowLine] = useState(true);
    const [showBar, setShowBar] = useState(false);
    const [isOpenModalWindow, setIsOpenModalWindow] = useState(false);

    const navigate = useNavigate();

    const [exercises, setExercises] = useState([]);
    const [statisticUser, setStatisticUser] = useState({});

    const [level, setLevel] = useState('1');

    const dispatch = useDispatch();

    // данные по скорости для графиков
    const [dataSpeed, setDataSpeed] = useState({});


    // данные по ошибкам для графиков
    const [dataError, setDataError] = useState({});


    // данные по тренировкам для графиков
    const [dataCountTrain, setdataCountTrain] = useState({});

    const [dataChart, setData] = useState({
        labels: [],
        datasets: [
            {
            data: [] ,
            lineTension: 0.5,
            fill: true,
            borderColor: 'grey',
            backgroundColor: '#edfce9',
            }
        ]
    });


    useEffect(() => {
        loadExercises();
        loadStatistic();
    }, [level])


    function loadExercises() {
        axios.get('/exercise/get/all')
        .then(response => {
            const data = response.data;
            setExercises(data);
        });
    }

    async function loadStatistic() {
        await axios.get('/user/chart', {
            params: {idUser: idUser}
        })
        .then(response => {
            const data = response.data;

            const dataError = data.dataError;
            const dataSpeed = data.dataSpeed;
            const dataTrain = data.dataTrain;

            let arrayDate = [];
            let arrayParam = [];

            dataError.forEach(i => {
                arrayDate.push(i.date);
                arrayParam.push(i.param);
            });

            setDataError({
                labels: arrayDate.sort(),
                datasets: [
                    {
                    data: arrayParam ,
                    lineTension: 0.5,
                    fill: true,
                    borderColor: 'grey',
                    backgroundColor: '#edfce9',
                    }
                ]
            });
            
            arrayDate = [];
            arrayParam = [];

            dataSpeed.forEach(i => {
                arrayDate.push(i.date);
                arrayParam.push(i.param);
            });

            setDataSpeed({
                labels: arrayDate.sort(),
                datasets: [
                    {
                    data: arrayParam,
                    lineTension: 0.5,
                    borderColor: 'grey',
                    }
                ]
            });

            arrayDate = [];
            arrayParam = [];

            dataTrain.forEach(i => {
                arrayDate.push(i.date);
                arrayParam.push(i.param);
            });

            setdataCountTrain({
                labels: arrayDate,
                datasets: [
                    {
                    data: arrayParam,
                    lineTension: 0.5,
                    backgroundColor: 'grey'
                    }
                ]
            });
        });

        await axios.get('/user/statistics/get', {
            params: {idUser: idUser}
        })
        .then(response => {
            console.log(response.data)
            setStatisticUser(response.data);
        });

        setData(dataSpeed);
    }


    function changeData(e) {
        const typeData = e.target.className;

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


    async function goToExercise(e, id) {

        const exercise = {
            id: '',
            text: '',
            acceptable_count_errors: 0,
            time: ''
        }

        let level = 1;

        await axios.get('/exercise/get', {
            params: {idExercise: e.currentTarget.id}
        })
        .then(response => {
            const data = response.data;

            exercise.id = data.id;
            exercise.text = data.text;
            exercise.acceptable_count_errors = data.acceptable_count_errors;
            level = data.level;
        });


        await axios.get('/level/get', {
            params: {numberLevel: level}
        })
        .then(response => {
            const data = response.data;
            exercise.time = data.click_time * exercise.text.length;
            exercise.level = data;
        });

        dispatch(installExercise(exercise));
        navigate('/trainer');
    }

    
    return (
    <div className='User'>
        
        {
            isOpenModalWindow && 
            <ModalWindow>
                <Information closeModalWindow={closeModalWindow} />
            </ModalWindow>
        }
    
        <div className='User_head'>
            <div className='User_head_login'>
                {username}
            </div>
            <div>
                <button className='User_head_btn-info' onClick={openModalWindow}>
                    Справочная информация
                </button>
                <button  onClick={() => {navigate('/')}}>
                    Выход
                </button>
            </div>
        </div>
        <div className='User_main'>
            <div className='User_main_exercises'>

                <div className='User_main_exercises_level' onChange={(e) => setLevel(e.target.value)}>
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
                            exercises.map((i) => {
                                if(parseInt(i.level) === parseInt(level))
                                return <li key={i.id} id={i.id} onClick={(e) => goToExercise(e, i.id)}>{i.name}</li>
                            })
                        }
                    </ul>
                </div>

            </div>

            <div className='User_main_statistics'>

                Общая статистика пользователя
                <table className='User_main_statistics_table'>
                    <thead>
                        <th>Средняя скорость набора[символ/сек]</th>
                        <th>Среднее количество ошибок на упражнение</th>
                        <th>Количество тренировок</th>
                    </thead>
                    <tbody>
                        <tr onClick={changeData}>
                            <td className='column-speed'>{statisticUser.averageSpeed}</td>
                            <td className='column-error'>{statisticUser.averageError}</td>
                            <td className='column-count-train'>{statisticUser.countExecution}</td>
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