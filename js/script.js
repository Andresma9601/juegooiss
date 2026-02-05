const GAME_CONFIG = {
    STARTING_MONEY_DEFAULT: 1000,
    STARTING_HEALTH_DEFAULT: 100,
    STARTING_LEISURE_DEFAULT: 50,
    STARTING_KNOWLEDGE_DEFAULT: 0,
    MAX_DICE_ROLL: 6,
    GAME_VERSION: "2.4",
    BOARD_COLS: 25,
    BOARD_ROWS: 10,
    TOTAL_BOARD_SQUARES: 250,
    AUTOSAVE_TURNS: 5
};

const SQUARE_EFFECTS = {
    study: { knowledge: 15, ocio: -5, dinero: -10 },
    work: { dinero: 40, salud: -5, ocio: -5 },
    leisure: { ocio: 20, salud: 5, dinero: -15 },

};
const availablePlayerTokens = [
    { id: '3', src: '../assets/3.png', name: 'Personaje 3' },
    { id: '4', src: '../assets/4.png', name: 'Personaje 4' },
    { id: '5', src: '../assets/5.png', name: 'Personaje 5' },
    { id: '6', src: '../assets/6.png', name: 'Personaje 6' },
    { id: '7', src: '../assets/7.png', name: 'Personaje 7' },
    { id: '8', src: '../assets/8.png', name: 'Personaje 8' },
    { id: '9', src: '../assets/9.png', name: 'Personaje 9' },
    { id: '10', src: '../assets/10.png', name: 'Personaje 10' },
    { id: '11', src: '../assets/11.png', name: 'Personaje 11' },
    { id: '12', src: '../assets/12.png', name: 'Personaje 12' },
    { id: '13', src: '../assets/13.png', name: 'Personaje 13' },
    { id: '14', src: '../assets/14.png', name: 'Personaje 14' },
    { id: '15', src: '../assets/15.png', name: 'Personaje 15' },
    { id: '16', src: '../assets/16.png', name: 'Personaje 16' }
];


const FALLBACK_TRIVIA_BANK = [
  { "pregunta": "¿Qué es la Seguridad Social?", "opciones": [ "A. Una protección garantizada por el Estado para cubrir riesgos como enfermedad, vejez, desempleo, entre otros.", "B. Un subsidio temporal que solo se da en casos de accidentes.", "C. Un sistema de ahorro privado.", "D. Una ONG que da ayuda a los pobres." ], "respuestaCorrecta": "A. Una protección garantizada por el Estado para cubrir riesgos como enfermedad, vejez, desempleo, entre otros.", "mensajeCorrecto": "¡Bien hecho! Tu conocimiento sobre la seguridad social te trae beneficios.", "mensajeIncorrecto": "No fue la respuesta correcta. Repasa tus conocimientos.", "efectoDinero": 30, "efectoSalud": 0, "efectoOcio": 0, "efectoConocimiento": 10, "categoria": "Conocimiento" },
  { "pregunta": "¿Cuál es el principal objetivo de la Seguridad Social?", "opciones": [ "A. Proteger a las personas ante situaciones que afecten su ingreso o su salud.", "B. Recaudar impuestos para construir carreteras.", "C. Facilitar la importación de medicamentos.", "D. Promover la libre competencia entre hospitales." ], "respuestaCorrecta": "A. Proteger a las personas ante situaciones que afecten su ingreso o su salud.", "mensajeCorrecto": "¡Bien hecho! Tu conocimiento sobre la seguridad social te trae beneficios.", "mensajeIncorrecto": "No fue la respuesta correcta. Repasa tus conocimientos.", "efectoDinero": 30, "efectoSalud": 0, "efectoOcio": 0, "efectoConocimiento": 10, "categoria": "Conocimiento" }
];

let triviaBank = [];
let preguntasDisponibles = [];
let player = {};
let gameState = 'menu';
let currentTriviaQuestion = null;
let playerName = '';
let selectedPlayerToken = availablePlayerTokens[0]; 
let turnCounter = 0;
let currentVisualTheme = 'default';
let rachaCorrecta = 0;
let dificultad = "normal";
const checkpoints = [50, 100, 150, 200];
const historialDecisiones = [];
let movementPointsRemaining = 0;
let isMovingPhase = false;
let selectedStartPathButtonId = null;
let selectedPathType = 'simple';
let combinedPathType = null; 
let deteriorationCounters = { salud: 0, dinero: 0, ocio: 0 };
const introPantallaEl = document.getElementById('introPantalla');
const startScreenEl = document.getElementById('startScreen');
const startContentEl = document.getElementById('startContent');
const gameContainerEl = document.getElementById('gameContainer');
const playerNameInputEl = document.getElementById('playerNameInput');
const playerWelcomeEl = document.getElementById('playerWelcome');
const dineroStatEl = document.getElementById('dineroStat');
const saludStatEl = document.getElementById('saludStat');
const ocioStatEl = document.getElementById('ocioStat');
const pensionStatEl = document.getElementById('pensionStat');
const knowledgeStatEl = document.getElementById('knowledgeStat');
const currentPositionStatEl = document.getElementById('currentPositionStat');
const messageLogEl = document.getElementById('messageLog');
const dice3dElement = document.getElementById('dice3d');
const characterSelectorEl = document.getElementById('characterSelector');
const gameBoardEl = document.getElementById('gameBoard');
const endScreenEl = document.getElementById('endScreen');
const finalSummaryEl = document.getElementById('finalSummary');
const progressBarEl = document.getElementById('progressBar');
const playerTokenEl = document.getElementById('playerToken');
const playerAvatarEl = document.getElementById('playerAvatar');
const logrosContainerEl = document.getElementById('logrosContainer');
const timelineEl = document.getElementById('timeline');
const movementPointsDisplay = document.getElementById('movementPointsDisplay');
const endTurnButton = document.getElementById('endTurnButton');
const triviaModalEl = document.getElementById('triviaModal');
const triviaQuestionEl = document.getElementById('triviaQuestion');
const triviaOptionsEl = document.getElementById('triviaOptions');
const triviaResultEl = document.getElementById('triviaResult');
const triviaContinueEl = document.getElementById('triviaContinue');
const decisionModalEl = document.getElementById('decisionModal');
const decisionTitleEl = document.getElementById('decisionTitle');
const decisionDescriptionEl = document.getElementById('decisionDescription');
const decisionOptionsEl = document.getElementById('decisionOptions');
const trainingScreenEl = document.getElementById('trainingScreen');
const trainingContent = document.getElementById('trainingContent');
const trainingQuestionEl = document.getElementById('trainingQuestion');
const trainingOptionsEl = document.getElementById('trainingOptions');
const trainingResultEl = document.getElementById('trainingResult');
const customOverlay = document.getElementById('customOverlay');
const customConfirmModal = document.getElementById('customConfirmModal');
const confirmTitle = document.getElementById('confirmTitle');
const confirmMessage = document.getElementById('confirmMessage');
const confirmYesBtn = document.getElementById('confirmYesBtn');
const confirmNoBtn = document.getElementById('confirmNoBtn');
const customAlertDialog = document.getElementById('customAlertDialog');
const alertDialogTitle = document.getElementById('alertDialogTitle');
const alertDialogMessage = document.getElementById('alertDialogMessage');
const alertDialogOkBtn = document.getElementById('alertDialogOkBtn');
const bgMusicElement = document.getElementById('musicCamino');
const musicDecision = document.getElementById('musicDecision');
const musicFinal = document.getElementById('musicFinal');
const musicTrivia = document.getElementById('musicTrivia');
const musicEventPositive = document.getElementById('musicEventPositive');
const musicEventNegative = document.getElementById('musicEventNegative');
let rollDiceButton, newGameButton;
let diceSynth, triviaSynth, eventSynth;

