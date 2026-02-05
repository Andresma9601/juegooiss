let triviaQuestions = [];

// Estado del Juego
let gameBoard = [];
let currentPlayer = 'white';
let selectedSquare = null;
let gameOver = false;
let moveHistory = [];
let capturedPieces = { white: [], black: [] };

// Modo de Juego
let gameMode = 'twoPlayers';
let aiDifficulty = 'medium';
let isAIThinking = false;

// --- BANCO DE RESPALDO DE TRIVIA ---
const FALLBACK_TRIVIA_BANK = [
    {
        "question": "¿Qué es la Seguridad Social?",
        "options": [
            "Una protección garantizada por el Estado para cubrir riesgos como enfermedad, vejez, desempleo, entre otros.",
            "Un subsidio temporal que solo se da en casos de accidentes.",
            "Un sistema de ahorro privado.",
            "Una ONG que da ayuda a los pobres."
        ],
        "answer": 0
    },
    {
        "question": "¿Cuál es el principal objetivo de la Seguridad Social?",
        "options": [
            "Proteger a las personas ante situaciones que afecten su ingreso o su salud.",
            "Recaudar impuestos para construir carreteras.",
            "Facilitar la importación de medicamentos.",
            "Promover la libre competencia entre hospitales."
        ],
        "answer": 0
    },
    {
        "question": "¿Quiénes deben estar cubiertos por la Seguridad Social?",
        "options": [
            "Toda la población, especialmente trabajadores y sus familias.",
            "Solo empleados públicos y militares.",
            "Sólo los mayores de 65 años.",
            "Exclusivamente los extranjeros residentes."
        ],
        "answer": 0
    },
    {
        "question": "¿Qué beneficios ofrece un sistema de Seguridad Social?",
        "options": [
            "Pensiones, servicios de salud, licencias por maternidad/paternidad, subsidios por desempleo.",
            "Tarjetas de crédito, viajes y rifas para empleados públicos.",
            "Acceso a clubes sociales y deportivos del Estado.",
            "Becas universitarias en el extranjero."
        ],
        "answer": 0
    },
    {
        "question": "¿Quiénes aportan para asegurar el acceso a los servicios de la Seguridad Social?",
        "options": [
            "El trabajador, el empleador y el Estado.",
            "El Estado lo asume todo.",
            "Solo las empresas privadas.",
            "Exclusivamente los ciudadanos extranjeros."
        ],
        "answer": 0
    },
    {
        "question": "¿Qué es una contingencia en Seguridad Social?",
        "options": [
            "Un evento inesperado que afecta la capacidad de generar ingresos o la salud (ej. enfermedad, accidente, vejez).",
            "Un día feriado en el calendario.",
            "Un beneficio adicional por buen comportamiento.",
            "Un tipo de impuesto sobre la propiedad."
        ],
        "answer": 0
    },
    {
        "question": "¿Qué es la afiliación a la Seguridad Social?",
        "options": [
            "El registro formal de una persona en el sistema para acceder a sus beneficios.",
            "Un proceso para obtener la ciudadanía de otro país.",
            "La suscripción a una revista de salud.",
            "La inscripción a un gimnasio."
        ],
        "answer": 0
    },
    {
        "question": "¿Qué es el Régimen Contributivo?",
        "options": [
            "Aquel en el que los beneficiarios realizan aportes económicos periódicos.",
            "Un sistema de salud gratuito para todos sin importar sus ingresos.",
            "Un tipo de seguro para vehículos.",
            "Un programa de becas universitarias."
        ],
        "answer": 0
    },
    {
        "question": "¿Qué es el Régimen Subsidiado?",
        "options": [
            "Destinado a personas sin capacidad de pago, cuyos aportes son financiados total o parcialmente por el Estado.",
            "Un sistema de ahorro obligatorio para todos los ciudadanos.",
            "Un beneficio exclusivo para empleados de grandes empresas.",
            "Un seguro de viaje internacional."
        ],
        "answer": 0
    },
    {
        "question": "¿Qué es una EPS (Entidad Promotora de Salud) o similar?",
        "options": [
            "Entidad encargada de la afiliación y prestación de servicios de salud.",
            "Una empresa de construcción de hospitales.",
            "Un centro de investigación científica.",
            "Una organización que promueve el turismo."
        ],
        "answer": 0
    }
];

// --- CONSTANTES DEL JUEGO ---

const pieces = {
    white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
    black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
};

const pieceValues = {
    pawn: 100, knight: 320, bishop: 330, rook: 500, queen: 900, king: 20000
};

