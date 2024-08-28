import React, { useState, useEffect } from 'react';
import styles from './styles/Game1.module.css'; // CSS modülünü içe aktar

const Game1 = () => {
    const cardLevels = {
        1: { size: 8, columns: 4 },
        2: { size: 12, columns: 4 },
        3: { size: 16, columns: 4 },
    };

    const symbols = ['🍎', '🍏', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍍', '🥭', '🍑', '🥝', '🍒', '🥥', '🫐'];

    const [currentLevel, setCurrentLevel] = useState(1);
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [moves, setMoves] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [timerInterval, setTimerInterval] = useState(null);
    const [highScore, setHighScore] = useState(localStorage.getItem('highScore') || 0);
    const [message, setMessage] = useState('');
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        if (timerInterval) {
            const updateTimer = () => {
                if (startTime) {
                    const timeElapsed = Math.round((new Date() - startTime) / 1000);
                    setMessage((prev) => `Süre: ${timeElapsed}s`);
                }
            };

            const interval = setInterval(updateTimer, 1000);
            return () => clearInterval(interval);
        }
    }, [startTime, timerInterval]);

    const startGame = (level) => {
        const { size, columns } = cardLevels[level];
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
        setMessage('');
        setGameStarted(true);

        if (!startTime) {
            setStartTime(new Date());
            setTimerInterval(true);
        }
    };

    const flipCard = (index) => {
        if (flippedCards.length < 2 && !cards[index].flipped) {
            const newCards = [...cards];
            newCards[index].flipped = true;
            setCards(newCards);
            setFlippedCards((prev) => [...prev, index]);
            setMoves((prev) => prev + 1);

            if (flippedCards.length === 1) {
                checkForMatch(index);
            }
        }
    };

    const checkForMatch = (secondCardIndex) => {
        const [firstCardIndex] = flippedCards;
        if (cards[firstCardIndex].content === cards[secondCardIndex].content) {
            setMatchedPairs((prev) => prev + 1);
            setFlippedCards([]);

            if (matchedPairs + 1 === cardLevels[currentLevel].size / 2) {
                endGame();
            }
        } else {
            setTimeout(() => {
                const newCards = [...cards];
                newCards[firstCardIndex].flipped = false;
                newCards[secondCardIndex].flipped = false;
                setCards(newCards);
                setFlippedCards([]);
            }, 1000);
        }
    };

    const endGame = () => {
        clearInterval(timerInterval);
        const endTime = new Date();
        const timeElapsed = Math.round((endTime - startTime) / 1000);
        const score = calculateScore(timeElapsed, moves);

        setMessage(`Tebrikler! Tüm kartları eşleştirdiniz! Süre: ${timeElapsed} saniye, Hamleler: ${Math.ceil(moves / 2)} | Puan: ${Math.round(score)}`);

        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('highScore', score);
        }
    };

    const calculateScore = (time, moves) => {
        const maxTime = 300;
        const maxMoves = 50;
        return Math.max(0, 1000 - ((time / maxTime) * 500 + (moves / maxMoves) * 500));
    };

    const playAgain = () => {
        setCurrentLevel(1);
        setMoves(0);
        setStartTime(null);
        setTimerInterval(null);
        setMessage('');
        startGame(1);
    };

    const nextLevel = () => {
        setCurrentLevel((prev) => prev + 1);
        startGame(currentLevel + 1);
    };

    return (
        <div className={styles.container}>
            <div className={styles.topInfo}>
                <h1>Kart Çevirme Oyunu</h1>
                <p>En Yüksek Rekor: <span>{Math.round(highScore)}</span></p>
            </div>
            <div className={styles.gameInfo}>
                <p>Geçen Süre: <span>{message}</span></p>
                <p>Hamle Sayısı: <span>{Math.ceil(moves / 2)}</span></p>
            </div>
            {!gameStarted && <button onClick={() => startGame(currentLevel)}>Başla</button>}
            <div className={styles.gameBoard} style={{ gridTemplateColumns: `repeat(${cardLevels[currentLevel].columns}, 100px)` }}>
                {cards.map((card, index) => (
                    <div key={card.id} className={`${styles.card} ${card.flipped ? styles.flipped : ''}`} onClick={() => flipCard(index)}>
                        <div className={styles.cardInner}>
                            <div className={styles.cardFront}>?</div>
                            <div className={styles.cardBack}>{card.content}</div>
                        </div>
                    </div>
                ))}
            </div>
            <p>{message}</p>
            {matchedPairs === cardLevels[currentLevel].size / 2 && currentLevel < Object.keys(cardLevels).length &&
                <button onClick={nextLevel}>Sonraki Seviye</button>}
            {matchedPairs === cardLevels[currentLevel].size / 2 && currentLevel === Object.keys(cardLevels).length &&
                <button onClick={playAgain}>Tekrar Oyna</button>}
        </div>
    );
};

export default Game1;