async function loadTriviaBank() {
    try {
        const response = await fetch('../data/preguntas_trivia.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        triviaBank = await response.json();
        preguntasDisponibles = [...triviaBank];
        console.log('¡ÉXITO! Se cargaron', triviaBank.length, 'preguntas desde preguntas_trivia.json');
    } catch (error) {
        console.warn('No se pudo cargar "preguntas_trivia.json". Usando banco de respaldo.', error);
        triviaBank = FALLBACK_TRIVIA_BANK;
        preguntasDisponibles = [...triviaBank];
        console.log('ADVERTENCIA: Se está usando el banco de preguntas de respaldo interno.');
    }
}

const eventCards = [
    { text: "Te regalaron un seguro de salud. ¡Tu salud mejora!", effect: { salud: 30 } },
    { text: "Perdiste tu billetera en un descuido. ¡Cuidado!", effect: { dinero: -50 } },
    { text: "Te ganaste una beca para un curso. ¡Aumenta tu conocimiento!", effect: { knowledge: 40 } },
    { text: "Un día de descanso inesperado. ¡Disfruta!", effect: { ocio: 20 } },
    { text: "Gasto imprevisto en el hogar. ¡Ajusta tu presupuesto!", effect: { dinero: -80 } }
];


const pensionEvents = [
    { name: "Aporte Básico a Pensión", details: "Comienzas a cotizar regularmente.", cost: { dinero: -100 }, benefit: { pension: 130 } },
    { name: "Ahorro Disciplinado", details: "Aumentas tus ahorros.", cost: { dinero: -200 }, benefit: { pension: 280 } },
];

const mainGameBoard = [];



function initializeGameBoard() {
    mainGameBoard.length = 0;
    const junctionPositions = [];
    const possiblePositions = [];
    
    
    for (let i = 5; i < GAME_CONFIG.TOTAL_BOARD_SQUARES - 5; i++) {
        possiblePositions.push(i);
    }
    
    
    for (let i = 0; i < 30; i++) {
        const randomIndex = Math.floor(Math.random() * possiblePositions.length);
        junctionPositions.push(possiblePositions[randomIndex]);
        possiblePositions.splice(randomIndex, 1);
    }
    
    const numJunctions = junctionPositions.length;
    const tiposDeCasilla = [];
    const numRandomSquares = GAME_CONFIG.TOTAL_BOARD_SQUARES - 1 - 1 - numJunctions;

    const baseDistribution = {
        'trivia': 40,         
        'card_event': 25,     
        'pension': 30,        
        'study': 25,          
        'work': 25,           
        'leisure': 25,        
        'crisis': 20,         
        'opportunity': 15,    
        'investment': 28      
    }
 

    let currentTotal = 0;
    for (const type in baseDistribution) {
        for (let i = 0; i < baseDistribution[type]; i++) {
            tiposDeCasilla.push(type);
        }
        currentTotal += baseDistribution[type];
    }

    
    while (currentTotal < numRandomSquares) {
        const extraTypes = ['trivia', 'card_event', 'pension', 'study', 'work', 'leisure'];
        tiposDeCasilla.push(extraTypes[Math.floor(Math.random() * extraTypes.length)]);
        currentTotal++;
    }


    for (let i = tiposDeCasilla.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiposDeCasilla[i], tiposDeCasilla[j]] = [tiposDeCasilla[j], tiposDeCasilla[i]];
    }

    mainGameBoard.push({ id: 'START', name: "Inicio", type: 'start', path: 'normal', details: "Comienza tu viaje." });

    let specialTileCounter = 0;
    for (let i = 1; i < GAME_CONFIG.TOTAL_BOARD_SQUARES - 1; i++) {
        let squareData = { id: `G${i}`, name: `Casilla ${i + 1}`, details: `Una casilla normal.`, type: 'normal', path: 'normal' };

        if (junctionPositions.includes(i)) {
            const decisionTypes = [
                {
                    name: "Encrucijada Profesional",
                    details: "¿Qué camino profesional tomarás?",
                    choices: [
                        { text: "Emprender un negocio", effect: { dinero: -200, knowledge: 30, ocio: -20 }, description: "Alto riesgo, alta recompensa" },
                        { text: "Conseguir un ascenso", effect: { dinero: 150, salud: -15, ocio: -10 }, description: "Más responsabilidad y dinero" },
                        { text: "Cambiar de carrera", effect: { knowledge: 40, dinero: -100, ocio: 10 }, description: "Nuevo comienzo profesional" }
                    ]
                },
                {
                    name: "Decisión de Vida",
                    details: "Un momento crucial en tu vida personal.",
                    choices: [
                        { text: "Formar una familia", effect: { ocio: 40, dinero: -150, salud: 20 }, description: "Felicidad pero gastos extra" },
                        { text: "Viajar por el mundo", effect: { ocio: 50, knowledge: 30, dinero: -200 }, description: "Experiencias inolvidables" },
                        { text: "Invertir en educación", effect: { knowledge: 50, dinero: -100, ocio: -20 }, description: "Preparación para el futuro" }
                    ]
                },
                {
                    name: "Inversión Importante",
                    details: "¿Cómo invertirás tus ahorros?",
                    choices: [
                        { text: "Comprar propiedad", effect: { dinero: -300, pension: 200 }, description: "Inversión a largo plazo" },
                        { text: "Invertir en bolsa", effect: { dinero: 100, knowledge: 20 }, description: "Riesgo moderado" },
                        { text: "Ahorrar para pensión", effect: { pension: 150, dinero: -100 }, description: "Seguridad futura" }
                    ]
                },
                {
                    name: "Crisis Personal",
                    details: "Enfrentas un desafío inesperado.",
                    choices: [
                        { text: "Buscar ayuda profesional", effect: { salud: 40, dinero: -80, knowledge: 10 }, description: "Cuida tu bienestar" },
                        { text: "Afrontarlo solo", effect: { salud: -20, knowledge: 30, ocio: -10 }, description: "Fortaleza personal" },
                        { text: "Tomar un descanso", effect: { ocio: 30, salud: 20, dinero: -50 }, description: "Tiempo para recuperarse" }
                    ]
                },
                {
                    name: "Oportunidad Única",
                    details: "Se presenta una oportunidad que no esperabas.",
                    choices: [
                        { text: "Aceptar el riesgo", effect: { dinero: 200, salud: -10, knowledge: 20 }, description: "Grandes recompensas posibles" },
                        { text: "Jugar seguro", effect: { dinero: 50, salud: 10, ocio: 10 }, description: "Estabilidad garantizada" },
                        { text: "Buscar más información", effect: { knowledge: 40, ocio: -10 }, description: "Decisión informada" }
                    ]
                },
                {
                    name: "Cambio de Estilo de Vida",
                    details: "Es momento de replantear tu forma de vivir.",
                    choices: [
                        { text: "Vida saludable", effect: { salud: 50, dinero: -100, ocio: -20 }, description: "Inversión en bienestar" },
                        { text: "Vida social activa", effect: { ocio: 60, dinero: -150, knowledge: 10 }, description: "Más conexiones y diversión" },
                        { text: "Vida equilibrada", effect: { salud: 20, ocio: 20, dinero: -50 }, description: "Balance en todo" }
                    ]
                }
            ];
            
            const selectedDecision = decisionTypes[Math.floor(Math.random() * decisionTypes.length)];
            squareData = {
                id: `JUNCTION${i}`,
                name: selectedDecision.name,
                type: 'junction',
                path: 'normal', // Cambiar a 'normal' para que se vea igual
                details: selectedDecision.details,
                choices: selectedDecision.choices,
                hidden: true // Marcar como oculta hasta que se pise
            };
        } else if (specialTileCounter < tiposDeCasilla.length) {
            const tipo = tiposDeCasilla[specialTileCounter];
            squareData.type = tipo;
            if (tipo === 'trivia') {
                squareData.name = "Casilla de Trivia";
                squareData.details = "¡Pon a prueba tu conocimiento sobre seguridad social!";
            } else if (tipo === 'card_event') {
                squareData.name = "Carta del Destino";
                squareData.details = "El azar influye en tu vida.";
            } else if (tipo === 'pension') {
                Object.assign(squareData, getRandomPensionEvent());
            } else if (tipo === 'study') {
                squareData.name = "Casilla de Estudio";
                squareData.details = "¡Dedica tiempo a aprender y mejorar tus conocimientos!";
                squareData.effect = SQUARE_EFFECTS.study;
            } else if (tipo === 'work') {
                squareData.name = "Casilla de Trabajo";
                squareData.details = "¡Esfuerzo laboral que rinde frutos!";
                squareData.effect = SQUARE_EFFECTS.work;
            } else if (tipo === 'leisure') {
                squareData.name = "Casilla de Ocio";
                squareData.details = "¡Relájate y recarga energías!";
                squareData.effect = SQUARE_EFFECTS.leisure;    
            } else if (tipo === 'crisis') {
                // NUEVO: Casillas de crisis
                const crisisEvents = [
                    {
                        name: "Crisis Económica Personal",
                        details: "Gastos inesperados te golpean fuerte",
                        effect: { dinero: -150, salud: -20, ocio: -15 }
                    },
                    {
                        name: "Crisis de Salud",
                        details: "Problemas de salud requieren atención inmediata",
                        effect: { salud: -30, dinero: -100, ocio: -10 }
                    },
                    {
                        name: "Crisis Profesional",
                        details: "Tu carrera enfrenta serios obstáculos",
                        effect: { dinero: -80, knowledge: -15, salud: -15 }
                    }
                ];
                const selectedCrisis = crisisEvents[Math.floor(Math.random() * crisisEvents.length)];
                Object.assign(squareData, selectedCrisis);
                squareData.type = 'crisis';
            } else if (tipo === 'opportunity') {
                const opportunities = [
                    {
                        name: "Inversión Arriesgada",
                        details: "¿Arriesgas todo por una gran recompensa?",
                        choices: [
                            { text: "Invertir mucho", effect: { dinero: 300, salud: -25 }, description: "Gran riesgo, gran recompensa" },
                            { text: "Invertir poco", effect: { dinero: 50, ocio: -5 }, description: "Jugar seguro" },
                            { text: "No invertir", effect: { ocio: 10 }, description: "Mantener el status quo" }
                        ]
                    },
                    {
                        name: "Oportunidad Laboral Extrema",
                        details: "Un trabajo demandante pero muy bien pagado",
                        choices: [
                            { text: "Aceptar", effect: { dinero: 200, salud: -30, ocio: -20 }, description: "Dinero a costa de bienestar" },
                            { text: "Negociar", effect: { dinero: 100, salud: -10, knowledge: 15 }, description: "Término medio" },
                            { text: "Rechazar", effect: { salud: 15, ocio: 20 }, description: "Priorizar bienestar" }
                        ]
                    }
                ];
                const selectedOpp = opportunities[Math.floor(Math.random() * opportunities.length)];
                Object.assign(squareData, selectedOpp);
                squareData.type = 'opportunity';
            } else if (tipo === 'investment') {
                // NUEVO: Centros de inversión
                squareData.name = "Centro de Inversiones";
                squareData.details = "¡Oportunidad de hacer crecer tu dinero inteligentemente!";
                squareData.type = 'investment';
            }
            specialTileCounter++;
        }
        mainGameBoard.push(squareData);
    }

    mainGameBoard.push({ id: 'END', name: "Final del Camino", type: 'end', path: 'normal', details: "Has llegado al final." });
    console.log("Tablero generado con " + mainGameBoard.filter(c => c.type === 'junction').length + " encrucijadas ocultas.");
}


function getRandomTrivia() {
    if (preguntasDisponibles.length === 0) {
        addMessage("🧠 ¡Has respondido todas las trivias! Se reiniciará el banco de preguntas.");
        preguntasDisponibles = [...triviaBank];
    }
    if (preguntasDisponibles.length === 0) return null;
    const indiceAleatorio = Math.floor(Math.random() * preguntasDisponibles.length);
    return preguntasDisponibles.splice(indiceAleatorio, 1)[0];
}

function getRandomPensionEvent() {
    return pensionEvents[Math.floor(Math.random() * pensionEvents.length)];
}


function showConfirmModal(title, message) {
    return new Promise(resolve => {
        confirmTitle.textContent = title;
        confirmMessage.textContent = message;
        customConfirmModal.classList.remove('hidden');
        customOverlay.classList.add('show');
        customConfirmModal.classList.add('show');

        const onConfirm = () => {
            customConfirmModal.classList.add('hidden');
            customOverlay.classList.remove('show');
            customConfirmModal.classList.remove('show');
            confirmYesBtn.removeEventListener('click', onConfirm);
            confirmNoBtn.removeEventListener('click', onCancel);
            resolve(true);
        };

        const onCancel = () => {
            customConfirmModal.classList.add('hidden');
            customOverlay.classList.remove('show');
            customConfirmModal.classList.remove('show');
            confirmYesBtn.removeEventListener('click', onConfirm);
            confirmNoBtn.removeEventListener('click', onCancel);
            resolve(false);
        };

        confirmYesBtn.addEventListener('click', onConfirm);
        confirmNoBtn.addEventListener('click', onCancel);
    });
}

function showAlertDialog(title, message) {
    alertDialogTitle.textContent = title;
    alertDialogMessage.textContent = message;
    customAlertDialog.classList.remove('hidden');
    customOverlay.classList.add('show');
    customAlertDialog.classList.add('show');

    const onClose = () => {
        customAlertDialog.classList.add('hidden');
        customOverlay.classList.remove('show');
        customAlertDialog.classList.remove('show');
        alertDialogOkBtn.removeEventListener('click', onClose);
    };

    alertDialogOkBtn.addEventListener('click', onClose);
}


function cambiarPantalla(origen, destino) {
    if (!origen || !destino) return;
    origen.classList.add('fade-out');
    setTimeout(() => {
        origen.classList.add('hidden');
        origen.classList.remove('fade-out');
        destino.classList.remove('hidden');
        destino.classList.add('fade-in');
    }, 600);
}


function selectStartPath(pathType, initialEffect, buttonId) {
    document.querySelectorAll('.start-button').forEach(btn => btn.classList.remove('selected-path'));
    document.getElementById(buttonId)?.classList.add('selected-path');
    selectedStartPathButtonId = buttonId;
    startGameTransition(pathType, initialEffect);
}

function startGameTransition(pathType, initialEffect) {
    const name = playerNameInputEl?.value?.trim();
    if (!name) return showAlertDialog('Nombre Requerido', '⚠️ Por favor, ingresa tu nombre.');
    if (!selectedPlayerToken || !selectedPlayerToken.id) return showAlertDialog('Selección de Personaje', '⚠️ Por favor, elige un personaje.');

    playerName = name;
    cambiarPantalla(startScreenEl, gameContainerEl);
    setTimeout(() => initGame(pathType, initialEffect), 600);
}