const pieceSquareTables = {
    pawn: [[0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]],
    knight: [[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],[-30,0,10,15,15,10,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],[-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]],
    bishop: [[-20,-10,-10,-10,-10,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,10,10,5,0,-10],[-10,5,5,10,10,5,5,-10],[-10,0,10,10,10,10,0,-10],[-10,10,10,10,10,10,10,-10],[-10,5,0,0,0,0,5,-10],[-20,-10,-10,-10,-10,-10,-10,-20]],
    rook: [[0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0]],
    queen: [[-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,5,5,5,0,-10],[-5,0,5,5,5,5,0,-5],[0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],[-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]],
    king: [[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-20,-30,-30,-40,-40,-30,-30,-20],[-10,-20,-20,-20,-20,-20,-20,-10],[20,20,0,0,0,0,20,20],[20,30,10,0,0,10,30,20]]
};

const initialBoardSetup = [
    ['rook','knight','bishop','queen','king','bishop','knight','rook'],['pawn','pawn','pawn','pawn','pawn','pawn','pawn','pawn'],
    [null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],
    ['pawn','pawn','pawn','pawn','pawn','pawn','pawn','pawn'],['rook','knight','bishop','queen','king','bishop','knight','rook']
];

// --- FUNCIÓN DE CARGA DE TRIVIA ---
async function loadTriviaBank() {
    try {
        const response = await fetch('../data/preguntas_trivia.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        triviaQuestions = data;
        console.log('✅ ÉXITO! Se cargaron', triviaQuestions.length, 'preguntas desde preguntas_trivia.json');
        return true;
    } catch (error) {
        console.warn('⚠️ No se pudo cargar "preguntas_trivia.json". Usando banco de respaldo.', error);
        triviaQuestions = FALLBACK_TRIVIA_BANK;
        console.log('ADVERTENCIA: Se está usando el banco de preguntas de respaldo interno.');
        return false;
    }
}

// --- INICIALIZACIÓN ---

document.addEventListener('DOMContentLoaded', async () => {
    // Cargar banco de trivia
    await loadTriviaBank();
});

// --- FLUJO PRINCIPAL DEL JUEGO ---

function selectMode(mode) {
    if (mode === 'twoPlayers') { 
        gameMode = 'twoPlayers'; 
        startGame(); 
    } else if (mode === 'vsAI') { 
        gameMode = 'vsAI'; 
        document.getElementById('difficultySelection').style.display = 'block'; 
    }
}

function startGame(difficulty = 'medium') {
    if (gameMode === 'vsAI') { aiDifficulty = difficulty; }
    document.getElementById('modeSelectionModal').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'flex';
    initGame();
}

function changeGameMode() {
    document.getElementById('modeSelectionModal').style.display = 'flex';
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('difficultySelection').style.display = 'none';
}

function initGame() {
    gameBoard = []; 
    currentPlayer = 'white'; 
    selectedSquare = null; 
    gameOver = false;
    moveHistory = []; 
    capturedPieces = { white: [], black: [] }; 
    isAIThinking = false;
    
    for (let r = 0; r < 8; r++) {
        gameBoard[r] = [];
        for (let c = 0; c < 8; c++) {
            const setup = initialBoardSetup[r][c];
            if (setup) {
                const color = r > 3 ? 'white' : 'black';
                gameBoard[r][c] = { type: setup, color: color, hasMoved: false };
            } else { 
                gameBoard[r][c] = null; 
            }
        }
    }
    
    const modeText = gameMode === 'twoPlayers' ? '👥 2 Jugadores' : `🤖 vs IA (${aiDifficulty})`;
    document.getElementById('gameModeDisplay').textContent = `Modo: ${modeText}`;
    renderBoard(); 
    updateAllUI();
}

function handleSquareClick(row, col) {
    if (gameOver || isAIThinking || (gameMode === 'vsAI' && currentPlayer === 'black')) return;
    
    const clickedPiece = gameBoard[row][col];
    
    if (selectedSquare) {
        const possibleMoves = getValidMoves(selectedSquare.row, selectedSquare.col);
        if (possibleMoves.some(move => move.row === row && move.col === col)) {
            const hasPromotion = makeMove(selectedSquare.row, selectedSquare.col, row, col);
            if (!hasPromotion) {
                processTurn();
            }
        } else if (clickedPiece && clickedPiece.color === currentPlayer) {
            selectPiece(row, col);
        } else {
            selectedSquare = null; 
            clearHighlights();
        }
    } else if (clickedPiece && clickedPiece.color === currentPlayer) {
        selectPiece(row, col);
    }
}

function selectPiece(row, col) {
    selectedSquare = { row, col };
    clearHighlights();
    highlightSquare(row, col, 'selected');
    const possibleMoves = getValidMoves(row, col);
    possibleMoves.forEach(move => {
        highlightSquare(move.row, move.col, gameBoard[move.row][move.col] ? 'attack-move' : 'possible-move');
    });
}

function makeMove(fromRow, fromCol, toRow, toCol) {
    const movingPiece = gameBoard[fromRow][fromCol];
    const targetPiece = gameBoard[toRow][toCol];
    
    if (targetPiece) {
        capturedPieces[movingPiece.color].push(targetPiece);
    }
    
    // Enroque (castling)
    if (movingPiece.type === 'king' && Math.abs(toCol - fromCol) === 2) {
        // Enroque corto (lado del rey)
        if (toCol === 6) {
            const rook = gameBoard[fromRow][7];
            gameBoard[fromRow][5] = rook;
            gameBoard[fromRow][7] = null;
            rook.hasMoved = true;
        }
        // Enroque largo (lado de la reina)
        else if (toCol === 2) {
            const rook = gameBoard[fromRow][0];
            gameBoard[fromRow][3] = rook;
            gameBoard[fromRow][0] = null;
            rook.hasMoved = true;
        }
    }
    
    gameBoard[toRow][toCol] = movingPiece;
    gameBoard[fromRow][fromCol] = null;
    movingPiece.hasMoved = true;
    
    addToMoveHistory(fromRow, fromCol, toRow, toCol, movingPiece, targetPiece);
    selectedSquare = null; 
    clearHighlights();
    
    // Promoción de peón con elección
    if (movingPiece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
        showPromotionModal(toRow, toCol, movingPiece.color);
        return true; // Indica que hay promoción pendiente
    }
    
    return false; // No hay promoción
}

function processTurn() {
    renderBoard(); 
    
    const opponentColor = currentPlayer === 'white' ? 'black' : 'white';
    
    if (isCheckmate(opponentColor)) { 
        endGame(`¡Jaque Mate! Ganan las ${currentPlayer === 'white' ? 'Blancas' : 'Negras'}`); 
        return; 
    }
    
    if (isStalemate(opponentColor)) { 
        endGame("¡Tablas por ahogado!"); 
        return; 
    }
    
    currentPlayer = opponentColor;
    updateAllUI();
    
    // Trivia aleatoria (30% de probabilidad al inicio de cada turno)
    if (Math.random() < 0.3) {
        showRandomTrivia();
        return; // Pausar el juego hasta que se responda
    }
    
    if (gameMode === 'vsAI' && currentPlayer === 'black' && !gameOver) { 
        makeAIMove(); 
    }
}

function endGame(message) {
    gameOver = true; 
    document.getElementById('gameStatus').textContent = message;
    showNotification(message, "warning"); 
    updateAllUI();
}

function getValidMoves(row, col) {
    const piece = gameBoard[row][col];
    if (!piece) return [];
    
    let moves;
    switch (piece.type) {
        case 'pawn': moves = getPawnMoves(row, col, piece.color, piece.hasMoved); break;
        case 'rook': moves = getSlidingMoves(row, col, piece.color, [[0, 1], [0, -1], [1, 0], [-1, 0]]); break;
        case 'knight': moves = getKnightMoves(row, col, piece.color); break;
        case 'bishop': moves = getSlidingMoves(row, col, piece.color, [[1, 1], [1, -1], [-1, 1], [-1, -1]]); break;
        case 'queen': moves = getSlidingMoves(row, col, piece.color, [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]); break;
        case 'king': moves = getKingMoves(row, col, piece.color); break;
        default: moves = [];
    }
    
    // Filtrar movimientos que dejen al rey en jaque
    return moves.filter(move => {
        const tempBoard = JSON.parse(JSON.stringify(gameBoard));
        tempBoard[move.row][move.col] = tempBoard[row][col];
        tempBoard[row][col] = null;
        return !isKingInCheck(piece.color, tempBoard);
    });
}

function getPawnMoves(r, c, color, hasMoved) {
    const moves = []; 
    const dir = color === 'white' ? -1 : 1;
    
    // Avance de una casilla
    if (r + dir >= 0 && r + dir < 8 && !gameBoard[r + dir][c]) moves.push({ row: r + dir, col: c });
    
    // Avance de dos casillas
    if (!hasMoved && r + 2*dir >=0 && r+2*dir < 8 && !gameBoard[r + dir][c] && !gameBoard[r + 2*dir][c]) {
        moves.push({ row: r + 2 * dir, col: c });
    }
    
    // Capturas diagonales
    [-1, 1].forEach(cd => {
        if (c + cd >= 0 && c + cd < 8 && r + dir >=0 && r+dir < 8 && gameBoard[r+dir]?.[c+cd]?.color !== color && gameBoard[r+dir]?.[c+cd]) {
            moves.push({ row: r + dir, col: c + cd });
        }
    });
    
    return moves;
}

function getKnightMoves(r, c, color) {
    const moves = [];
    [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr, dc]) => {
        const newR = r + dr, newC = c + dc;
        if (newR >= 0 && newR < 8 && newC >= 0 && newC < 8 && gameBoard[newR][newC]?.color !== color) {
            moves.push({ row: newR, col: newC });
        }
    });
    return moves;
}

