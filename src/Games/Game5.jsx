import React, { useState, useEffect } from 'react';
import styles from './Styles/Game5.module.css'; // CSS modülünü içe aktar
import arabalar from './Styles/images/Arabalar.jpg';
import hayvanlar from './Styles/images/Hayvanlar.jpg';
import kirtasiye from './Styles/images/Kırtasiye.png';
import mutfak from './Styles/images/Mutfak.jpeg';
import kareler from './Styles/images/Kareler.png';

const photos = [
    { src: arabalar, question: "Bu fotoğrafta hangi renklerde araba vardı?", correctAnswers: ["kırmızı", "mavi", "yeşil", "gri", "sarı"] },
    { src: hayvanlar, question: "Bu fotoğrafta hangi hayvanlar vardı?", correctAnswers: ["aslan", "fil", "zürafa", "kuş", "ördek", "kuğu", "kırlangıç"] },
    { src: kirtasiye, question: "Bu fotoğrafta hangi nesneleri gördünüz?", correctAnswers: ["kağıt", "defter", "kalem", "bilgisayar", "fincan", "kahve", "çiçek", "saksı", "gözlük", "tablet"] },
    { src: mutfak, question: "Bu fotoğrafta kaç beyaz eşya gördünüz?", correctAnswers: ["3", "üç"] },
    { src: kareler, question: "Gördüğünüz tablolarda kaç kare iki tabloda da boyalıydı?", correctAnswers: ["1", "bir"] },
];

const Game5 = () => {
    const [currentLevel, setCurrentLevel] = useState(0);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(7);
    const [showGame, setShowGame] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [userAnswer, setUserAnswer] = useState('');

    useEffect(() => {
        if (showGame && timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            showQuestion();
        }
    }, [showGame, timer]);

    const startGame = () => {
        setShowGame(true);
        setCurrentLevel(0);
        setScore(0);
        setTimer(7);
        setFeedback('');
    };

    const showQuestion = () => {
        setFeedback(photos[currentLevel].question);
    };

    const checkAnswer = () => {
        const correctAnswers = photos[currentLevel].correctAnswers;
        const userAnswers = userAnswer.toLowerCase().split(',').map(answer => answer.trim());

        let pointsEarned = 0;
        correctAnswers.forEach(answer => {
            if (userAnswers.includes(answer)) {
                pointsEarned += 10;
            }
        });

        setScore(prev => prev + pointsEarned);
        setFeedback(pointsEarned > 0 ? "Tebrikler!" : "Yanlış cevap!");

        if (currentLevel < photos.length - 1) {
            setCurrentLevel(prev => prev + 1);
        } else {
            setFeedback(`Tebrikler! ${score} puan kazandınız!`);
            setShowGame(false);
        }
    };

    return (
        <div className={styles.app}>
            {!showGame ? (
                <div className={styles.mainScreen}>
                    <h1>Hoşgeldiniz!</h1>
                    <p>1. Gösterilen resimleri inceleyip sorulan soruları cevaplayın</p>
                    <p>2. Bazı sorularda birden fazla cevap olabilir</p>
                    <p>3. Birden fazla cevabınız olduğunda cevapları virgülle ayırın</p>
                    <button className={styles.startButton} onClick={startGame}>Başla</button>
                </div>
            ) : (
                <div className={styles.gameContainer}>
                    <img className={styles.gameImage} src={photos[currentLevel].src} alt="Game" />
                    <p className={styles.question}>{photos[currentLevel].question}</p>
                    <input
                        type="text"
                        className={styles.answer}
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                    />
                    <button className={styles.submitButton} onClick={checkAnswer}>Cevabı Gönder</button>
                    <p className={styles.feedback}>{feedback}</p>
                    <p>Süre: <span className={styles.timer}>{timer}</span> saniye</p>
                    <p>Puan: <span className={styles.score}>{score}</span></p>
                </div>
            )}
        </div>
    );
};

export default Game5;