function initGame(pathType = 'default', initialEffect = {}) {
    player = {
        dinero: GAME_CONFIG.STARTING_MONEY_DEFAULT,
        salud: GAME_CONFIG.STARTING_HEALTH_DEFAULT,
        ocio: GAME_CONFIG.STARTING_LEISURE_DEFAULT,
        pension: 0,
        knowledge: GAME_CONFIG.STARTING_KNOWLEDGE_DEFAULT,
        currentPositionIndex: 0,
        token: selectedPlayerToken.id, 
        // NUEVO: Sistema financiero
        debt: 0,
        creditRating: 100, // 0-100
        investments: {
            stocks: { amount: 0, maturityTurn: 0, expectedReturn: 0 },
            realEstate: { amount: 0, maturityTurn: 0, expectedReturn: 0 },
            crypto: { amount: 0, maturityTurn: 0, expectedReturn: 0 },
            business: { amount: 0, maturityTurn: 0, expectedReturn: 0 }
        },
        totalInvestments: 0
};
    
    turnCounter = 0;
    rachaCorrecta = 0;
    historialDecisiones.length = 0;
    gameState = 'playing';
    movementPointsRemaining = 0;
    isMovingPhase = false;

    if (logrosContainerEl) logrosContainerEl.innerHTML = '';

    if (Object.keys(initialEffect).length > 0) {
        applyEffect(initialEffect);
        registrarDecision(`Elegiste el camino inicial: ${pathType}`);
        const pathNames = { 
            'study': '📚 Senda del Saber', 
            'work': '💼 Ruta Laboral', 
            'leisure': '🌴 Travesía del Ocio',
            'nomad': '💼🌴 Nómada Digital',
            'traveler': '📚🌴 Estudiante Viajero',
            'entrepreneur': '📚💼 Emprendedor Académico',
            'balanced': '🎲 Vida Equilibrada'
        };
        addMessage(`🎯 Has elegido ${pathNames[pathType]}.`);
    } else {
        addMessage(`🎯 ¡Bienvenido ${playerName} a Caminos de Vida!`);
    }

    updateStatsUI();
    renderBoard();
    updatePlayerTokenPosition(player.currentPositionIndex);
    
    if (playerTokenEl && selectedPlayerToken && selectedPlayerToken.src) {
    playerTokenEl.innerHTML = `<img src="${selectedPlayerToken.src}" alt="${selectedPlayerToken.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
    }
    restoreNormalControls();
    
    if (typeof Tone !== 'undefined') Tone.start();
    reproducirMusica('musicCamino');
}

function setupMainButtonListeners() {
    rollDiceButton = document.getElementById('rollDiceButton');
    
    if (rollDiceButton && !rollDiceButton._hasListener) {
        rollDiceButton.addEventListener('click', () => {
            if (gameState !== 'playing' || isMovingPhase) return;
            pulseBoardZoom();
            rollDice();
        });
        rollDiceButton._hasListener = true;
    }

    if (endTurnButton && !endTurnButton._hasListener) {
        endTurnButton.addEventListener('click', () => { if (isMovingPhase) endMovementPhase(); });
        endTurnButton._hasListener = true;
    }

    if (triviaContinueEl && !triviaContinueEl._hasListener) {
        triviaContinueEl.addEventListener('click', closeTriviaModal);
        triviaContinueEl._hasListener = true;
    }
}

function restoreNormalControls() {
    const controlsDiv = document.getElementById('controls');
    if (controlsDiv) {
        controlsDiv.innerHTML = '';
        controlsDiv.classList.remove('path-selection-buttons');
    }
    createNewGameButton();
    if (rollDiceButton) rollDiceButton.disabled = false;
}

function createNewGameButton() {
    const controlsDiv = document.getElementById('controls');
    if (!controlsDiv || document.getElementById('newGameButton')) return;
    
    const newGameBtnEl = document.createElement('button');
    newGameBtnEl.id = 'newGameButton';
    newGameBtnEl.className = 'btn-new-game';
    newGameBtnEl.innerHTML = '🔄 Nuevo Juego';
    newGameBtnEl.addEventListener('click', async () => {
        if (await showConfirmModal('Nuevo Juego', '🔄 ¿Estás seguro?')) newGameLogic();
    });
    controlsDiv.appendChild(newGameBtnEl);
    newGameButton = newGameBtnEl;
    
    // Botón OISS
    const oissBtnEl = document.createElement('button');
    oissBtnEl.className = 'btn-new-game';
    oissBtnEl.style.backgroundColor = '#059669';
    oissBtnEl.style.marginTop = '15px';
    oissBtnEl.innerHTML = '🏢 Volver a OISS';
    oissBtnEl.addEventListener('click', () => volverAOISS());
    controlsDiv.appendChild(oissBtnEl);
}

function newGameLogic() {
    initGame('default', {});
    addMessage(`🔄 Nuevo juego iniciado para ${playerName}`);
}

// Board functions
function getCurrentSquare() {
    return mainGameBoard[player.currentPositionIndex];
}

function indexToCoords(index) {
    return { row: Math.floor(index / GAME_CONFIG.BOARD_COLS), col: index % GAME_CONFIG.BOARD_COLS };
}

function coordsToIndex(row, col) {
    if (row < 0 || row >= GAME_CONFIG.BOARD_ROWS || col < 0 || col >= GAME_CONFIG.BOARD_COLS) return -1;
    return row * GAME_CONFIG.BOARD_COLS + col;
}

function renderBoard() {
    if (!gameBoardEl) return;
    gameBoardEl.innerHTML = '';
    mainGameBoard.forEach((squareData, index) => {
        const squareEl = document.createElement('div');
        squareEl.className = `grid-square path-${squareData.path} theme-${currentVisualTheme}`;
        squareEl.dataset.index = index;
        
        // Revelar casilla si es inicio, fin, o ya fue visitada
        const isVisited = index <= player.currentPositionIndex;
        const isStart = squareData.type === 'start';
        const isEnd = squareData.type === 'end';
        
        if (!isVisited && !isStart && !isEnd) {
            squareEl.classList.add('square-hidden');
        } else {
            // Revelar tipo de casilla
            if (squareData.type) {
                squareEl.classList.add(`type-${squareData.type}`);
            }
        }

        if (player.currentPositionIndex === index) {
            squareEl.classList.add('current-position');
            squareEl.classList.remove('square-hidden');
        }

        let tooltipText = `${squareData.name}\n${squareData.details || ''}`;
        if (squareData.cost) tooltipText += `\nCosto: ${formatCost(squareData.cost)}`;
        if (squareData.benefit) tooltipText += `\nBeneficio: ${formatCost(squareData.benefit)}`;
        if (squareData.effect) tooltipText += `\nEfecto: ${formatCost(squareData.effect)}`;
        squareEl.title = tooltipText;
        gameBoardEl.appendChild(squareEl);
    });
    if(playerTokenEl) gameBoardEl.appendChild(playerTokenEl);
}

function updatePlayerTokenPosition(index) {
    const targetSquareEl = gameBoardEl?.querySelector(`[data-index="${index}"]`);
    if (targetSquareEl && playerTokenEl) {
        const targetRect = targetSquareEl.getBoundingClientRect();
        const gameBoardRect = gameBoardEl.getBoundingClientRect();
        const targetX = (targetRect.left - gameBoardRect.left) + (targetRect.width / 2);
        const targetY = (targetRect.top - gameBoardRect.top) + (targetRect.height / 2);
        playerTokenEl.style.left = `${targetX}px`;
        playerTokenEl.style.top = `${targetY}px`;
        
        // Actualizar la imagen del token en el tablero
        if (selectedPlayerToken && selectedPlayerToken.src) {
            playerTokenEl.innerHTML = `<img src="${selectedPlayerToken.src}" alt="${selectedPlayerToken.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        }
    }
}

async function animatePlayerMove(newIndex, callback) {
    if (!playerTokenEl) return;
    playerTokenEl.style.animation = 'none';
    document.querySelectorAll('.grid-square.current-position').forEach(sq => sq.classList.remove('current-position'));
    updatePlayerTokenPosition(newIndex);
    playerTokenEl.classList.add('token-land-effect');
    
    // Reveal the new square as the token lands on it
    gameBoardEl?.querySelector(`[data-index="${newIndex}"]`)?.classList.remove('square-hidden');

    await new Promise(r => setTimeout(r, 250));
    playerTokenEl.classList.remove('token-land-effect');
    const finalSquareEl = gameBoardEl?.querySelector(`[data-index="${newIndex}"]`);
    if (finalSquareEl) {
        finalSquareEl.classList.add('current-position');
        // Ensure the type class is applied if it was hidden
        const squareData = mainGameBoard[newIndex];
        if (squareData && squareData.type) {
            finalSquareEl.classList.add(`type-${squareData.type}`);
        }
    }
    playerTokenEl.style.animation = 'mapBounce 1s infinite';
    if (callback) callback();
}


// Movement functions
function startMovementPhase() {
    isMovingPhase = true;
    if (rollDiceButton) rollDiceButton.disabled = true;
    if (endTurnButton) endTurnButton.classList.remove('hidden');
    addMessage(`Tienes <strong>${movementPointsRemaining} puntos de movimiento</strong>.`);
    highlightAvailableMoves();
}

function highlightAvailableMoves() {
    document.querySelectorAll('.grid-square.reachable-square').forEach(sq => {
        sq.classList.remove('reachable-square');
        sq.removeEventListener('click', handleMoveClick);
    });
    if (movementPointsRemaining <= 0) {
        endMovementPhase();
        return;
    }
    const { row, col } = indexToCoords(player.currentPositionIndex);
    const directions = [{ dr: -1, dc: 0 }, { dr: 1, dc: 0 }, { dr: 0, dc: -1 }, { dr: 0, dc: 1 }];
    directions.forEach(dir => {
        const newIndex = coordsToIndex(row + dir.dr, col + dir.dc);
        if (newIndex !== -1 && newIndex < GAME_CONFIG.TOTAL_BOARD_SQUARES) {
            const squareEl = gameBoardEl?.querySelector(`[data-index="${newIndex}"]`);
            // Solo permitir movimiento a casillas que no han sido visitadas (que tienen la clase square-hidden)
            if (squareEl && squareEl.classList.contains('square-hidden')) {
                squareEl.classList.add('reachable-square');
                const squareData = mainGameBoard[newIndex];
                if (squareData && squareData.type) {
                     squareEl.classList.add(`type-${squareData.type}`);
                }
                squareEl.addEventListener('click', handleMoveClick);
            }
        }
    });
}

async function handleMoveClick(event) {
    if (!isMovingPhase || movementPointsRemaining <= 0) return;
    
    // Clean up all highlights before moving
    document.querySelectorAll('.grid-square.reachable-square').forEach(sq => {
        sq.classList.remove('reachable-square');
        sq.removeEventListener('click', handleMoveClick);
        // Do not re-hide the square, just remove highlight
    });

    const targetIndex = parseInt(event.currentTarget.dataset.index);
    player.currentPositionIndex = targetIndex;
    movementPointsRemaining--;
    
    await animatePlayerMove(targetIndex);
    updateStatsUI();
    handleSquareAction();

    if (movementPointsRemaining > 0 && gameState === 'playing') {
        addMessage(`Te quedan ${movementPointsRemaining} puntos de movimiento.`);
        highlightAvailableMoves();
    } else {
        endMovementPhase();
    }
}