function getKingMoves(r, c, color) {
    const moves = []; 
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const newR = r + dr, newC = c + dc;
            if (newR >= 0 && newR < 8 && newC >= 0 && newC < 8 && gameBoard[newR][newC]?.color !== color) {
                moves.push({ row: newR, col: newC });
            }
        }
    }
    
    // Enroque (castling)
    const king = gameBoard[r][c];
    if (!king.hasMoved && !isKingInCheck(color)) {
        // Enroque corto (lado del rey)
        const rookShort = gameBoard[r][7];
        if (rookShort && rookShort.type === 'rook' && !rookShort.hasMoved) {
            if (!gameBoard[r][5] && !gameBoard[r][6]) {
                // Verificar que el rey no pase por jaque
                if (!isSquareAttacked(r, 5, color === 'white' ? 'black' : 'white') && 
                    !isSquareAttacked(r, 6, color === 'white' ? 'black' : 'white')) {
                    moves.push({ row: r, col: 6 });
                }
            }
        }
        
        // Enroque largo (lado de la reina)
        const rookLong = gameBoard[r][0];
        if (rookLong && rookLong.type === 'rook' && !rookLong.hasMoved) {
            if (!gameBoard[r][1] && !gameBoard[r][2] && !gameBoard[r][3]) {
                // Verificar que el rey no pase por jaque
                if (!isSquareAttacked(r, 2, color === 'white' ? 'black' : 'white') && 
                    !isSquareAttacked(r, 3, color === 'white' ? 'black' : 'white')) {
                    moves.push({ row: r, col: 2 });
                }
            }
        }
    }
    
    return moves;
}

