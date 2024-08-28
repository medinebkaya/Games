import React, { useState, useEffect } from 'react';
import styles from './styles/Game2.module.css'; // CSS modülünü içe aktar

const cardLevels = {
    1: { size: 8, columns: 4 },
    2: { size: 12, columns: 4 },
    3: { size: 16, columns: 4 },
};

const symbols = ['🍎', '🍏', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍍', '🥭', '🍑', '🥝', '🍒', '🥥', '🫐'];

function Game2() {
    const [currentLevel, setCurrentLevel] = useState(1);
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [moves, setMoves] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [timerInterval, setTimerInterval] = useState(null);
    const [highScore, setHighScore] = useState(Number(localStorage.getItem('highScore')) || 0);
    const [message, setMessage] = useState('');
    const [timeDisplay, setTimeDisplay] = useState('0s');
    const [hiddenPlayAgain, setHiddenPlayAgain] = useState(true);
    const [hiddenNextLevel, setHiddenNextLevel] = useState(true);
    const [isGameStarted, setIsGameStarted] = useState(false);

    useEffect(() => {
        if (startTime && timerInterval === null) {
            const interval = setInterval(() => {
                if (startTime) {
                    const timeElapsed = Math.round((new Date() - startTime) / 1000);
                    setTimeDisplay(`${timeElapsed}s`);
                }
            }, 1000);
            setTimerInterval(interval);
        }

        return () => clearInterval(timerInterval);
    }, [startTime, timerInterval]);

    useEffect(() => {
        if (currentLevel && isGameStarted) startGame(currentLevel);
    }, [currentLevel, isGameStarted]);

    const startGame = (level) => {
        const { size } = cardLevels[level];
        const symbolCount = size / 2;
        const selectedSymbols = symbols.slice(0, symbolCount);
        const shuffledSymbols = [...selectedSymbols, ...selectedSymbols].sort(() => 0.5 - Math.random());

        const newCards = shuffledSymbols.map((symbol, index) => ({
            id: index,
            content: symbol,
            flipped: false,
        }));

        setCards(newCards);
        setMatchedPairs(0);
        setFlippedCards([]);
        setMoves(0);
        setHiddenPlayAgain(true);
        setHiddenNextLevel(true);
        setMessage('');
        setStartTime(new Date());
    };

    const flipCard = (index) => {
        if (flippedCards.length < 2 && !cards[index].flipped) {
            const updatedCards = cards.map((card, idx) =>
                idx === index ? { ...card, flipped: true } : card
            );

            setCards(updatedCards);
            setFlippedCards([...flippedCards, index]);
            setMoves(moves + 1);

            if (flippedCards.length === 1) {
                checkForMatch(index);
            }
        }
    };

    const checkForMatch = (secondIndex) => {
        const [firstIndex] = flippedCards;
        if (cards[firstIndex].content === cards[secondIndex].content) {
            setMatchedPairs(matchedPairs + 1);
            setFlippedCards([]);

            if (matchedPairs + 1 === cardLevels[currentLevel].size / 2) {
                endGame();
            }
        } else {
            setTimeout(() => {
                const updatedCards = cards.map((card, index) => ({
                    ...card,
                    flipped: index === firstIndex || index === secondIndex ? false : card.flipped,
                }));
                setCards(updatedCards);
                setFlippedCards([]);
            }, 1000);
        }
    };

    const endGame = () => {
        clearInterval(timerInterval);
        const endTime = new Date();
        const timeElapsed = Math.round((endTime - startTime) / 1000);
        const maxTime = 300; // maximum time for scoring
        const maxMoves = 50; // maximum moves for scoring
        const score = Math.max(0, 1000 - ((timeElapsed / maxTime) * 500 + (moves / maxMoves) * 500));

        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('highScore', score);
        }

        setMessage(`Tebrikler! Tüm kartları eşleştirdiniz! Süre: ${timeElapsed} saniye, Hamleler: ${Math.ceil(moves / 2)} | Puan: ${Math.round(score)}`);
        setHiddenPlayAgain(false);
        if (currentLevel < Object.keys(cardLevels).length) {
            setHiddenNextLevel(false);
        }
    };

    const handleStartGame = () => {
        setIsGameStarted(true);
        startGame(currentLevel);
    };

    return (
        <div className={styles.container}>
            <div className={styles.topInfo}>
                <h1>Kart Çevirme Oyunu</h1>
                <p>En Yüksek Rekor: <span>{Math.round(highScore)}</span></p>
            </div>
            <div className={styles.gameInfo}>
                <p>Geçen Süre: <span>{timeDisplay}</span></p>
                <p>Hamle Sayısı: <span>{Math.ceil(moves / 2)}</span></p>
            </div>
            {!isGameStarted && (
                <button onClick={handleStartGame}>Başla</button>
            )}
            <div className={styles.gameBoard} style={{ gridTemplateColumns: `repeat(${cardLevels[currentLevel].columns}, 100px)` }}>
                {cards.map((card, index) => (
                    <div key={index} className={`${styles.card} ${card.flipped ? styles.flipped : ''}`} onClick={() => flipCard(index)}>
                        <div className={styles.cardInner}>
                            <div className={styles.cardFront}>?</div>
                            <div className={styles.cardBack}>{card.content}</div>
                        </div>
                    </div>
                ))}
            </div>
            <p className={styles.message}>{message}</p>
            <button className={hiddenPlayAgain ? styles.hidden : ''} onClick={() => {
                setIsGameStarted(false);
                setCurrentLevel(1);
                setMoves(0);
                setStartTime(null);
                setTimerInterval(null);
                setTimeDisplay('0s');
                startGame(1);
            }}>Tekrar Oyna</button>
            <button className={hiddenNextLevel ? styles.hidden : ''} onClick={() => setCurrentLevel(currentLevel + 1)}>Sonraki Seviye</button>
        </div>
    );
}

export default Game2;