function endMovementPhase() {
    isMovingPhase = false;
    movementPointsRemaining = 0;
    updateStatsUI();
    if (rollDiceButton) rollDiceButton.disabled = false;
    if (endTurnButton) endTurnButton.classList.add('hidden');
    addMessage("Turno terminado. ¡Lanza el dado de nuevo!");
    

    document.querySelectorAll('.grid-square.reachable-square').forEach(sq => {
        sq.classList.remove('reachable-square');
        sq.removeEventListener('click', handleMoveClick);
    });

    endTurn();
}


function handleSquareAction() {
    const square = getCurrentSquare();
    if (!square) return;
    if (player.currentPositionIndex === GAME_CONFIG.TOTAL_BOARD_SQUARES - 1 || square.type === 'end') {
        endGame("🎉 ¡FELICITACIONES! Has completado tu vida simulada.");
        return;
    }
    addMessage(`🎯 Has llegado a: <strong>${square.name || 'Casilla'}</strong>. ${square.details || ''}`);
    
    if (square.type === 'trivia') {
        reproducirMusica('musicTrivia');
        const preguntaParaMostrar = getRandomTrivia();
        if (preguntaParaMostrar) {
            setTimeout(() => showTriviaModal(preguntaParaMostrar), 500);
        } else {
            addMessage("🤔 No hay preguntas de trivia disponibles en este momento.");
            reproducirMusica('musicCamino');
        }
    } else if ((square.type === 'decision' || square.type === 'junction') && square.choices) {
        reproducirMusica('musicDecision');
        setTimeout(() => showDecisionModal(square), 500);
    } else if (square.type === 'card_event') {
        reproducirMusica('musicDecision');
        setTimeout(() => sacarCarta(), 500);
    } else if (square.type === 'pension') { 
        reproducirMusica('musicDecision'); 
        showConfirmModal(square.name, `${square.details}\nCosto: ${formatCost(square.cost)}\nBeneficio: ${formatCost(square.benefit)}`).then(confirmed => {
            if (confirmed) {
                if (canAfford(square.cost)) {
                    applyEffect(square.cost, true);
                    applyEffect(square.benefit);
                    addMessage(`🏦 Has participado en ${square.name}.`);
                    reproducirMusica('musicEventPositive');
                } else {
                    addMessage(`💸 No tienes suficiente dinero para ${square.name}.`);
                    reproducirMusica('musicEventNegative');
                }
            } else {
                addMessage(`❌ Has decidido no participar en ${square.name}.`);
            }
            reproducirMusica('musicCamino');
            updateStatsUI();
            if (isMovingPhase) highlightAvailableMoves();
        });
    }
    
    else if (square.type === 'study' || square.type === 'work' || square.type === 'leisure') {
        applyEffect(square.effect);
        addMessage(`🌟 ${square.name}: ${square.details}. ${formatCost(square.effect)}`);
        reproducirMusica('musicEventPositive'); 
        reproducirMusica('musicCamino');
    }
    
    else if (square.type === 'crisis') {
    
        applyEffect(square.effect);
        addMessage(`⚡ CRISIS: ${square.name} - ${square.details}`);
        showEffectPopup(`${formatCost(square.effect)} (crisis)`, false);
        reproducirMusica('musicEventNegative');
        setTimeout(() => reproducirMusica('musicCamino'), 2000);
    } else if (square.type === 'opportunity' && square.choices) {
        
        reproducirMusica('musicDecision');
        setTimeout(() => showDecisionModal(square), 500);
    } else if (square.type === 'investment') {
    reproducirMusica('musicDecision');
    setTimeout(() => showInvestmentModal(), 500);
   } 
    
    updateStatsUI();
    revisarCheckpoint();
    checkRareEvent();
}


function rollDice() {
    playDiceSound();
    if (rollDiceButton) rollDiceButton.disabled = true;
    if (dice3dElement) dice3dElement.classList.add('rolling');
    const finalResult = Math.floor(Math.random() * GAME_CONFIG.MAX_DICE_ROLL) + 1;
    let rotationX, rotationY;
    switch (finalResult) {
        case 1: rotationX = '0deg'; rotationY = '0deg'; break;
        case 2: rotationX = '0deg'; rotationY = '-90deg'; break;
        case 3: rotationX = '0deg'; rotationY = '180deg'; break;
        case 4: rotationX = '0deg'; rotationY = '90deg'; break;
        case 5: rotationX = '-90deg'; rotationY = '0deg'; break;
        case 6: rotationX = '90deg'; rotationY = '0deg'; break;
    }
    if (dice3dElement) {
        dice3dElement.style.setProperty('--final-rotX', rotationX);
        dice3dElement.style.setProperty('--final-rotY', rotationY);
    }
    setTimeout(() => {
        if (dice3dElement) {
            dice3dElement.classList.remove('rolling');
            dice3dElement.style.transform = `rotateX(${rotationX}) rotateY(${rotationY})`;
        }
        movementPointsRemaining = finalResult;
        startMovementPhase();
    }, 1500);
}

function updateStatsUI() {
    if (dineroStatEl) dineroStatEl.textContent = player.dinero.toLocaleString();
    if (saludStatEl) saludStatEl.textContent = player.salud;
    if (ocioStatEl) ocioStatEl.textContent = player.ocio;
    if (pensionStatEl) pensionStatEl.textContent = player.pension.toLocaleString();
    if (knowledgeStatEl) knowledgeStatEl.textContent = player.knowledge;
    const creditStatEl = document.getElementById('creditStat');
    const investmentsStatEl = document.getElementById('investmentsStat');
    const debtStatEl = document.getElementById('debtStat');
    
    if (creditStatEl) creditStatEl.textContent = player.creditRating;
    if (investmentsStatEl) investmentsStatEl.textContent = player.totalInvestments.toLocaleString();
    if (debtStatEl) {
        debtStatEl.textContent = player.debt.toLocaleString();
        if (player.debt > 0) {
            debtStatEl.parentElement.style.backgroundColor = '#fee2e2';
            debtStatEl.parentElement.style.borderColor = '#ef4444';
        } else {
            debtStatEl.parentElement.style.backgroundColor = '';
            debtStatEl.parentElement.style.borderColor = '';
        }
    }
    const sq = getCurrentSquare();
    if (currentPositionStatEl) currentPositionStatEl.textContent = sq ? `${sq.name || 'Casilla'}` : "Inicio";
    if (movementPointsDisplay) movementPointsDisplay.textContent = `Puntos de Movimiento: ${movementPointsRemaining}`;
    if (progressBarEl) {
        progressBarEl.value = player.currentPositionIndex;
        progressBarEl.max = GAME_CONFIG.TOTAL_BOARD_SQUARES - 1;
    }
    if (rollDiceButton && !rollDiceButton.disabled && gameState === 'playing') {
        if (player.salud <= 0) endGame("💀 Tu salud ha llegado a 0.");
    }
    updateStatColor(saludStatEl, player.salud, 25, 60);
    updateStatColor(dineroStatEl, player.dinero, 200, 800);
    actualizarAvatar();
    if (player.dinero >= 1000) desbloquearLogro("Ahorros Maestros", "💸");
    if (player.salud >= 100) desbloquearLogro("Vida Saludable", "💪");
    if (player.knowledge >= 50) desbloquearLogro("Mente Brillante", "🧠");
    if (player.pension >= 500) desbloquearLogro("Futuro Asegurado", "🏦");
    if (player.ocio >= 100) desbloquearLogro("Maestro del Ocio", "🏖️");
}

function updateStatColor(element, value, lowThreshold, goodThreshold) {
    if (!element || !element.parentElement) return;
    element.parentElement.classList.remove('stat-warning', 'stat-danger', 'stat-good');
    if (value <= lowThreshold) element.parentElement.classList.add('stat-danger');
    else if (value <= goodThreshold) element.parentElement.classList.add('stat-warning');
    else element.parentElement.classList.add('stat-good');
}

function addMessage(message) {
    if (!messageLogEl) return;
    const p = document.createElement('p');
    p.innerHTML = message;
    messageLogEl.prepend(p);
    while (messageLogEl.childElementCount > 10) messageLogEl.removeChild(messageLogEl.lastChild);
    messageLogEl.scrollTop = 0;
}

function pulseBoardZoom() {
    if (gameBoardEl) {
        gameBoardEl.classList.add('zoomed');
        setTimeout(() => gameBoardEl.classList.remove('zoomed'), 500);
    }
}


function renderCharacterSelector() {
    if (!characterSelectorEl) return;
    characterSelectorEl.innerHTML = '';
    availablePlayerTokens.forEach(character => {
        const tokenDiv = document.createElement('div');
        tokenDiv.className = 'character-option';
        
        // Crear imagen en lugar de emoji
        const img = document.createElement('img');
        img.src = character.src;
        img.alt = character.name;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '8px';
        
        tokenDiv.appendChild(img);
        tokenDiv.addEventListener('click', () => selectPlayerToken(character));
        characterSelectorEl.appendChild(tokenDiv);
    });
    selectPlayerToken(selectedPlayerToken);
}

function selectPlayerToken(character) {
    selectedPlayerToken = character;
    document.querySelectorAll('.character-option').forEach(option => option.classList.remove('selected'));
    
    const selectedOption = Array.from(document.querySelectorAll('.character-option')).find(option => {
        const img = option.querySelector('img');
        return img && img.src.includes(character.id);
    });
    
    if (selectedOption) selectedOption.classList.add('selected');
}

function actualizarAvatar() {
    if (!playerAvatarEl) return;
    const { salud, dinero } = player;
    if (salud <= 20 || dinero <= 200) playerAvatarEl.textContent = "😢";
    else if (salud >= 80 && dinero >= 800) playerAvatarEl.textContent = "😄";
    else playerAvatarEl.textContent = "😐";
}


function desbloquearLogro(nombre, emoji) {
    if (!logrosContainerEl || document.getElementById(`logro-${nombre.replace(/\s/g, '-')}`)) return;
    const div = document.createElement("div");
    div.id = `logro-${nombre.replace(/\s/g, '-')}`;
    div.textContent = emoji;
    div.title = nombre;
    div.className = "text-3xl animate-bounce";
    logrosContainerEl.appendChild(div);
    addMessage(`🏆 ¡Logro desbloqueado: <strong>${nombre}</strong>!`);
    reproducirMusica('musicEventPositive');
    lanzarConfetiGanador(50, { spread: 60 });
}


// ✅ Variable para controlar si el audio ya se inicializó
let audioInitialized = false;

// ✅ Función mejorada para inicializar audio
async function initAudio() {
    if (audioInitialized || typeof Tone === 'undefined') return;
    
    try {
        // ⚡ CLAVE: Iniciar el contexto de audio de Tone.js
        await Tone.start();
        audioInitialized = true;
        console.log('✅ Audio context iniciado correctamente');
        
        // Crear sintetizadores después de que el contexto esté listo
        diceSynth = new Tone.Synth().toDestination();
        triviaSynth = new Tone.Synth().toDestination();
        eventSynth = new Tone.MembraneSynth().toDestination();
    } catch (error) {
        console.warn('⚠️ Error al inicializar audio:', error);
    }
}

// ✅ Inicializar audio en el primer click del usuario
document.addEventListener('click', async () => {
    if (!audioInitialized) {
        await initAudio();
    }
}, { once: true }); // Se ejecuta solo una vez