function getSlidingMoves(r, c, color, directions) {
    const moves = [];
    directions.forEach(([dr, dc]) => {
        let newR = r + dr, newC = c + dc;
        while(newR >= 0 && newR < 8 && newC >= 0 && newC < 8) {
            const target = gameBoard[newR][newC];
            if(target) { 
                if (target.color !== color) moves.push({ row: newR, col: newC }); 
                break; 
            }
            moves.push({ row: newR, col: newC });
            newR += dr; newC += dc;
        }
    });
    return moves;
}

function isSquareAttacked(row, col, attackerColor, boardState) {
    const board = boardState || gameBoard;
    
    // Validar que el tablero y la posición sean válidos
    if (!board || row < 0 || row >= 8 || col < 0 || col >= 8) return false;
    
    // Peones
    const pawnDir = attackerColor === 'white' ? 1 : -1;
    const pawnRow = row + pawnDir;
    if (pawnRow >= 0 && pawnRow < 8) {
        if (col - 1 >= 0 && board[pawnRow][col-1]?.type === 'pawn' && board[pawnRow][col-1].color === attackerColor) return true;
        if (col + 1 < 8 && board[pawnRow][col+1]?.type === 'pawn' && board[pawnRow][col+1].color === attackerColor) return true;
    }
    
    // Caballos
    const knightMoves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    for (const [dr, dc] of knightMoves) {
        const r = row + dr, c = col + dc;
        if (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r]?.[c]?.type === 'knight' && board[r][c].color === attackerColor) return true;
    }
    
    // Torres, Alfiles, Reinas
    const slidingDirs = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
    for (let i = 0; i < slidingDirs.length; i++) {
        const [dr, dc] = slidingDirs[i];
        let r = row + dr, c = col + dc;
        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            const piece = board[r]?.[c];
            if (piece) {
                if (piece.color === attackerColor) {
                    if (i < 4 && (piece.type === 'rook' || piece.type === 'queen')) return true;
                    if (i >= 4 && (piece.type === 'bishop' || piece.type === 'queen')) return true;
                } 
                break;
            } 
            r += dr; c += dc;
        }
    }
    
    // Rey
    for (let dr=-1; dr<=1; dr++) {
        for (let dc=-1; dc<=1; dc++) { 
            if (dr===0 && dc===0) continue;
            const r = row + dr, c = col + dc;
            if (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r]?.[c]?.type === 'king' && board[r][c].color === attackerColor) return true;
        }
    }
    
    return false;
}

