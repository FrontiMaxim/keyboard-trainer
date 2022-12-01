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

    const [showLine, setShowLine] = useState(true);
    const [showBar, setShowBar] = useState(false);
    const [isOpenModalWindow, setIsOpenModalWindow] = useState(false);

    const navigate = useNavigate();

    const [exercises, setExercises] = useState([]);
    const [statisticUser, setstatisticUser] = useState({});

    const [level, setLevel] = useState('1');

    const dispatch = useDispatch();

    // данные по скорости для графиков
    const [dataSpeed, setDataSpeed] = useState({
            labels: ['14.02.2022', '15.02.2022', '16.02.2022', '17.02.2022'],
            datasets: [
                {
                data: [3, 5, 2, 4],
                lineTension: 0.5,
                borderColor: 'grey',
                }
            ]
        }
    )


    // данные по ошибкам для графиков
    const [dataError, setDataError] = useState({
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
    )


    // данные по тренировкам для графиков
    const [dataCountTrain, setdataCountTrain] = useState({
            labels: ['14.02.2022', '15.02.2022', '16.02.2022', '17.02.2022', '18.02.2022'],
            datasets: [
                {
                data: [1, 1, 2, 1, 3],
                lineTension: 0.5,
                backgroundColor: 'grey'
                }
            ]
        }
    )

    const [dataChart, setData] = useState(dataSpeed);


    useEffect(() => {
        loadExercises();
    }, [level])


    function loadExercises() {
        axios.get('/fsdgf', {
            params: {levelExercise: level}
        })
        .then(response => {
            console.log(response);
            setExercises(response.data);
        });
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


    async function goToExercise(e) {

        const exercise = {
            id: '',
            text: '',
            acceptable_count_errors: 0,
            time: ''
        }

        let level = 1;

        console.log(e.currentTarget.id)
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
        });

        dispatch(installExercise(exercise));
        navigate('/trainer');
    }

    
    return (
    <div className='User'>

        {
            isOpenModalWindow && 
            <Information closeModalWindow={closeModalWindow} />
        }
    
        <div className='User_head'>
            <div className='User_head_login'>
                {username}
            </div>
            <button className='User_head_btn-info' onClick={openModalWindow}>
                Справочная информация
            </button>
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
                    <ul onClick={goToExercise}>
                        {
                            exercises.map(({id, name, ...data}) => {
                                return <li key={id} id={id}>{name}</li>
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
                            <td className='column-speed'>2</td>
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