function reproducirMusica(name) {
    const audioElements = [bgMusicElement, musicDecision, musicFinal, musicTrivia, musicEventPositive, musicEventNegative];
    audioElements.forEach(audio => {
        if (audio) {
            if (audio.id === name) {
                if (audio.paused) audio.play().catch(e => console.log(`Error al reproducir ${name}:`, e));
            } else if (!audio.paused) {
                audio.pause();
                audio.currentTime = 0;
            }
        }
    });
}

function playDiceSound() { if (diceSynth) diceSynth.triggerAttackRelease("C4", "8n"); }
function playCorrectSound() { if (triviaSynth) triviaSynth.triggerAttackRelease("E5", "16n"); }
function playWrongSound() { if (triviaSynth) triviaSynth.triggerAttackRelease("A2", "8n"); }


function applyEffect(effect, isCost = false) {
    for (const key in effect) {
        if (player.hasOwnProperty(key)) player[key] += effect[key];
    }
    player.salud = Math.max(0, player.salud);
    player.ocio = Math.max(0, player.ocio);
    player.knowledge = Math.max(0, player.knowledge);
    player.pension = Math.max(0, player.pension);
}

function canAfford(cost) {
    return !cost || !cost.dinero || player.dinero >= Math.abs(cost.dinero);
}

function formatCost(obj) {
    if (!obj) return '';
    const parts = [];
    if (obj.dinero !== undefined) parts.push(`${obj.dinero > 0 ? '+' : ''}${obj.dinero} 💰`);
    if (obj.salud !== undefined) parts.push(`${obj.salud > 0 ? '+' : ''}${obj.salud} ❤️`);
    if (obj.ocio !== undefined) parts.push(`${obj.ocio > 0 ? '+' : ''}${obj.ocio} 🎉`);
    if (obj.knowledge !== undefined) parts.push(`${obj.knowledge > 0 ? '+' : ''}${obj.knowledge} 🧠`);
    if (obj.pension !== undefined) parts.push(`${obj.pension > 0 ? '+' : ''}${obj.pension} 🏦`);
    return parts.join(', ');
}

function handleDebtSystem() {
    
    if (player.dinero < 0) {
        const newDebt = Math.abs(player.dinero);
        player.debt += newDebt;
        player.dinero = 0;
        addMessage(`💳 DEUDA ACUMULADA: +${newDebt}. Total: ${player.debt}`);
        showEffectPopup(`+${newDebt} deuda`, false);
    }
    
    
    if (player.debt > 0 && turnCounter % 4 === 0) {
        const interest = Math.floor(player.debt * 0.12); 
        player.debt += interest;
        addMessage(`📈 INTERESES DE DEUDA: +${interest}. Total: ${player.debt}`);
        showEffectPopup(`+${interest} deuda (intereses)`, false);
        
      
        if (player.debt > 300) {
            applyEffect({ salud: -5, ocio: -8 });
            addMessage("😰 El estrés de las deudas afecta tu bienestar...");
        }
    }
    
  
    updateCreditRating();
}

function updateCreditRating() {
    const oldRating = player.creditRating;
    

    if (player.debt > 800) {
        player.creditRating = Math.max(0, player.creditRating - 8);
    } else if (player.debt > 400) {
        player.creditRating = Math.max(10, player.creditRating - 4);
    } else if (player.debt > 100) {
        player.creditRating = Math.max(30, player.creditRating - 2);
    } else if (player.debt === 0 && player.dinero > 500) {
        player.creditRating = Math.min(100, player.creditRating + 3);
    }
    
    
    if (player.totalInvestments > 200) {
        player.creditRating = Math.min(100, player.creditRating + 1);
    }
    
    if (oldRating !== player.creditRating) {
        const change = player.creditRating - oldRating;
        addMessage(`📊 Credit Rating: ${oldRating} → ${player.creditRating} (${change > 0 ? '+' : ''}${change})`);
    }
}

function payDebt(amount) {
    if (player.dinero >= amount && player.debt > 0) {
        const payment = Math.min(amount, player.debt);
        player.dinero -= payment;
        player.debt -= payment;
        addMessage(`💳 PAGO DE DEUDA: -${payment}. Deuda restante: ${player.debt}`);
        showEffectPopup(`-${payment} deuda`, true);
        updateCreditRating();
        
       
        if (player.debt === 0) {
            applyEffect({ salud: 10, ocio: 15 });
            addMessage("🎉 ¡Libre de deudas! Te sientes renovado.");
        }
        return true;
    }
    return false;
}

function canGetCredit(amount) {
    const maxCredit = Math.floor(player.creditRating * 5); // Credit rating * 5 = max crédito
    return (player.debt + amount) <= maxCredit;
}


function processInvestments() {
    let hasMaturedInvestments = false;
    
    Object.keys(player.investments).forEach(type => {
        const investment = player.investments[type];
        
        
        if (investment.amount > 0 && turnCounter >= investment.maturityTurn) {
            const finalReturn = investment.expectedReturn;
            const profit = finalReturn - investment.amount;
            
            
            player.dinero += finalReturn;
            player.totalInvestments -= investment.amount;
            
            
            addMessage(`📈 INVERSIÓN MADURA: ${getInvestmentName(type)}`);
            addMessage(`💰 Invertiste: ${investment.amount} | Recibiste: ${finalReturn} | Ganancia: ${profit}`);
            
            if (profit > 0) {
                showEffectPopup(`+${finalReturn} 💰 (inversión)`, true);
                reproducirMusica('musicEventPositive');
            } else {
                showEffectPopup(`+${finalReturn} 💰 (pérdida)`, false);
                reproducirMusica('musicEventNegative');
            }
            
           
            player.investments[type] = { amount: 0, maturityTurn: 0, expectedReturn: 0 };
            hasMaturedInvestments = true;
        }
    });
    
    if (hasMaturedInvestments) {
        setTimeout(() => reproducirMusica('musicCamino'), 2000);
    }
}

function getInvestmentName(type) {
    const names = {
        stocks: '📈 Acciones',
        realEstate: '🏠 Bienes Raíces', 
        crypto: '₿ Criptomonedas',
        business: '🏪 Negocio Propio'
    };
    return names[type] || type;
}

function calculateInvestmentReturn(type, amount, marketConditions) {
    let returnMultiplier = 1.0;
    let riskFactor = Math.random();
    
    switch(type) {
        case 'stocks':
            returnMultiplier = 0.95 + (riskFactor * 0.25); 
            break;
        case 'realEstate':
            returnMultiplier = 1.02 + (riskFactor * 0.08); 
            break;
        case 'crypto':
            returnMultiplier = 0.6 + (riskFactor * 0.8); 
            break;
        case 'business':
            returnMultiplier = 0.85 + (riskFactor * 0.4); 
            break;
    }
    

    const creditBonus = (player.creditRating / 100) * 0.1;
    returnMultiplier += creditBonus;
    
    return Math.floor(amount * returnMultiplier);
}



function sacarCarta() {
    const carta = eventCards[Math.floor(Math.random() * eventCards.length)];
    showAlertDialog("🃏 Carta de la Vida", carta.text);
    applyEffect(carta.effect);
    addMessage(`🃏 Has sacado una carta: "${carta.text}"`);
    updateStatsUI();
    registrarDecision(`Carta de Evento: "${carta.text}"`);
    if (Object.values(carta.effect).some(val => val > 0)) reproducirMusica('musicEventPositive');
    else reproducirMusica('musicEventNegative');
    reproducirMusica('musicCamino');
    if (isMovingPhase) highlightAvailableMoves();
}

function checkRareEvent() {
    if (Math.random() < 0.01) {
        const rareEvents = [
            { title: "🌠 Evento Misterioso", message: "¡Encontraste un billete premiado!", effect: { dinero: 500 } },
            { title: "🍀 Golpe de Suerte", message: "Un amigo te devuelve dinero prestado.", effect: { dinero: 200, ocio: 10 } },
            { title: "⛈️ Desafío Inesperado", message: "Un gasto imprevisto te golpea.", effect: { dinero: -300, salud: -10 } }
        ];
        const randomEvent = rareEvents[Math.floor(Math.random() * rareEvents.length)];
        showAlertDialog(randomEvent.title, randomEvent.message);
        applyEffect(randomEvent.effect);
        updateStatsUI();
        registrarDecision(`Evento Raro: ${randomEvent.title}`);
    }
}

function revisarCheckpoint() {
    if (checkpoints.includes(player.currentPositionIndex)) {
        saveGameToStorage();
        showAlertDialog("💾 Checkpoint", `¡Progreso guardado en casilla ${player.currentPositionIndex}!`);
        registrarDecision(`Checkpoint alcanzado en casilla ${player.currentPositionIndex}`);
    }
}

function showTriviaModal(trivia) {
    if (!triviaModalEl) return;
    currentTriviaQuestion = trivia;
    triviaQuestionEl.textContent = trivia.pregunta;
    triviaOptionsEl.innerHTML = '';
    triviaResultEl.classList.add('hidden');
    triviaContinueEl.classList.add('hidden');
    document.body.classList.add('modal-open');

    trivia.opciones.forEach(option => {
        const optionEl = document.createElement('div');
        optionEl.className = 'trivia-option';
        optionEl.textContent = option;
        optionEl.addEventListener('click', () => checkTriviaAnswer(option, trivia));
        triviaOptionsEl.appendChild(optionEl);
    });
    
    triviaModalEl.classList.remove('hidden');
    customOverlay.classList.add('show');
}

function checkTriviaAnswer(selectedOption, trivia) {
    if (!triviaOptionsEl || !triviaResultEl || !triviaContinueEl) return;
    const { respuestaCorrecta, mensajeCorrecto, mensajeIncorrecto, efectoDinero, efectoSalud, efectoOcio, efectoConocimiento } = trivia;
    
    triviaOptionsEl.querySelectorAll('.trivia-option').forEach(option => {
        option.style.pointerEvents = 'none';
        if (option.textContent === respuestaCorrecta) {
            option.classList.add('correct');
        } else if (option.textContent === selectedOption) {
            option.classList.add('incorrect');
        }
    });

    if (selectedOption === respuestaCorrecta) {
        triviaResultEl.textContent = `🎉 ${mensajeCorrecto}`;
        triviaResultEl.className = 'trivia-result correct';
        const reward = { dinero: efectoDinero || 0, salud: efectoSalud || 0, ocio: efectoOcio || 0, knowledge: efectoConocimiento || 0 };
        applyEffect(reward);
        addMessage(`✅ Trivia: ¡Correcto! ${formatCost(reward)}`);
        playCorrectSound();
        lanzarConfetiGanador(50);
        procesarRespuestaTrivia(true);
    } else {
        triviaResultEl.textContent = `❌ ${mensajeIncorrecto}`;
        triviaResultEl.className = 'trivia-result incorrect';
        const penalty = { dinero: -20, salud: -5 };
        applyEffect(penalty);
        addMessage(`❌ Trivia: Incorrecto. ${formatCost(penalty)}`);
        playWrongSound();
        procesarRespuestaTrivia(false);
    }
    
    triviaResultEl.classList.remove('hidden');
    triviaContinueEl.classList.remove('hidden');
    updateStatsUI();
    registrarDecision(`Trivia: ${selectedOption === respuestaCorrecta ? 'Correcta' : 'Incorrecta'}`);
}