function isKingInCheck(kingColor, boardState = gameBoard) {
    const kingPos = findKing(kingColor, boardState);
    if (!kingPos) return true;
    return isSquareAttacked(kingPos.row, kingPos.col, kingColor === 'white' ? 'black' : 'white', boardState);
}

function findKing(color, boardState = gameBoard) {
    for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(boardState[r][c]?.type==='king'&&boardState[r][c]?.color===color) return {row:r,col:c};
    return null;
}

function hasAnyValidMoves(color) {
    for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(gameBoard[r][c]?.color===color&&getValidMoves(r,c).length>0) return true;
    return false;
}

function isCheckmate(color) { 
    return isKingInCheck(color) && !hasAnyValidMoves(color); 
}

function isStalemate(color) { 
    return !isKingInCheck(color) && !hasAnyValidMoves(color); 
}

function makeAIMove() {
    isAIThinking = true;
    document.getElementById('aiThinking').classList.add('active');
    
    setTimeout(() => {
        const move = getBestMove();
        if (move) {
            const hasPromotion = makeMove(move.fromRow, move.fromCol, move.toRow, move.toCol);
            // Si la IA promociona, elegir reina automáticamente
            if (hasPromotion) {
                promotePawn('queen');
                return;
            }
        }
        isAIThinking = false;
        document.getElementById('aiThinking').classList.remove('active');
        processTurn();
    }, 500);
}

