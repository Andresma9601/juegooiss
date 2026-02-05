window.addEventListener('load', function() {
    
    const gameContainer = document.getElementById('gameContainer');
    const movesDisplay = document.getElementById('moves');
    const timeDisplay = document.getElementById('time');
    const matchesDisplay = document.getElementById('matches');
    const resetBtn = document.getElementById('resetBtn');
    const backToOfficeBtn = document.getElementById('backToOfficeBtn');
    const difficultySelect = document.getElementById('difficulty');
    const winModal = document.getElementById('winModal');
    const finalTimeDisplay = document.getElementById('finalTime');
    const finalMovesDisplay = document.getElementById('finalMoves');
    const playAgainBtn = document.getElementById('playAgainBtn');
    const backToOfficeFromModalBtn = document.getElementById('backToOfficeFromModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const musicToggle = document.getElementById('musicToggle');

    const backgroundMusic = document.getElementById('backgroundMusic');
    const flipSound = document.getElementById('flipSound');
    const matchSound = document.getElementById('matchSound');
    const winSound = document.getElementById('winSound');

    if (!gameContainer) {
        return;
    }

    let musicEnabled = localStorage.getItem('musicEnabled') !== 'false';

    const imagePairs = [
        ['../assets/17.png', '../assets/18.png'], ['../assets/19.png', '../assets/20.png'],
        ['../assets/21.png', '../assets/22.png'], ['../assets/23.png', '../assets/24.png'],
        ['../assets/25.png', '../assets/26.png'], ['../assets/27.png', '../assets/28.png'],
        ['../assets/29.png', '../assets/30.png'], ['../assets/31.png', '../assets/32.png'],
        ['../assets/33.png', '../assets/34.png'], ['../assets/35.png', '../assets/36.png'],
        ['../assets/37.png', '../assets/38.png'], ['../assets/39.png', '../assets/40.png'],
        ['../assets/41.png', '../assets/42.png'], ['../assets/43.png', '../assets/44.png'],
        ['../assets/45.png', '../assets/46.png'], ['../assets/47.png', '../assets/48.png'],
        ['../assets/49.png', '../assets/50.png'], ['../assets/51.png', '../assets/52.png'],
        ['../assets/53.png', '../assets/54.png'], ['../assets/55.png', '../assets/56.png']
    ];

    let gameState = {
        cards: [],
        flippedCards: [],
        matchedCards: [],
        moves: 0,
        matches: 0,
        startTime: null,
        timer: null,
        lockBoard: false,
        gameStarted: false,
        currentDifficulty: 'easy'
    };

    const difficultySettings = {
        easy: { grid: 4, pairs: 8, class: 'grid-easy' },
        medium: { grid: 5, pairs: 12, class: 'grid-medium' },
        hard: { grid: 6, pairs: 18, class: 'grid-hard' }
    };

    function initAudio() {
        if (backgroundMusic) {
            backgroundMusic.volume = 0.3;
            if (musicEnabled) {
                updateMusicToggleButton();
                playBackgroundMusic();
            } else {
                updateMusicToggleButton();
            }
        }

        if (flipSound) flipSound.volume = 0.5;
        if (matchSound) matchSound.volume = 0.6;
        if (winSound) winSound.volume = 0.7;
    }

    function playBackgroundMusic() {
        if (backgroundMusic && musicEnabled) {
            backgroundMusic.play().catch(function(error) {
                console.log('No se pudo reproducir la música de fondo:', error);
            });
        }
    }

    function stopBackgroundMusic() {
        if (backgroundMusic) {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
        }
    }

    function playSound(sound) {
        if (sound && musicEnabled) {
            sound.currentTime = 0;
            sound.play().catch(function(error) {
                console.log('No se pudo reproducir el sonido:', error);
            });
        }
    }

    function toggleMusic() {
        musicEnabled = !musicEnabled;
        localStorage.setItem('musicEnabled', musicEnabled);
        
        if (musicEnabled) {
            playBackgroundMusic();
        } else {
            stopBackgroundMusic();
        }
        
        updateMusicToggleButton();
    }

    function updateMusicToggleButton() {
        if (musicToggle) {
            const span = musicToggle.querySelector('span');
            if (musicEnabled) {
                span.textContent = '🔊';
                musicToggle.classList.remove('btn-muted');
            } else {
                span.textContent = '🔇';
                musicToggle.classList.add('btn-muted');
            }
        }
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return minutes.toString().padStart(2, '0') + ':' + remainingSeconds.toString().padStart(2, '0');
    }

    function updateDisplay() {
        if (movesDisplay) movesDisplay.textContent = gameState.moves;
        if (matchesDisplay) matchesDisplay.textContent = gameState.matches;
        updateTimeDisplay();
    }

    function updateTimeDisplay() {
        if (timeDisplay) {
            if (gameState.startTime) {
                const elapsed = Date.now() - gameState.startTime;
                timeDisplay.textContent = formatTime(elapsed);
            } else {
                timeDisplay.textContent = '00:00';
            }
        }
    }

    function resetGameState() {
        gameState.cards = [];
        gameState.flippedCards = [];
        gameState.matchedCards = [];
        gameState.moves = 0;
        gameState.matches = 0;
        gameState.startTime = null;
        gameState.lockBoard = false;
        gameState.gameStarted = false;
        
        if (gameState.timer) {
            clearInterval(gameState.timer);
            gameState.timer = null;
        }
    }

    function setupGameContainer(gridClass) {
        gameContainer.className = 'game-container ' + gridClass;
        gameContainer.innerHTML = '';
    }

    function createCardElement(imagePath, index) {
        const card = document.createElement('div');
        const settings = difficultySettings[gameState.currentDifficulty];
        
        card.className = 'card ' + settings.class;
        card.setAttribute('data-image', imagePath);
        card.setAttribute('data-index', index);

        const cardFront = document.createElement('div');
        cardFront.className = 'card-face card-front';
        cardFront.textContent = '?';

        const cardBack = document.createElement('div');
        cardBack.className = 'card-face card-back';
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = 'Carta de memoria';
        
        console.log('Intentando cargar imagen:', img.src);
        
        img.onerror = function() {
            console.error('Error cargando imagen:', imagePath);
            cardBack.innerHTML = '';
            cardBack.textContent = imagePath.split('/').pop().replace('.png', '');
            cardBack.style.fontSize = 'clamp(1rem, 2vw, 2rem)';
            cardBack.style.color = 'white';
            cardBack.style.fontWeight = 'bold';
        };
        
        img.onload = function() {
            console.log('Imagen cargada correctamente:', imagePath);
        };
        
        cardBack.appendChild(img);
        card.appendChild(cardFront);
        card.appendChild(cardBack);

        card.addEventListener('click', function() {
            flipCard(card);
        });

        return card;
    }

    function createCards(pairCount) {
        const shuffledPairs = shuffle([...imagePairs]);
        const selectedPairs = shuffledPairs.slice(0, pairCount);
        
        gameState.cards = [];
        selectedPairs.forEach(function(pair) {
            gameState.cards.push(pair[0]);
            gameState.cards.push(pair[1]);
        });
        
        shuffle(gameState.cards);

        gameState.cards.forEach(function(imagePath, index) {
            const card = createCardElement(imagePath, index);
            gameContainer.appendChild(card);
        });
    }

    function flipCard(card) {
        if (gameState.lockBoard) return;
        if (card === gameState.flippedCards[0]) return;
        if (card.classList.contains('flip')) return;
        if (gameState.matchedCards.includes(card)) return;

        if (!gameState.gameStarted) {
            startGame();
        }

        playSound(flipSound);
        card.classList.add('flip');
        gameState.flippedCards.push(card);

        if (gameState.flippedCards.length === 2) {
            gameState.lockBoard = true;
            gameState.moves++;
            updateDisplay();
            
            setTimeout(function() {
                checkForMatch();
            }, 600);
        }
    }

    function startGame() {
        gameState.gameStarted = true;
        gameState.startTime = Date.now();
        
        gameState.timer = setInterval(function() {
            updateTimeDisplay();
        }, 1000);
    }

    function checkForMatch() {
        if (gameState.flippedCards.length < 2) return;
        
        const card1 = gameState.flippedCards[0];
        const card2 = gameState.flippedCards[1];
        
        if (!card1 || !card2) return;
        
        const image1 = card1.getAttribute('data-image');
        const image2 = card2.getAttribute('data-image');
        
        let isMatch = false;
        for (let pair of imagePairs) {
            if ((image1 === pair[0] && image2 === pair[1]) || 
                (image1 === pair[1] && image2 === pair[0])) {
                isMatch = true;
                break;
            }
        }

        if (isMatch) {
            handleMatch(card1, card2);
        } else {
            handleMismatch(card1, card2);
        }
    }

    function handleMatch(card1, card2) {
        playSound(matchSound);
        
        card1.classList.add('matched');
        card2.classList.add('matched');
        
        gameState.matchedCards.push(card1, card2);
        gameState.matches++;
        
        resetBoard();
        updateDisplay();
        
        if (gameState.matchedCards.length === gameState.cards.length) {
            setTimeout(function() {
                endGame();
            }, 800);
        }
    }

    function handleMismatch(card1, card2) {
        setTimeout(function() {
            card1.classList.remove('flip');
            card2.classList.remove('flip');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        gameState.flippedCards = [];
        gameState.lockBoard = false;
    }

    function endGame() {
        if (gameState.timer) {
            clearInterval(gameState.timer);
        }
        
        playSound(winSound);
        
        const finalTime = formatTime(Date.now() - gameState.startTime);
        if (finalTimeDisplay) finalTimeDisplay.textContent = finalTime;
        if (finalMovesDisplay) finalMovesDisplay.textContent = gameState.moves;
        
        showWinModal();
    }

    function showWinModal() {
        if (winModal) {
            winModal.style.display = 'block';
        }
    }

    function hideWinModal() {
        if (winModal) {
            winModal.style.display = 'none';
        }
    }

    function initGame() {
        const difficulty = difficultySelect ? difficultySelect.value : 'easy';
        gameState.currentDifficulty = difficulty;
        const settings = difficultySettings[difficulty];
        
        resetGameState();
        setupGameContainer(settings.class);
        createCards(settings.pairs);
        updateDisplay();
        
        if (musicEnabled && backgroundMusic) {
            playBackgroundMusic();
        }
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', initGame);
    }
    
    if (backToOfficeBtn) {
        backToOfficeBtn.addEventListener('click', function() {
            stopBackgroundMusic();
            window.location.href = 'oficina.html';
        });
    }
    
    // Función global para volver a OISS
    window.volverAOISS = function() {
        stopBackgroundMusic();
        window.location.href = 'oficina.html';
    };
    
    if (difficultySelect) {
        difficultySelect.addEventListener('change', initGame);
    }
    
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', function() {
            hideWinModal();
            initGame();
        });
    }
    
    if (backToOfficeFromModalBtn) {
        backToOfficeFromModalBtn.addEventListener('click', function() {
            stopBackgroundMusic();
            window.location.href = 'oficina.html';
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideWinModal);
    }
    
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }
    
    if (winModal) {
        winModal.addEventListener('click', function(e) {
            if (e.target === winModal) {
                hideWinModal();
            }
        });
    }

    document.addEventListener('click', function() {
        if (musicEnabled && backgroundMusic && backgroundMusic.paused) {
            playBackgroundMusic();
        }
    }, { once: true });

    initAudio();
    initGame();
});