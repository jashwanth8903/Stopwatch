import React, { useRef, useState } from 'react';
import './Stopwatch.css';

function Stopwatch() {
    const [time, setTime] = useState({ h: 0, m: 0, s: 0, ms: 0 });
    const [laps, setLaps] = useState([]);
    const [timerOn, setTimerOn] = useState(false);
    const [prevTime, setPrevTime] = useState(null);
    const intervalRef = useRef();

    const startTimer = () => {
        if (!timerOn) {
            intervalRef.current = setInterval(() => {
                setTime((prevTime) => {
                    let updatedMs = prevTime.ms + 1;
                    let updatedS = prevTime.s;
                    let updatedM = prevTime.m;
                    let updatedH = prevTime.h;

                    if (updatedMs === 100) {
                        updatedS++;
                        updatedMs = 0;
                    }
                    if (updatedS === 60) {
                        updatedM++;
                        updatedS = 0;
                    }
                    if (updatedM === 60) {
                        updatedH++;
                        updatedM = 0;
                    }

                    return { h: updatedH, m: updatedM, s: updatedS, ms: updatedMs };
                });
            }, 10);
            setTimerOn(true);
        }
    };

    const stopTimer = () => {
        clearInterval(intervalRef.current);
        setTimerOn(false);
    };

    const resetTimer = () => {
        clearInterval(intervalRef.current);
        setTime({ h: 0, m: 0, s: 0, ms: 0 });
        setLaps([]);
        setPrevTime(null);
        setTimerOn(false);
    };

    const lapTimer = () => {
        const formattedTime = `${time.h
            .toString()
            .padStart(2, '0')} : ${time.m.toString().padStart(2, '0')} : ${time.s
                .toString()
                .padStart(2, '0')} : ${time.ms.toString().padStart(2, '0')}`;

        let diff = null;
        if (prevTime) {
            const lapTime = (time.h * 3600 + time.m * 60 + time.s) * 100 + time.ms;
            const prevLapTime = (prevTime.h * 3600 + prevTime.m * 60 + prevTime.s) * 100 + prevTime.ms;
            diff = lapTime - prevLapTime;
        }

        setLaps((prevLaps) => [
            ...prevLaps,
            { lap: formattedTime, difference: diff ? formatDifference(diff) : 'N/A' },
        ]);
        setPrevTime({ ...time });
    };

    const formatDifference = (diff) => {
        const ms = diff % 100;
        const s = Math.floor((diff / 100) % 60);
        const m = Math.floor((diff / 6000) % 60);
        const h = Math.floor(diff / 360000);
        return `${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s
            .toString()
            .padStart(2, '0')} : ${ms.toString().padStart(2, '0')}`;
    };

    const resetLaps = () => {
        setLaps([]);
    };

    return (
        <div className="stop-watch container bg-dark " id="stopwatch">
            <div className="text-content">
                <p className="text-center text-large">Stopwatch</p>
            </div>

            <div className="timer-Display">
                {`${time.h.toString().padStart(2, '0')} : ${time.m
                    .toString()
                    .padStart(2, '0')} : ${time.s.toString().padStart(2, '0')} : ${time.ms
                        .toString()
                        .padStart(2, '0')}`}
            </div>

            <div className="buttons">
                <button className={`btn ${timerOn ? 'btn-danger' : 'btn-primary'}`} onClick={timerOn ? stopTimer : startTimer}>
                    {timerOn ? 'Pause' : 'Start'}
                </button>

                <button className="btn btn-secondary" onClick={resetTimer}>
                    Reset
                </button>
                <button className="btn btn-secondary" onClick={lapTimer}>
                    Lap
                </button>
                <button className="btn btn-secondary" onClick={resetLaps}>
                    Reset Laps
                </button>
            </div>

            {laps.length > 0 && ( // Conditionally render the table based on laps data
                <table className="table table-striped bg-dark">
                    <thead className='bg-dark'>
                        <tr >
                            <th scope="col">#</th>
                            <th scope="col">Lap Time</th>
                            <th scope="col">Difference</th>
                        </tr>
                    </thead>
                    <tbody className='bg-dark'>
                        {laps.map((lap, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{lap.lap}</td>
                                <td>{lap.difference}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Stopwatch;