function getBestMove() {
    const allMoves = getAllPossibleMoves('black');
    if (allMoves.length === 0) return null;
    
    // Nivel Fácil: Movimientos completamente aleatorios
    if (aiDifficulty === 'easy') {
        return allMoves[Math.floor(Math.random() * allMoves.length)];
    }
    
    // Nivel Medio: Evalúa posiciones pero con errores ocasionales (30% de movimientos aleatorios)
    if (aiDifficulty === 'medium') {
        if (Math.random() < 0.3) {
            return allMoves[Math.floor(Math.random() * allMoves.length)];
        }
    }
    
    // Limitar movimientos a evaluar en nivel difícil para evitar trabas
    let movesToEvaluate = allMoves;
    if (aiDifficulty === 'hard' && allMoves.length > 25) {
        // Priorizar capturas y movimientos centrales
        const priorityMoves = allMoves.filter(move => {
            const capturedPiece = gameBoard[move.toRow][move.toCol];
            const isCenter = (move.toRow === 3 || move.toRow === 4) && (move.toCol === 3 || move.toCol === 4);
            return capturedPiece || isCenter;
        });
        
        if (priorityMoves.length > 0) {
            movesToEvaluate = priorityMoves.slice(0, 20);
        } else {
            movesToEvaluate = allMoves.slice(0, 20);
        }
    }
    
    // Nivel Difícil: Buscar 2 movimientos adelante con minimax (solo para movimientos prioritarios)
    const depth = aiDifficulty === 'hard' ? 2 : 1;
    
    let bestScore = -Infinity;
    let bestMoves = [];
    
    for (const move of movesToEvaluate) {
        const tempBoard = JSON.parse(JSON.stringify(gameBoard));
        const capturedPiece = tempBoard[move.toRow][move.toCol];
        tempBoard[move.toRow][move.toCol] = tempBoard[move.fromRow][move.fromCol];
        tempBoard[move.fromRow][move.fromCol] = null;
        if (tempBoard[move.toRow][move.toCol]) {
            tempBoard[move.toRow][move.toCol].hasMoved = true;
        }
        
        let score;
        if (depth > 1 && aiDifficulty === 'hard') {
            // Minimax para nivel difícil (con límite de profundidad)
            score = minimax(tempBoard, 1, -Infinity, Infinity, false); // Reducido a profundidad 1
        } else {
            score = evaluateBoard(tempBoard, 'black');
        }
        
        // Bonificaciones y penalizaciones
        if (capturedPiece) {
            score += pieceValues[capturedPiece.type] * 1.5; // Priorizar capturas
        }
        
        if (isKingInCheck('white', tempBoard)) {
            score += 100; // Gran bonificación por jaque
        }
        
        // Penalizar si la pieza queda en peligro
        const piece = tempBoard[move.toRow][move.toCol];
        if (piece && isSquareAttacked(move.toRow, move.toCol, 'white', tempBoard)) {
            score -= pieceValues[piece.type] * 0.8;
        }
        
        // Bonificar control del centro
        if ((move.toRow === 3 || move.toRow === 4) && (move.toCol === 3 || move.toCol === 4)) {
            score += 20;
        }
        
        if (score > bestScore) { 
            bestScore = score; 
            bestMoves = [move]; 
        } else if (score === bestScore) { 
            bestMoves.push(move); 
        }
    }
    
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

// Algoritmo Minimax con poda alfa-beta
function minimax(board, depth, alpha, beta, isMaximizing) {
    if (depth === 0) {
        return evaluateBoard(board, 'black');
    }
    
    const color = isMaximizing ? 'black' : 'white';
    const moves = getAllPossibleMovesForBoard(board, color);
    
    if (moves.length === 0) {
        // Jaque mate o tablas
        if (isKingInCheckForBoard(color, board)) {
            return isMaximizing ? -10000 : 10000;
        }
        return 0; // Tablas
    }
    
    if (isMaximizing) {
        let maxScore = -Infinity;
        for (const move of moves) {
            const tempBoard = JSON.parse(JSON.stringify(board));
            tempBoard[move.toRow][move.toCol] = tempBoard[move.fromRow][move.fromCol];
            tempBoard[move.fromRow][move.fromCol] = null;
            
            const score = minimax(tempBoard, depth - 1, alpha, beta, false);
            maxScore = Math.max(maxScore, score);
            alpha = Math.max(alpha, score);
            if (beta <= alpha) break; // Poda alfa-beta
        }
        return maxScore;
    } else {
        let minScore = Infinity;
        for (const move of moves) {
            const tempBoard = JSON.parse(JSON.stringify(board));
            tempBoard[move.toRow][move.toCol] = tempBoard[move.fromRow][move.fromCol];
            tempBoard[move.fromRow][move.fromCol] = null;
            
            const score = minimax(tempBoard, depth - 1, alpha, beta, true);
            minScore = Math.min(minScore, score);
            beta = Math.min(beta, score);
            if (beta <= alpha) break; // Poda alfa-beta
        }
        return minScore;
    }
}

function getAllPossibleMovesForBoard(board, color) {
    const moves = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c]?.color === color) {
                const pieceMoves = getValidMovesForBoard(board, r, c);
                pieceMoves.forEach(move => moves.push({fromRow: r, fromCol: c, toRow: move.row, toCol: move.col}));
            }
        }
    }
    return moves;
}

function getValidMovesForBoard(board, row, col) {
    const piece = board[row][col];
    if (!piece) return [];
    
    let moves;
    switch (piece.type) {
        case 'pawn': moves = getPawnMovesForBoard(board, row, col, piece.color, piece.hasMoved); break;
        case 'rook': moves = getSlidingMovesForBoard(board, row, col, piece.color, [[0, 1], [0, -1], [1, 0], [-1, 0]]); break;
        case 'knight': moves = getKnightMovesForBoard(board, row, col, piece.color); break;
        case 'bishop': moves = getSlidingMovesForBoard(board, row, col, piece.color, [[1, 1], [1, -1], [-1, 1], [-1, -1]]); break;
        case 'queen': moves = getSlidingMovesForBoard(board, row, col, piece.color, [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]); break;
        case 'king': moves = getKingMovesForBoard(board, row, col, piece.color); break;
        default: moves = [];
    }
    
    return moves.filter(move => {
        const tempBoard = JSON.parse(JSON.stringify(board));
        tempBoard[move.row][move.col] = tempBoard[row][col];
        tempBoard[row][col] = null;
        return !isKingInCheckForBoard(piece.color, tempBoard);
    });
}

