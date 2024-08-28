import React, { useEffect, useState } from 'react';
import styles from './Styles/Game7.module.css'; // CSS modülünü içe aktar

const Game7 = () => {
    const [gridSize, setGridSize] = useState(3);
    const [molePath, setMolePath] = useState([]);
    const [userPath, setUserPath] = useState([]);
    const [isUserTurn, setIsUserTurn] = useState(false);
    const [level, setLevel] = useState(1);
    const [message, setMessage] = useState('');
    const [warningVisible, setWarningVisible] = useState(true);

    useEffect(() => {
        createBoard();
    }, []);

    const createBoard = () => {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 50px)`;
        gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 50px)`;

        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add(styles.cell);
            cell.dataset.index = i;
            cell.addEventListener('click', () => selectCell(i));
            gameBoard.appendChild(cell);
        }
    };

    const startGame = () => {
        setWarningVisible(false);
        setMolePath([]);
        setUserPath([]);
        setIsUserTurn(false);
        setMessage('');
        createMolePath();
        animateMolePath();
    };

    const createMolePath = () => {
        const steps = Math.min(level + 1, gridSize);
        const newMolePath = [];
        let previousIndex = null;

        for (let i = 0; i < steps; i++) {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * (gridSize * gridSize));
            } while (i === 0 && newIndex === previousIndex || newMolePath.includes(newIndex));
            newMolePath.push(newIndex);
            previousIndex = newIndex;
        }
        setMolePath(newMolePath);
    };

    const animateMolePath = () => {
        const moleElem = document.createElement('div');
        moleElem.classList.add(styles.mole);
        document.getElementById('game-board').appendChild(moleElem);

        let index = 0;
        const interval = setInterval(() => {
            if (index < molePath.length) {
                const cellIndex = molePath[index];
                const cell = document.querySelector(`.cell[data-index='${cellIndex}']`);
                const cellRect = cell.getBoundingClientRect();
                const boardRect = document.getElementById('game-board').getBoundingClientRect();
                moleElem.style.top = `${cellRect.top - boardRect.top}px`;
                moleElem.style.left = `${cellRect.left - boardRect.left}px`;
                index++;
            } else {
                clearInterval(interval);
                moleElem.remove();
                setIsUserTurn(true);
                setMessage('Şimdi sırası sizde! Köstebeğin izlediği yolu takip edin.');
            }
        }, 800);
    };

    const selectCell = (index) => {
        if (!isUserTurn) return;

        const cell = document.querySelector(`.cell[data-index='${index}']`);
        setUserPath(prev => [...prev, index]);

        const currentStep = userPath.length;
        if (userPath[currentStep] !== molePath[currentStep]) {
            cell.classList.add(styles.wrong);
            setMessage('Yanlış! Oyun bitti. Yeniden başlamak için "Oyunu Başlat" düğmesine tıklayın.');
            setIsUserTurn(false);
            return;
        } else {
            cell.classList.add(styles.selected);
            cell.style.backgroundColor = 'yellow';
        }

        if (userPath.length === molePath.length) {
            checkUserPath();
        }
    };

    const checkUserPath = () => {
        const isCorrect = userPath.every((value, index) => value === molePath[index]);
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
            const cell = document.querySelector(`.cell[data-index='${index}']`);
            cell.style.backgroundColor = 'green';
        });
    };

    const levelUp = () => {
        setLevel(prev => prev + 1);
        if (level % 3 === 1 && level > 1) {
            setGridSize(prev => prev + 1);
        }
        setTimeout(() => {
            createBoard();
            startGame();
        }, 1000);
    };

    return (
        <div>
            {warningVisible && (
                <div className={styles.warning}>
                    İpucu: Köstebeğin ilk konumu patikaya dahil değildir. Lütfen ilk konuma tıklamayınız.
                </div>
            )}
            <h1>Köstebek Patika Hafıza Oyunu</h1>
            <div id="game-board" className={styles.gameBoard}></div>
            <button className={styles.startButton} onClick={startGame}>Oyunu Başlat</button>
            <p className={styles.message}>{message}</p>
        </div>
    );
};

export default Game7;