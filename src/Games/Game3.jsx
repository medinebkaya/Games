import React, { useState, useEffect } from 'react';
import styles from './Styles/Game3.module.css'; // CSS modülünü içe aktar

const Game3 = () => {
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [remainingTime, setRemainingTime] = useState(60);
    const [level, setLevel] = useState(1);
    const [intervalTime, setIntervalTime] = useState(2000);
    const [gameStarted, setGameStarted] = useState(false);
    const [circles, setCircles] = useState([]);

    let lastClickTime = 0;
    let circleCount = 0;

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const getRandomPosition = (max) => {
        return Math.floor(Math.random() * max);
    };

    const createCircle = () => {
        let numberOfCircles = 1;
        if (level === 2) numberOfCircles = 2;
        else if (level === 3) numberOfCircles = 3;

        for (let i = 0; i < numberOfCircles; i++) {
            circleCount++;
            const isBomb = circleCount % 5 === 0;

            const circle = {
                id: circleCount,
                type: isBomb ? 'bomb' : 'circle',
                color: isBomb ? 'red' : getRandomColor(),
                top: getRandomPosition(620) + 'px',
                left: getRandomPosition(1020) + 'px',
            };

            setCircles((prevCircles) => [...prevCircles, circle]);

            setTimeout(() => {
                setCircles((prevCircles) => prevCircles.filter(c => c.id !== circle.id));
            }, 1500);
        }
    };

    const handleCircleClick = (circle) => {
        if (circle.type === 'bomb') {
            setScore(prevScore => prevScore - 5);
        } else {
            const now = new Date().getTime();
            const timeDifference = now - lastClickTime;
            lastClickTime = now;

            let points = 1;
            if (timeDifference < 500) {
                points = 5;
            } else if (timeDifference < 1000) {
                points = 3;
            } else if (timeDifference < 1500) {
                points = 2;
            }

            setScore(prevScore => prevScore + points);
        }
        setCircles((prevCircles) => prevCircles.filter(c => c.id !== circle.id));
    };

    const updateDifficulty = () => {
        if (level === 1 && intervalTime > 1500) {
            setIntervalTime(intervalTime - 250);
        } else if (level === 2 && intervalTime > 1000) {
            setIntervalTime(intervalTime - 250);
        } else if (level === 3 && intervalTime > 500) {
            setIntervalTime(intervalTime - 100);
        }
    };

    const startGame = () => {
        setGameStarted(true);
        setScore(0);
        circleCount = 0;
        setIntervalTime(2000);
        setRemainingTime(60);
        setCircles([]);

        const timer = setInterval(() => {
            setRemainingTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setGameStarted(false);
                    if (score > highScore) {
                        setHighScore(score);
                    }
                    return 60;
                }
                return prevTime - 1;
            });
        }, 1000);

        const gameTimer = setInterval(() => {
            createCircle();
            updateDifficulty();
        }, intervalTime);

        return () => {
            clearInterval(timer);
            clearInterval(gameTimer);
        };
    };

    return (
        <div className={styles.container}>
            <div className={styles.difficultyButtons}>
                <button className={styles.difficultyButton} onClick={() => !gameStarted && setLevel(1)}>Kolay</button>
                <button className={styles.difficultyButton} onClick={() => !gameStarted && setLevel(2)}>Orta</button>
                <button className={styles.difficultyButton} onClick={() => !gameStarted && setLevel(3)}>Zor</button>
            </div>
            <div className={styles.gameArea}>
                {circles.map(circle => (
                    <div
                        key={circle.id}
                        className={circle.type}
                        style={{
                            backgroundColor: circle.color,
                            top: circle.top,
                            left: circle.left,
                        }}
                        onClick={() => handleCircleClick(circle)}
                    ></div>
                ))}
                {!gameStarted && (
                    <button className={styles.startButton} onClick={startGame}>Başlat</button>
                )}
            </div>
            <div className={styles.rules}>
                <h2>Oyun Kuralları:</h2>
                <ul>
                    <li>Dairelere tıklayarak puan kazanın.</li>
                    <li>Kırmızı daireye tıklamayın. 5 puan kaybedersiniz.</li>
                    <li>Tıklama hızınıza göre puan kazanırsınız:</li>
                    <ul>
                        <li>0.5 saniyeden hızlı tıklama: 5 puan</li>
                        <li>1 saniyeden hızlı tıklama: 3 puan</li>
                        <li>1.5 saniyeden hızlı tıklama: 2 puan</li>
                    </ul>
                </ul>
                <div className={styles.scoreBoard}>Score: {score}</div>
                <div className={styles.highScoreBoard}>High Score: {highScore}</div>
                <div className={styles.difficultyBoard}>Difficulty: {level === 1 ? 'Kolay' : level === 2 ? 'Orta' : 'Zor'}</div>
                <div className={styles.timer}>Time Remaining: {remainingTime}s</div>
            </div>
        </div>
    );
};

export default Game3;