function closeTriviaModal() {
    if (!triviaModalEl) return;
    triviaModalEl.classList.add('hidden');
    if (customOverlay) customOverlay.classList.remove('show');
    document.body.classList.remove('modal-open');
    reproducirMusica('musicCamino');
    if (isMovingPhase) highlightAvailableMoves();
}

function showDecisionModal(decision) {
    if (!decisionModalEl) return;
    decisionTitleEl.textContent = decision.name;
    decisionDescriptionEl.textContent = decision.details;
    decisionOptionsEl.innerHTML = '';
    document.body.classList.add('modal-open');
    decision.choices.forEach((choice, index) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'decision-option';
        optionEl.innerHTML = `${index + 1}. ${choice.text}<p class="choice-effect">${choice.description || ''} ${formatCost(choice.effect)}</p>`;
        optionEl.addEventListener('click', () => chooseDecision(choice));
        decisionOptionsEl.appendChild(optionEl);
    });
    decisionModalEl.classList.remove('hidden');
    customOverlay.classList.add('show');
}

function chooseDecision(choice) {
    if (choice.cost && !canAfford(choice.cost)) {
        showAlertDialog('Dinero Insuficiente', '💸 No puedes pagar esta opción.');
        return;
    }
    if (choice.cost) applyEffect(choice.cost, true);
    if (choice.effect) applyEffect(choice.effect);
    if (typeof choice.action === 'function') choice.action();
    decisionModalEl.classList.add('hidden');
    customOverlay.classList.remove('show');
    document.body.classList.remove('modal-open');
    updateStatsUI();
    registrarDecision(`Decisión: "${choice.text}"`);
    reproducirMusica('musicCamino');
    endMovementPhase();
}

function procesarRespuestaTrivia(isCorrect) {
    if (isCorrect) {
        rachaCorrecta++;
        addMessage(`¡Racha de trivias: ${rachaCorrecta} correctas!`);
        if (rachaCorrecta >= 3) desbloquearLogro("Racha de Sabiduría", "🔥");
    } else {
        rachaCorrecta = 0;
        addMessage("Racha de trivias reiniciada.");
    }
}



function saveGameToStorage() {
    if (gameState !== 'playing') return;
    const gameData = { player, playerName, gameState, turnCounter, currentVisualTheme, rachaCorrecta, dificultad, historialDecisiones, movementPointsRemaining, isMovingPhase, selectedStartPathButtonId };
    try {
        localStorage.setItem('caminosDeVidaSave', JSON.stringify(gameData));
        addMessage('💾 Progreso guardado automáticamente.');
    } catch (error) {
        console.error('Error saving game:', error);
    }
}

