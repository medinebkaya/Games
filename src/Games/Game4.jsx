import React, { useState, useEffect, useRef } from 'react';
import styles from './Styles/Game4.module.css'; // CSS modülünü içe aktar

const Game4 = () => {
    const [gridSize, setGridSize] = useState(3);
    const [molePath, setMolePath] = useState([]);
    const [userPath, setUserPath] = useState([]);
    const [isUserTurn, setIsUserTurn] = useState(false);
    const [level, setLevel] = useState(1);
    const [message, setMessage] = useState('');
    const gameBoardRef = useRef(null);
    const moleRef = useRef(null);
    const warningRef = useRef(null);

    useEffect(() => {
        if (warningRef.current) {
            warningRef.current.style.display = 'block';
        }
    }, []);

    const createBoard = () => {
        const cells = [];
        for (let i = 0; i < gridSize * gridSize; i++) {
            cells.push(i);
        }
        return cells;
    };

    const startGame = () => {
        if (warningRef.current) {
            warningRef.current.style.display = 'none';
        }

        setMolePath([]);
        setUserPath([]);
        setIsUserTurn(false);
        setMessage('');
        createMolePath();
        animateMolePath();
    };

    const createMolePath = () => {
        let steps;

        if (level === 1) steps = 2;
        else if (level === 2) steps = 3;
        else if (level === 3) steps = 4;
        else steps = level + 1;

        let previousIndex = null;
        const newMolePath = [];

        for (let i = 0; i < steps; i++) {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * (gridSize * gridSize));
            } while (i === 0 && newIndex === previousIndex);

            while (newMolePath.includes(newIndex)) {
                newIndex = Math.floor(Math.random() * (gridSize * gridSize));
            }

            newMolePath.push(newIndex);
            previousIndex = newIndex;
        }

        setMolePath(newMolePath);
    };

    const animateMolePath = () => {
        const mole = document.createElement('div');
        mole.classList.add(styles.mole);
        gameBoardRef.current.appendChild(mole);
        moleRef.current = mole;

        let index = 0;
        const interval = setInterval(() => {
            if (index < molePath.length) {
                const cellIndex = molePath[index];
                const cell = document.querySelector(`.${styles.cell}[data-index='${cellIndex}']`);
                const cellRect = cell.getBoundingClientRect();
                const boardRect = gameBoardRef.current.getBoundingClientRect();

                mole.style.top = `${cellRect.top - boardRect.top}px`;
                mole.style.left = `${cellRect.left - boardRect.left}px`;

                index++;
            } else {
                clearInterval(interval);
                mole.remove();
                setIsUserTurn(true);
                setMessage('Şimdi sırası sizde! Köstebeğin izlediği yolu takip edin.');
            }
        }, 800);
    };

    const selectCell = (index) => {
        if (!isUserTurn) return;

        const newUserPath = [...userPath, index];
        setUserPath(newUserPath);

        const currentStep = newUserPath.length - 1;
        if (newUserPath[currentStep] !== molePath[currentStep]) {
            document.querySelector(`.${styles.cell}[data-index='${index}']`).classList.add(styles.wrong);
            setMessage('Yanlış! Oyun bitti. Yeniden başlamak için "Oyunu Başlat" düğmesine tıklayın.');
            setIsUserTurn(false);
            return;
        } else {
            document.querySelector(`.${styles.cell}[data-index='${index}']`).classList.add(styles.selected);
        }

        if (newUserPath.length === molePath.length) {
            checkUserPath();
        }
    };

    const checkUserPath = () => {
        let isCorrect = true;
        for (let i = 0; i < molePath.length; i++) {
            if (userPath[i] !== molePath[i]) {
                isCorrect = false;
                break;
            }
        }

        if (isCorrect) {
            setMessage(`Doğru! Seviye ${level} tamamlandı. Bir sonraki seviyeye geçiliyor...`);
            turnCellsGreen();
            setIsUserTurn(false);
            setUserPath([]);
            levelUp();
        } else {
            setMessage('Yanlış! Oyun bitti. Yeniden başlamak için "Oyunu Başlat" düğmesine tıklayın.');
            setIsUserTurn(false);
        }
    };

    const turnCellsGreen = () => {
        molePath.forEach(index => {
            const cell = document.querySelector(`.${styles.cell}[data-index='${index}']`);
            if (cell) {
                cell.style.backgroundColor = 'green';
            }
        });
    };

    const levelUp = () => {
        setLevel(prevLevel => {
            const newLevel = prevLevel + 1;
            if (newLevel % 3 === 1 && newLevel > 1) {
                setGridSize(prevSize => prevSize + 1);
            }
            setTimeout(() => {
                startGame();
            }, 1000);
            return newLevel;
        });
    };

    return (
        <div className={styles.App}>
            <h1>Köstebek Patika Hafıza Oyunu</h1>
            <div className={styles.warning} ref={warningRef}>
                İpucu: Köstebeğin ilk konumu patikaya dahil değildir. Lütfen ilk konuma tıklamayınız
            </div>
            <div id="game-board" className={styles.gameBoard} ref={gameBoardRef}>
                {createBoard().map(i => (
                    <div key={i} className={styles.cell} data-index={i} onClick={() => selectCell(i)}></div>
                ))}
                <div className={styles.mole} ref={moleRef}></div>
            </div>
            <button id="start-game" className={styles.startButton} onClick={startGame}>Oyunu Başlat</button>
            <p className={styles.message}>{message}</p>
        </div>
    );
};

export default Game4;