function getPawnMovesForBoard(board, r, c, color, hasMoved) {
    const moves = [];
    const dir = color === 'white' ? -1 : 1;
    
    if (r + dir >= 0 && r + dir < 8 && !board[r + dir][c]) moves.push({ row: r + dir, col: c });
    
    if (!hasMoved && r + 2*dir >= 0 && r + 2*dir < 8 && !board[r + dir][c] && !board[r + 2*dir][c]) {
        moves.push({ row: r + 2 * dir, col: c });
    }
    
    [-1, 1].forEach(cd => {
        if (c + cd >= 0 && c + cd < 8 && r + dir >= 0 && r + dir < 8 && board[r+dir]?.[c+cd]?.color !== color && board[r+dir]?.[c+cd]) {
            moves.push({ row: r + dir, col: c + cd });
        }
    });
    
    return moves;
}

function getKnightMovesForBoard(board, r, c, color) {
    const moves = [];
    [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr, dc]) => {
        const newR = r + dr, newC = c + dc;
        if (newR >= 0 && newR < 8 && newC >= 0 && newC < 8 && board[newR][newC]?.color !== color) {
            moves.push({ row: newR, col: newC });
        }
    });
    return moves;
}

function getKingMovesForBoard(board, r, c, color) {
    const moves = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const newR = r + dr, newC = c + dc;
            if (newR >= 0 && newR < 8 && newC >= 0 && newC < 8 && board[newR][newC]?.color !== color) {
                moves.push({ row: newR, col: newC });
            }
        }
    }
    return moves;
}

function getSlidingMovesForBoard(board, r, c, color, directions) {
    const moves = [];
    directions.forEach(([dr, dc]) => {
        let newR = r + dr, newC = c + dc;
        while(newR >= 0 && newR < 8 && newC >= 0 && newC < 8) {
            const target = board[newR][newC];
            if(target) { 
                if (target.color !== color) moves.push({ row: newR, col: newC }); 
                break; 
            }
            moves.push({ row: newR, col: newC });
            newR += dr; newC += dc;
        }
    });
    return moves;
}

function isKingInCheckForBoard(color, board) {
    let kingPos = null;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c]?.type === 'king' && board[r][c]?.color === color) {
                kingPos = { row: r, col: c };
                break;
            }
        }
        if (kingPos) break;
    }
    
    if (!kingPos) return false;
    
    const attackerColor = color === 'white' ? 'black' : 'white';
    return isSquareAttacked(kingPos.row, kingPos.col, attackerColor, board);
}

function getAllPossibleMoves(color){
    const m=[];
    for(let r=0;r<8;r++)
        for(let c=0;c<8;c++)
            if(gameBoard[r][c]?.color===color)
                getValidMoves(r,c).forEach(move=>m.push({fromRow:r,fromCol:c,toRow:move.row,toCol:move.col}));
    return m;
}

function evaluateBoard(board,color){
    let score=0;
    for(let r=0;r<8;r++){
        for(let c=0;c<8;c++){
            const p=board[r][c];
            if(p){
                let v=pieceValues[p.type];
                const table=pieceSquareTables[p.type];
                const pR=p.color==='white' ? 7 - r : r;
                v+=table[pR][c] || 0;
                score+=p.color===color?v:-v;
            }
        }
    }
    return score;
}

function renderBoard(){
    const b=document.getElementById('chessBoard');
    b.innerHTML='';
    for(let r=0;r<8;r++)
        for(let c=0;c<8;c++){
            const s=document.createElement('div');
            s.className=`square ${(r+c)%2===0?'light':'dark'}`;
            s.dataset.row=r;
            s.dataset.col=c;
            const pD=gameBoard[r][c];
            if(pD){
                const pE=document.createElement('div');
                pE.className='piece';
                pE.textContent=pieces[pD.color][pD.type];
                s.appendChild(pE);
            }
            s.addEventListener('click',()=>handleSquareClick(r,c));
            b.appendChild(s);
        }
}

function updateAllUI(){
    updateGameInfo();
    updateCapturedPiecesUI();
    updateMoveHistoryUI();
}

function updateGameInfo(){
    const pE=document.getElementById('currentPlayer');
    pE.textContent=`Turno: ${currentPlayer==='white'?'Blancas':'Negras'}`;
    pE.className=`current-player ${currentPlayer}-turn`;
    document.getElementById('gameStatus').textContent=gameOver?document.getElementById('gameStatus').textContent:'Juego en curso';
}

function updateCapturedPiecesUI(){
    document.getElementById('capturedWhite').textContent=capturedPieces.black.map(p=>pieces[p.color][p.type]).join(' ');
    document.getElementById('capturedBlack').textContent=capturedPieces.white.map(p=>pieces[p.color][p.type]).join(' ');
}