async function loadGameLogic() {
    const savedGame = localStorage.getItem('caminosDeVidaSave');
    if (!savedGame) return showAlertDialog('No Guardado', '❌ No hay juegos guardados');
    try {
        const gameData = JSON.parse(savedGame);
        player = gameData.player;
        playerName = gameData.playerName || playerName;
        gameState = gameData.gameState || 'playing';
        selectedPlayerToken = availablePlayerTokens.find(char => char.id === player.token) || availablePlayerTokens[0];
        turnCounter = gameData.turnCounter || 0;
        currentVisualTheme = gameData.currentVisualTheme || 'default';
        rachaCorrecta = gameData.rachaCorrecta || 0;
        dificultad = gameData.dificultad || 'normal';
        historialDecisiones.length = 0;
        if (gameData.historialDecisiones) historialDecisiones.push(...gameData.historialDecisiones);
        movementPointsRemaining = gameData.movementPointsRemaining || 0;
        isMovingPhase = gameData.isMovingPhase || false;
        if (playerWelcomeEl) playerWelcomeEl.textContent = `¡Bienvenido de vuelta, ${playerName}! 🎯`;
        updateStatsUI();
        renderBoard();
        updatePlayerTokenPosition(player.currentPositionIndex);
        if (playerTokenEl && selectedPlayerToken) {
        playerTokenEl.innerHTML = `<img src="${selectedPlayerToken.src}" alt="${selectedPlayerToken.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        }
        addMessage(`🔄 Juego cargado. Continúas en: ${getCurrentSquare()?.name || 'Posición desconocida'}`);
        setTheme(currentVisualTheme);
        restoreNormalControls();
        if (typeof Tone !== 'undefined') Tone.start();
        reproducirMusica('musicCamino');
        if (isMovingPhase) {
            highlightAvailableMoves();
        }
    } catch (error) {
        showAlertDialog('Error al Cargar', '❌ Error al cargar el juego guardado');
        console.error('Error loading game:', error);
    }
}


function endTurn() {
    turnCounter++;

    applyDeteriorationEffects();
    handleDebtSystem(); 
    processInvestments(); 
    updateAgeUI();
    updateStatsUI();
    
    if (player.salud <= 0) {
        endGame("💀 Tu salud llegó a 0. La vida es dura sin cuidarse...");
        return;
    }
    if (player.ocio <= 0) {
        endGame("😫 El estrés te consumió. Sin descanso no hay vida...");
        return;
    }
    
    if (turnCounter > 0 && turnCounter % (10 + Math.floor(Math.random() * 5)) === 0) {
        triggerObligatoryEvent();
    }
    
    if (turnCounter % GAME_CONFIG.AUTOSAVE_TURNS === 0) saveGameToStorage();
}

function registrarDecision(texto) {
    historialDecisiones.push(`${new Date().toLocaleTimeString()}: ${texto}`);
}

function getPathName(pathType) {
    const pathNames = {
        'study': '📚 Senda del Saber',
        'work': '💼 Ruta Laboral',
        'leisure': '🌴 Travesía del Ocio',
        'nomad': '💼🌴 Nómada Digital',
        'traveler': '📚🌴 Estudiante Viajero',
        'entrepreneur': '📚💼 Emprendedor Académico',
        'balanced': '🎲 Vida Equilibrada'
    };
    return pathNames[pathType] || pathType;
}

function showCombinedPathBenefits(pathType) {
    const benefits = {
        'nomad': "💼🌴 Como Nómada Digital: Trabajas mientras viajas. Las casillas de ocio también generan dinero. ¡Pero cuidado con la conexión inestable!",
        'traveler': "📚🌴 Como Estudiante Viajero: Aprendes el doble en trivias y tu salud se regenera. ¡Pero es un estilo de vida caro!",
        'entrepreneur': "📚💼 Como Emprendedor Académico: Tu conocimiento genera dinero. ¡Pero el estrés es intenso!",
        'balanced': "🎲 Vida Equilibrada: Acceso a todos los beneficios, pero es más difícil especializarte."
    };
    addMessage(benefits[pathType]);
}

function applyDeteriorationEffects() {
    
    deteriorationCounters.salud++;
    deteriorationCounters.dinero++;
    deteriorationCounters.ocio++;
    
    if (deteriorationCounters.salud >= 4) {
        player.salud -= 3;
        showEffectPopup("-3 ❤️ (desgaste)", false);
        deteriorationCounters.salud = 0;
    }
    
  
    if (deteriorationCounters.dinero >= 3) {
        player.dinero -= 8;
        showEffectPopup("-8 💰 (gastos)", false);
        deteriorationCounters.dinero = 0;
    }
    
    
    if (deteriorationCounters.ocio >= 3) {
        player.ocio -= 5;
        showEffectPopup("-5 🎉 (rutina)", false);
        deteriorationCounters.ocio = 0;
    }
    
    
    if (player.combinedPath === 'entrepreneur') {
        if (turnCounter % 8 === 0) {
            player.salud -= 5;
            showEffectPopup("-5 ❤️ (estrés extremo)", false);
        }
    } else if (player.combinedPath === 'traveler') {
        if (turnCounter % 5 === 0) {
            player.dinero -= 10;
            showEffectPopup("-10 💰 (vida cara)", false);
        }
    }
    

    if (turnCounter > 50) {
        if (turnCounter % 6 === 0) {
            player.salud -= 2;
            showEffectPopup("-2 ❤️ (envejecimiento)", false);
        }
        if (turnCounter % 7 === 0) {
            player.dinero -= 12;
            showEffectPopup("-12 💰 (gastos médicos)", false);
        }
    }
    
    
    if (turnCounter >= 75 && turnCounter <= 100 && turnCounter % 10 === 0) {
        const crisisMedioVida = [
            { effect: { salud: -15, dinero: -50 }, message: "Crisis de mediana edad" },
            { effect: { ocio: -20, salud: -10 }, message: "Agotamiento laboral" },
            { effect: { dinero: -100, pension: -25 }, message: "Crisis financiera personal" }
        ];
        const crisis = crisisMedioVida[Math.floor(Math.random() * crisisMedioVida.length)];
        applyEffect(crisis.effect);
        addMessage(`⚠️ CRISIS: ${crisis.message}`);
        showEffectPopup(`${formatCost(crisis.effect)} (crisis mediana edad)`, false);
    }
    
   
    if (player.combinedPath === 'nomad') {
        // Inestabilidad del nómada
        if (turnCounter % 12 === 0) {
            player.salud -= 8;
            player.ocio -= 10;
            showEffectPopup("-8 ❤️ -10 🎉 (vida inestable)", false);
        }
    } else if (player.combinedPath === 'balanced') {
        
        if (turnCounter % 15 === 0) {
            player.dinero -= 15;
            player.knowledge -= 5;
            showEffectPopup("-15 💰 -5 🧠 (mediocridad)", false);
        }
    }
    
    
    if (player.combinedPath === 'nomad') {
        
        if (turnCounter % 10 === 0) {
            player.salud -= 12;
            player.dinero -= 25;
            showEffectPopup("-12 ❤️ -25 💰 (vida nómada inestable)", false);
            addMessage("🌍 La vida nómada cobra su precio...");
        }
    } else if (player.combinedPath === 'traveler') {
        
        if (turnCounter % 4 === 0) {
            player.dinero -= 15;
            showEffectPopup("-15 💰 (gastos de viaje)", false);
            addMessage("✈️ Los viajes son caros...");
        }
    } else if (player.combinedPath === 'entrepreneur') {
        
        if (turnCounter % 6 === 0) {
            player.salud -= 8;
            player.ocio -= 12;
            showEffectPopup("-8 ❤️ -12 🎉 (estrés emprendedor)", false);
            addMessage("💼 El emprendimiento no perdona...");
        }
    } else if (player.combinedPath === 'balanced') {
        
        if (turnCounter % 18 === 0) {
            player.dinero -= 20;
            player.knowledge -= 8;
            showEffectPopup("-20 💰 -8 🧠 (estancamiento)", false);
            addMessage("⚖️ La mediocridad tiene su costo...");
        }
    }
}

function updateAgeUI() {
    
    player.age = 20 + Math.floor(player.currentPositionIndex / 10);
    
    
    updateAvatarByAge();
    
   
    if (player.currentPositionIndex % 50 === 0 && player.currentPositionIndex > 0) {
        addMessage(`🎂 ¡Feliz cumpleaños! Ahora tienes ${player.age} años.`);
        checkAgeGoals();
    }
}

function updateAvatarByAge() {
    const playerAvatarEl = document.getElementById('playerAvatar');
    if (!playerAvatarEl) return;
    
    const ageAvatars = {
        20: ['👦', '👧'],
        30: ['👨', '👩'],
        40: ['👨‍💼', '👩‍💼'],
        50: ['🧔', '👩‍🦳'],
        60: ['👴', '👵']
    };
    
    let ageKey = Math.floor(player.age / 10) * 10;
    if (ageKey > 60) ageKey = 60;
    
    
    let emotionalState = 0; 
    if (player.salud < 30) emotionalState = 3;
    else if (player.dinero < 100) emotionalState = 2;
    else if (player.salud > 70 && player.dinero > 500 && player.ocio > 40) emotionalState = 1;
    
  
    if (emotionalState === 3) {
        playerAvatarEl.textContent = '🤒';
    } else if (emotionalState === 2) {
        playerAvatarEl.textContent = '😰';
    } else if (emotionalState === 1) {
        playerAvatarEl.textContent = '😊';
    } else {
        const avatars = ageAvatars[ageKey];
        playerAvatarEl.textContent = avatars[0]; 
    }
}

function checkAgeGoals() {
    const ageGoals = {
        30: { 
            dinero: 500, 
            mensaje: "A los 30 DEBES tener al menos $500 ahorrados",
            penalty: { salud: -30, ocio: -25, dinero: -100 }
        },
        40: { 
            pension: 100, 
            mensaje: "A los 40 DEBES tener al menos 100 en tu pensión",
            penalty: { salud: -25, dinero: -150, knowledge: -10 }
        },
        50: { 
            knowledge: 50, 
            mensaje: "A los 50 DEBES tener conocimiento de al menos 50",
            penalty: { salud: -20, dinero: -200, ocio: -30 }
        },
        60: { 
            pension: 300, 
            mensaje: "A los 60 DEBES tener al menos 300 en tu pensión",
            penalty: { salud: -40, dinero: -300, ocio: -40 }
        }
    };
    
    const goal = ageGoals[player.age];
    if (goal) {
        let passed = true;
        if (goal.dinero && player.dinero < goal.dinero) passed = false;
        if (goal.pension && player.pension < goal.pension) passed = false;
        if (goal.knowledge && player.knowledge < goal.knowledge) passed = false;
        
        if (!passed) {
            
            applyEffect(goal.penalty);
            addMessage(`🚨 META NO CUMPLIDA: ${goal.mensaje}`);
            addMessage(`💥 PENALIZACIÓN SEVERA: ${formatCost(goal.penalty)}`);
            showEffectPopup(`${formatCost(goal.penalty)} (meta no cumplida)`, false);
            showAlertDialog("🚨 META OBLIGATORIA FALLIDA", 
                `${goal.mensaje}\n\nPENALIZACIÓN: ${formatCost(goal.penalty)}\n\n¡Las consecuencias son inevitables!`);
            reproducirMusica('musicEventNegative');
            setTimeout(() => reproducirMusica('musicCamino'), 4000);
        } else {
            addMessage(`✅ ¡EXCELENTE! Cumpliste la meta obligatoria de los ${player.age} años.`);

            const bonus = { dinero: 50, salud: 10, ocio: 15, knowledge: 5 };
            applyEffect(bonus);
            addMessage(`🎁 BONUS: ${formatCost(bonus)}`);
            desbloquearLogro(`Meta ${player.age}`, "🎯");
            reproducirMusica('musicEventPositive');
        }
    }
}

function showEffectPopup(text, isPositive = true) {
    const popup = document.createElement('div');
    popup.className = `effect-popup ${isPositive ? 'positive' : 'negative'}`;
    popup.textContent = text;
    
   
    const statsPanel = document.querySelector('.stats-panel');
    if (statsPanel) {
        const rect = statsPanel.getBoundingClientRect();
        popup.style.position = 'fixed';
        popup.style.left = `${rect.left + rect.width / 2}px`;
        popup.style.top = `${rect.top + 50}px`;
        popup.style.transform = 'translate(-50%, 0)';
    }
    
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1500);
}

function triggerSurpriseEvent() {
    const surpriseEvents = [
        {
            title: "¡Emergencia Médica!",
            message: "Un familiar necesita ayuda urgente.",
            effect: { dinero: -100, salud: -20 },
            sound: 'negative'
        },
        {
            title: "¡Robo de Identidad!",
            message: "Debes resolver este problema inmediatamente.",
            effect: { dinero: -50, knowledge: -10 },
            skipTurns: 1,
            sound: 'negative'
        },
        {
            title: "¡Despido Sorpresa!",
            message: "La empresa hace recortes. Sin ingresos por un tiempo.",
            effect: { dinero: -150, ocio: -30 },
            sound: 'negative'
        },
        {
            title: "¡Herencia Inesperada!",
            message: "Un pariente lejano te dejó algo.",
            effect: { dinero: 200, pension: 50 },
            sound: 'positive'
        },
        {
            title: "¡Pandemia!",
            message: "Todo se paraliza. Debes adaptarte.",
            effect: { salud: -30, ocio: -20, dinero: -100 },
            sound: 'negative'
        }
    ];
    
    const event = surpriseEvents[Math.floor(Math.random() * surpriseEvents.length)];
    
    showAlertDialog(event.title, event.message);
    applyEffect(event.effect);
    addMessage(`⚡ EVENTO SORPRESA: ${event.title}`);
    
    if (event.sound === 'positive') {
        reproducirMusica('musicEventPositive');
    } else {
        reproducirMusica('musicEventNegative');
    }
    
    if (event.skipTurns) {
        addMessage(`⏳ Pierdes ${event.skipTurns} turno(s) resolviendo el problema.`);
        
    }
    
    updateStatsUI();
    reproducirMusica('musicCamino');
}

function triggerObligatoryEvent() {
    const obligatoryEvents = [
        {
            title: "🚨 ¡EMERGENCIA MÉDICA!",
            message: "Un familiar necesita cirugía urgente. No puedes negarte.",
            choices: [
                { text: "Pagar todo", effect: { dinero: -200, salud: 10 }, description: "Ayudar completamente" },
                { text: "Pagar parcial", effect: { dinero: -100, salud: -10, ocio: -15 }, description: "Ayuda limitada + culpa" },
                { text: "No puedo pagar", effect: { salud: -30, ocio: -25 }, description: "Estrés extremo por impotencia" }
            ],
            sound: 'negative'
        },
        {
            title: "🚨 ¡ROBO DE IDENTIDAD!",
            message: "Han clonado tus tarjetas. Debes resolver esto YA.",
            effect: { dinero: -80, knowledge: -5 },
            skipTurns: 1,
            sound: 'negative',
            obligatory: true
        },
        {
            title: "🚨 ¡DESPIDO SORPRESA!",
            message: "Recortes masivos. No hay excepciones.",
            effect: { dinero: -150, salud: -20, ocio: -30 },
            workBlock: 3, 
            sound: 'negative',
            obligatory: true
        },
        {
            title: "🚨 ¡CRISIS FAMILIAR!",
            message: "Conflicto grave que requiere tu intervención inmediata.",
            choices: [
                { text: "Tomar tiempo libre", effect: { dinero: -50, ocio: -20, salud: -5 }, description: "Resolver personalmente" },
                { text: "Pagar mediador", effect: { dinero: -120, ocio: 10 }, description: "Solución profesional" },
                { text: "Ignorar problema", effect: { salud: -40, ocio: -35 }, description: "Estrés a largo plazo" }
            ],
            sound: 'negative'
        },
        {
            title: "🚨 ¡ACCIDENTE VEHICULAR!",
            message: "Choque inesperado. Gastos médicos y reparaciones obligatorias.",
            effect: { dinero: -180, salud: -25, ocio: -10 },
            sound: 'negative',
            obligatory: true
        }
    ];
    
    const event = obligatoryEvents[Math.floor(Math.random() * obligatoryEvents.length)];
    
    addMessage(`🚨 EVENTO OBLIGATORIO: ${event.title}`);
    
    if (event.choices) {
        
        reproducirMusica('musicEventNegative');
        setTimeout(() => {
            showDecisionModal({
                name: event.title,
                details: event.message,
                choices: event.choices
            });
        }, 1000);
    } else {
        
        showAlertDialog(event.title, event.message);
        applyEffect(event.effect);
        addMessage(`⚡ IMPACTO: ${formatCost(event.effect)}`);
        
        if (event.skipTurns) {
            addMessage(`⏳ Pierdes ${event.skipTurns} turno(s) resolviendo el problema.`);
            
        }
        
        if (event.workBlock) {
            player.workBlocked = event.workBlock;
            addMessage(`💼 Sin ingresos laborales por ${event.workBlock} turnos.`);
        }
    }
    
    reproducirMusica('musicEventNegative');
    setTimeout(() => reproducirMusica('musicCamino'), 3000);
    updateStatsUI();
}

function calculateFinalScore() {
    let score = player.dinero + player.pension + (player.salud * 10) + (player.ocio * 5) + (player.knowledge * 8);
    let ranking = "Novato", rankingColor = "#6b7280";
    if (score >= 4500) { ranking = "Leyenda de Vida"; rankingColor = "#facc15"; }
    else if (score >= 3000) { ranking = "Maestro del Destino"; rankingColor = "#4ade80"; }
    else if (score >= 1500) { ranking = "Constructor de Futuro"; rankingColor = "#60a5fa"; }
    else if (score >= 500) { ranking = "Aprendiz de la Vida"; rankingColor = "#f59e0b"; }
    return { score, ranking, rankingColor };
}

function showEndScreen() {
    if (!endScreenEl || !finalSummaryEl) return;
    cambiarPantalla(gameContainerEl, endScreenEl);
    const { score, ranking, rankingColor } = calculateFinalScore();
    finalSummaryEl.innerHTML = `
        <h2 class="text-3xl font-bold text-green-600 mb-4">¡Felicidades, terminaste!</h2>
        <div class="end-screen-content">
            <h3 class="text-2xl font-bold text-white mb-2">Tu Resumen Final</h3>
            <p class="text-xl mb-2">Puntuación: <span class="font-bold text-yellow-400">${score.toLocaleString()}</span></p>
            <p class="text-xl mb-4">Ranking: <span class="font-bold" style="color:${rankingColor};">${ranking}</span></p>
            <div class="stats-summary grid grid-cols-2 gap-4 text-left text-gray-300">
                <p>💰 Dinero: ${player.dinero.toLocaleString()}</p>
                <p>❤️ Salud: ${player.salud}</p>
                <p>🎉 Ocio: ${player.ocio}</p>
                <p>🧠 Conocimiento: ${player.knowledge}</p>
                <p>🏦 Pensión: ${player.pension.toLocaleString()}</p>
            </div>
        </div>
    `;
    mostrarLineaDeTiempo();
    lanzarConfetiGanador(200, { y: 0.8 });
}

function mostrarLineaDeTiempo() {
    if (!timelineEl) return;
    timelineEl.innerHTML = "";
    if (historialDecisiones.length === 0) {
        timelineEl.textContent = "No se registraron decisiones importantes.";
        return;
    }
    historialDecisiones.forEach((d, i) => {
        const div = document.createElement("div");
        div.className = "border-l-4 border-blue-500 pl-2 mb-2";
        div.textContent = `${i + 1}. ${d}`;
        timelineEl.appendChild(div);
    });
}

function endGame(message) {
    gameState = 'gameOver';
    isMovingPhase = false;
    movementPointsRemaining = 0;
    if (rollDiceButton) rollDiceButton.disabled = true;
    if (endTurnButton) endTurnButton.classList.add('hidden');
    document.querySelectorAll('.grid-square.reachable-square').forEach(sq => sq.removeEventListener('click', handleMoveClick));
    showAlertDialog('Fin del Juego', message);
    setTimeout(() => showEndScreen(), 2000);
    reproducirMusica('musicFinal');
}

// Theme functions
function setTheme(themeName) {
    document.body.className = `theme-${themeName}`;
    currentVisualTheme = themeName;
    
    if (gameBoardEl.childElementCount > 0) {
        renderBoard();
        if(isMovingPhase) {
            highlightAvailableMoves();
        }
    }
}

function aplicarModoAutomatico() {
    const hora = new Date().getHours();
    setTheme((hora >= 18 || hora < 6) ? 'dark' : 'default');
}

// Visual effects
function lanzarConfetiGanador(particleCount = 150, options = {}) {
    if (typeof confetti === 'function') {
        confetti({ particleCount, spread: 100, origin: { y: 0.6 }, colors: ['#facc15', '#4ade80', '#60a5fa'], ...options });
    }
}

function mostrarMenu() {
    cambiarPantalla(document.getElementById('instructionsScreen'), startScreenEl);
    setTimeout(() => {
        if (startContentEl) {
            startContentEl.classList.add('animate-in');
        }
    }, 100);
}

function selectCombinedPath(pathType, initialEffect, buttonId) {
    document.querySelectorAll('.start-button').forEach(btn => btn.classList.remove('selected-path'));
    document.getElementById(buttonId)?.classList.add('selected-path');
    selectedStartPathButtonId = buttonId;
    selectedPathType = 'combined';
    combinedPathType = pathType;
    startGameTransition(pathType, initialEffect);
}

function showInvestmentModal() {
    const investmentModal = document.getElementById('investmentModal');
    const availableMoney = document.getElementById('availableMoney');
    const currentCredit = document.getElementById('currentCredit');
    const currentDebt = document.getElementById('currentDebt');
    
    if (!investmentModal) return;
    
    // Actualizar información financiera
    if (availableMoney) availableMoney.textContent = player.dinero.toLocaleString();
    if (currentCredit) currentCredit.textContent = player.creditRating;
    if (currentDebt) currentDebt.textContent = player.debt.toLocaleString();
    
    // Mostrar modal
    investmentModal.classList.remove('hidden');
    if (customOverlay) customOverlay.classList.add('show');
    document.body.classList.add('modal-open');
    
    addMessage("💼 Has llegado a un Centro de Inversiones. ¡Oportunidad de hacer crecer tu dinero!");
}

function closeInvestmentModal() {
    const investmentModal = document.getElementById('investmentModal');
    if (!investmentModal) return;
    
    investmentModal.classList.add('hidden');
    if (customOverlay) customOverlay.classList.remove('show');
    document.body.classList.remove('modal-open');
    
    // Continuar el juego
    reproducirMusica('musicCamino');
    if (isMovingPhase) highlightAvailableMoves();
}

function chooseInvestment(type) {
    const investmentRequirements = {
        stocks: { 
            min: 100, 
            durationMin: 3, 
            durationMax: 4, 
            name: '📈 Acciones',
            riskLevel: 'medio'
        },
        realEstate: { 
            min: 300, 
            durationMin: 5, 
            durationMax: 7, 
            name: '🏠 Bienes Raíces',
            riskLevel: 'bajo'
        },
        crypto: { 
            min: 50, 
            durationMin: 2, 
            durationMax: 3, 
            name: '₿ Criptomonedas',
            riskLevel: 'alto'
        },
        business: { 
            min: 500, 
            durationMin: 4, 
            durationMax: 6, 
            name: '🏪 Negocio Propio',
            riskLevel: 'alto'
        }
    };
    
    const investment = investmentRequirements[type];
    if (!investment) return;
    
    // Verificar si el jugador tiene dinero suficiente
    if (player.dinero < investment.min) {
        showAlertDialog('Fondos Insuficientes', 
            `💸 Necesitas al menos $${investment.min} para invertir en ${investment.name}.`);
        return;
    }
    
    // Verificar credit rating para ciertas inversiones
    if ((type === 'realEstate' || type === 'business') && player.creditRating < 50) {
        showAlertDialog('Credit Rating Bajo', 
            `📊 Tu credit rating (${player.creditRating}) es muy bajo para ${investment.name}. Necesitas al menos 50.`);
        return;
    }
    
    // Verificar si ya tiene una inversión del mismo tipo activa
    if (player.investments[type].amount > 0) {
        showAlertDialog('Inversión Activa', 
            `📈 Ya tienes una inversión activa en ${investment.name}. Espera a que madure.`);
        return;
    }
    
    // Solicitar cantidad a invertir
    promptInvestmentAmount(type, investment);
}

function promptInvestmentAmount(type, investment) {
    const maxInvestment = Math.min(player.dinero, player.dinero * 0.8);
    
    showInvestmentAmountDialog(
        `💰 ${investment.name}`,
        `¿Cuánto quieres invertir?\n\nMínimo: $${investment.min}\nDisponible: $${player.dinero.toLocaleString()}\nRecomendado: Máximo $${Math.floor(maxInvestment).toLocaleString()}`,
        investment.min,
        maxInvestment,
        (amount) => {
            if (amount && amount >= investment.min && amount <= player.dinero) {
                executeInvestment(type, investment, amount);
            } else if (amount) {
                showAlertDialog('Cantidad Inválida', 
                    `💸 La cantidad debe estar entre $${investment.min} y $${player.dinero}.`);
            }
        }
    );
}

function executeInvestment(type, investment, amount) {
    player.dinero -= amount;
    const duration = investment.durationMin + Math.floor(Math.random() * (investment.durationMax - investment.durationMin + 1));
    const expectedReturn = calculateInvestmentReturn(type, amount, {});
    player.investments[type] = {
        amount: amount,
        maturityTurn: turnCounter + duration,
        expectedReturn: expectedReturn
    };
    
    player.totalInvestments += amount;
    
    addMessage(`📈 INVERSIÓN REALIZADA: ${investment.name}`);
    addMessage(`💰 Invertido: $${amount.toLocaleString()}`);
    addMessage(`⏰ Madura en ${duration} turnos (${investment.durationMin}-${investment.durationMax} turnos)`);
    addMessage(`📊 Retorno esperado: $${expectedReturn.toLocaleString()}`);
        
    showEffectPopup(`-${amount} 💰 (inversión)`, false);
    
    
    if (amount >= 200) {
        player.creditRating = Math.min(100, player.creditRating + 2);
        addMessage(`📊 Credit Rating +2 por inversión responsable`);
    }
    
    updateStatsUI();
    closeInvestmentModal();
    reproducirMusica('musicEventPositive');
    setTimeout(() => reproducirMusica('musicCamino'), 2000);
    
    registrarDecision(`Inversión: ${investment.name} - $${amount} por ${duration} turnos`);
}

function showInvestmentAmountDialog(title, message, min, max, callback) {
    const modal = document.createElement('div');
    modal.className = 'message-box-custom';
    modal.innerHTML = `
        <h3>${title}</h3>
        <p style="white-space: pre-line;">${message}</p>
        <input type="number" id="investmentAmountInput" 
               min="${min}" max="${Math.floor(max)}" 
               placeholder="Cantidad a invertir..."
               style="width: 80%; padding: 10px; margin: 15px 0; border: 2px solid #667eea; border-radius: 8px; font-size: 1.1rem; text-align: center;">
        <div class="actions">
            <button class="confirm-btn" id="investConfirmBtn">Invertir</button>
            <button class="cancel-btn" id="investCancelBtn">Cancelar</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    customOverlay.classList.add('show');
    modal.classList.add('show');
    
    const input = modal.querySelector('#investmentAmountInput');
    const confirmBtn = modal.querySelector('#investConfirmBtn');
    const cancelBtn = modal.querySelector('#investCancelBtn');
    
    setTimeout(() => input.focus(), 100);
    
    const handleConfirm = () => {
        const amount = parseInt(input.value);
        cleanup();
        callback(amount);
    };
    
    const handleCancel = () => {
        cleanup();
        callback(null);
    };
    
    const cleanup = () => {
        modal.remove();
        customOverlay.classList.remove('show');
    };
    
    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleConfirm();
        if (e.key === 'Escape') handleCancel();
    });
}