function updateMoveHistoryUI(){
    const hE=document.getElementById('moveHistory');
    hE.innerHTML=moveHistory.map((m,i)=>(i%2===0?`<div>${Math.floor(i/2)+1}. ${m}`:` ${m}</div>`)).join('');
    hE.scrollTop=hE.scrollHeight;
}

function addToMoveHistory(fR,fC,tR,tC,p,c){
    const from=String.fromCharCode(97+fC)+(8-fR);
    const to=String.fromCharCode(97+tC)+(8-tR);
    let n=pieces[p.color][p.type]+from+(c?'x':'-')+to;
    if(isKingInCheck(p.color==='white'?'black':'white'))n+='+';
    moveHistory.push(n);
}

function clearHighlights(){
    document.querySelectorAll('.square').forEach(s=>s.classList.remove('selected','possible-move','attack-move'));
}

function highlightSquare(r,c,cl){
    document.querySelector(`.square[data-row='${r}'][data-col='${c}']`)?.classList.add(cl);
}

function showNotification(m,t='success'){
    const n=document.getElementById('notification');
    n.textContent=m;
    n.className=`notification show ${t}`;
    setTimeout(()=>n.classList.remove('show'),3000);
}

// Variables para la promoción
let promotionRow = null;
let promotionCol = null;
let promotionColor = null;

function showPromotionModal(row, col, color) {
    promotionRow = row;
    promotionCol = col;
    promotionColor = color;
    
    const modal = document.getElementById('promotionModal');
    modal.style.display = 'flex';
}

function promotePawn(pieceType) {
    if (promotionRow === null || promotionCol === null) return;
    
    const piece = gameBoard[promotionRow][promotionCol];
    piece.type = pieceType;
    
    const pieceNames = {
        queen: 'Reina',
        rook: 'Torre',
        bishop: 'Alfil',
        knight: 'Caballo'
    };
    
    showNotification(`${promotionColor === 'white' ? 'Blancas' : 'Negras'} promocionan a ${pieceNames[pieceType]}!`, 'info');
    
    // Cerrar modal
    document.getElementById('promotionModal').style.display = 'none';
    
    // Resetear variables
    promotionRow = null;
    promotionCol = null;
    promotionColor = null;
    
    // Continuar con el turno
    selectedSquare = null;
    clearHighlights();
    processTurn();
}

// Variables para la trivia
let currentTriviaQuestion = null;
let currentTriviaAnswer = null;

function showRandomTrivia() {
    if (!triviaQuestions || triviaQuestions.length === 0) {
        console.warn('No hay preguntas de trivia disponibles');
        continueAfterTrivia();
        return;
    }
    
    // Seleccionar pregunta aleatoria
    const randomIndex = Math.floor(Math.random() * triviaQuestions.length);
    const question = triviaQuestions[randomIndex];
    
    // Adaptar formato de pregunta
    const pregunta = question.pregunta || question.question;
    const opciones = question.opciones || question.options;
    const respuestaCorrecta = question.respuestaCorrecta;
    
    if (!pregunta || !opciones || !Array.isArray(opciones)) {
        console.warn('Formato de pregunta inválido');
        continueAfterTrivia();
        return;
    }
    
    // Encontrar el índice de la respuesta correcta
    const answerIndex = opciones.findIndex(opt => opt === respuestaCorrecta);
    
    currentTriviaQuestion = question;
    currentTriviaAnswer = answerIndex;
    
    // Mostrar modal
    const modal = document.getElementById('triviaModal');
    const questionEl = document.getElementById('triviaQuestion');
    const optionsEl = document.getElementById('triviaOptions');
    
    questionEl.textContent = pregunta;
    optionsEl.innerHTML = '';
    
    opciones.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'difficulty-button';
        button.textContent = option;
        button.onclick = () => answerTrivia(index);
        optionsEl.appendChild(button);
    });
    
    modal.style.display = 'flex';
}

function answerTrivia(selectedIndex) {
    const modal = document.getElementById('triviaModal');
    
    if (selectedIndex === currentTriviaAnswer) {
        showNotification('✅ ¡Respuesta correcta!', 'success');
    } else {
        showNotification('❌ Respuesta incorrecta. La correcta era: ' + currentTriviaQuestion.options[currentTriviaAnswer], 'warning');
    }
    
    modal.style.display = 'none';
    currentTriviaQuestion = null;
    currentTriviaAnswer = null;
    
    // Continuar con el juego
    continueAfterTrivia();
}

function continueAfterTrivia() {
    if (gameMode === 'vsAI' && currentPlayer === 'black' && !gameOver) { 
        makeAIMove();
    }
}