function volverAOISS() {
    window.location.href = 'oficina.html';
}

window.volverAOISS = volverAOISS;
window.mostrarMenu = mostrarMenu;
window.selectStartPath = selectStartPath;
window.selectCombinedPath = selectCombinedPath;
window.startGameTransition = startGameTransition;
window.loadGameLogic = loadGameLogic;
window.chooseInvestment = chooseInvestment;
window.closeInvestmentModal = closeInvestmentModal;
window.onload = async function() {
    await loadTriviaBank();
    initAudio(); 
    
    initializeGameBoard();
    renderCharacterSelector();
    setupMainButtonListeners();
    if (dice3dElement) dice3dElement.style.transform = 'rotateX(0deg) rotateY(0deg)';
    if (typeof tsParticles !== 'undefined') {
        tsParticles.load("particles-js", {
            background: { color: "#1a202c" },
            particles: { number: { value: 50 }, color: { value: "#ffffff" }, size: { value: 2 }, move: { speed: 0.5 }, opacity: { value: 0.5 } }
        });
    }
    aplicarModoAutomatico();

    
    console.log(`🎯 ¡Bienvenido a Caminos de Vida V${GAME_CONFIG.GAME_VERSION}!`);
};


// Hacer el dado draggable y clickeable para girar
(function() {
    const diceContainer = document.querySelector('.dice-container');
    const dice3d = document.getElementById('dice3d');
    if (!diceContainer || !dice3d) return;
    
    let isDragging = false;
    let startX, startY;
    let offsetX = 0, offsetY = 0;

    diceContainer.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX - offsetX;
        startY = e.clientY - offsetY;
        diceContainer.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;
        
        diceContainer.style.left = 'auto';
        diceContainer.style.right = 'auto';
        diceContainer.style.bottom = 'auto';
        diceContainer.style.top = 'auto';
        diceContainer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });

    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            diceContainer.style.cursor = 'grab';
        }
    });

    // Click en el dado para lanzarlo - solo si no hay puntos de movimiento pendientes
    dice3d.addEventListener('click', function(e) {
        if (!isDragging && typeof rollDice === 'function' && typeof movementPointsRemaining !== 'undefined') {
            if (movementPointsRemaining > 0) {
                // Si aún hay puntos de movimiento, mostrar mensaje
                if (typeof addMessage === 'function') {
                    addMessage(`⚠️ Debes terminar de moverte primero. Te quedan ${movementPointsRemaining} puntos.`);
                }
                // Hacer que el dado "tiemble" para indicar que no se puede usar
                dice3d.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    dice3d.style.animation = '';
                }, 500);
            } else {
                // Si no hay puntos pendientes, lanzar el dado
                rollDice();
            }
        }
    });
    
    dice3d.style.cursor = 'pointer';
    
    // Agregar animación de shake
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: rotateX(-20deg) rotateY(20deg) translateX(0); }
            25% { transform: rotateX(-20deg) rotateY(20deg) translateX(-5px); }
            75% { transform: rotateX(-20deg) rotateY(20deg) translateX(5px); }
        }
    `;
    document.head.appendChild(style);
})();
