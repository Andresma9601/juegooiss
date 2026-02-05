let triviaBank = [];
let preguntasDisponibles = [];

let trainingStats = {
    totalAnswered: 0,
    correct: 0,
    incorrect: 0,
    streak: 0,
    bestStreak: 0
};

let musicEnabled = localStorage.getItem('triviaMusic') !== 'false';
let backgroundMusic, correctSound, wrongSound;

const FALLBACK_TRIVIA_BANK = [
    { "pregunta": "¿Qué es la Seguridad Social?", "opciones": [ "Una protección garantizada por el Estado para cubrir riesgos como enfermedad, vejez, desempleo, entre otros.", "Un subsidio temporal que solo se da en casos de accidentes.", "Un sistema de ahorro privado.", "Una ONG que da ayuda a los pobres." ], "respuestaCorrecta": "Una protección garantizada por el Estado para cubrir riesgos como enfermedad, vejez, desempleo, entre otros.", "mensajeCorrecto": "¡Bien hecho! Tu conocimiento sobre la seguridad social te trae beneficios.", "mensajeIncorrecto": "No fue la respuesta correcta. Repasa tus conocimientos.", "efectoDinero": 30, "efectoSalud": 0, "efectoOcio": 0, "efectoConocimiento": 10, "categoria": "Conocimiento" },
    { "pregunta": "¿Cuál es el principal objetivo de la Seguridad Social?", "opciones": [ "Proteger a las personas ante situaciones que afecten su ingreso o su salud.", "Recaudar impuestos para construir carreteras.", "Facilitar la importación de medicamentos.", "Promover la libre competencia entre hospitales." ], "respuestaCorrecta": "Proteger a las personas ante situaciones que afecten su ingreso o su salud.", "mensajeCorrecto": "¡Bien hecho! Tu conocimiento sobre la seguridad social te trae beneficios.", "mensajeIncorrecto": "No fue la respuesta correcta. Repasa tus conocimientos.", "efectoDinero": 30, "efectoSalud": 0, "efectoOcio": 0, "efectoConocimiento": 10, "categoria": "Conocimiento" },
    { "pregunta": "¿Qué significa AFP?", "opciones": [ "Administradora de Fondos de Pensiones", "Asociación de Fondos Públicos", "Administración Federal de Pensiones", "Agencia de Finanzas Personales" ], "respuestaCorrecta": "Administradora de Fondos de Pensiones", "mensajeCorrecto": "¡Correcto! Las AFP administran los fondos de pensiones.", "mensajeIncorrecto": "Incorrecto. AFP significa Administradora de Fondos de Pensiones.", "efectoDinero": 25, "efectoSalud": 0, "efectoOcio": 0, "efectoConocimiento": 15, "categoria": "Pensiones" },
    { "pregunta": "¿A qué edad se puede jubilar anticipadamente en Colombia?", "opciones": [ "A los 55 años las mujeres y 60 años los hombres", "A los 50 años ambos géneros", "A los 65 años ambos géneros", "No existe jubilación anticipada" ], "respuestaCorrecta": "A los 55 años las mujeres y 60 años los hombres", "mensajeCorrecto": "¡Excelente! Conoces bien los requisitos de jubilación.", "mensajeIncorrecto": "Incorrecto. Las mujeres pueden jubilarse a los 55 y los hombres a los 60.", "efectoDinero": 40, "efectoSalud": 5, "efectoOcio": 0, "efectoConocimiento": 20, "categoria": "Jubilación" },
    { "pregunta": "¿Cuántas semanas mínimo se requieren para pensionarse por vejez?", "opciones": [ "1300 semanas", "1000 semanas", "1500 semanas", "800 semanas" ], "respuestaCorrecta": "1300 semanas", "mensajeCorrecto": "¡Correcto! Se requieren 1300 semanas cotizadas.", "mensajeIncorrecto": "Incorrecto. Se necesitan 1300 semanas cotizadas.", "efectoDinero": 35, "efectoSalud": 0, "efectoOcio": 0, "efectoConocimiento": 25, "categoria": "Requisitos" }
];

function initAudio() {
    backgroundMusic = document.getElementById('backgroundMusic');
    correctSound = document.getElementById('correctSound');
    wrongSound = document.getElementById('wrongSound');

    if (backgroundMusic) {
        backgroundMusic.volume = 0.3;
        // Manejar errores de carga de audio
        backgroundMusic.addEventListener('error', function(e) {
            console.warn('No se pudo cargar la música de fondo:', e);
        });
    }
    if (correctSound) {
        correctSound.volume = 0.6;
        correctSound.addEventListener('error', function(e) {
            console.warn('No se pudo cargar el sonido de respuesta correcta:', e);
        });
    }
    if (wrongSound) {
        wrongSound.volume = 0.6;
        wrongSound.addEventListener('error', function(e) {
            console.warn('No se pudo cargar el sonido de respuesta incorrecta:', e);
        });
    }

    updateMusicButton();
    
    if (musicEnabled) {
        playBackgroundMusic();
    }
}

function playBackgroundMusic() {
    if (backgroundMusic && musicEnabled) {
        backgroundMusic.play().catch(error => {
            console.log('No se pudo reproducir la música:', error);
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
        sound.play().catch(error => {
            console.log('No se pudo reproducir el sonido:', error);
        });
    }
}

function toggleMusic() {
    musicEnabled = !musicEnabled;
    localStorage.setItem('triviaMusic', musicEnabled);
    
    if (musicEnabled) {
        playBackgroundMusic();
    } else {
        stopBackgroundMusic();
    }
    
    updateMusicButton();
}

function updateMusicButton() {
    const musicBtn = document.getElementById('musicToggle');
    if (musicBtn) {
        const span = musicBtn.querySelector('span');
        if (musicEnabled) {
            span.textContent = '🔊';
            musicBtn.classList.remove('muted');
            musicBtn.title = 'Silenciar música';
        } else {
            span.textContent = '🔇';
            musicBtn.classList.add('muted');
            musicBtn.title = 'Activar música';
        }
    }
}

async function loadTriviaBank() {
    try {
        const response = await fetch('../data/preguntas_trivia.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        triviaBank = await response.json();
        preguntasDisponibles = [...triviaBank];
        console.log('✅ ÉXITO! Se cargaron', triviaBank.length, 'preguntas desde preguntas_trivia.json');
        return true;
    } catch (error) {
        console.warn('⚠️ No se pudo cargar "preguntas_trivia.json". Usando banco de respaldo.', error);
        triviaBank = FALLBACK_TRIVIA_BANK;
        preguntasDisponibles = [...triviaBank];
        console.log('ADVERTENCIA: Se está usando el banco de preguntas de respaldo interno.');
        return false;
    }
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getRandomTrivia() {
    if (preguntasDisponibles.length === 0) {
        console.log("🧠 ¡Has respondido todas las trivias! Se reiniciará el banco de preguntas.");
        preguntasDisponibles = [...triviaBank];
    }
    if (preguntasDisponibles.length === 0) return null;
    
    const indiceAleatorio = Math.floor(Math.random() * preguntasDisponibles.length);
    const trivia = preguntasDisponibles.splice(indiceAleatorio, 1)[0];
    
    const opciones = [...trivia.opciones];
    const shuffledOptions = shuffleArray(opciones);
    
    return {
        ...trivia,
        opciones: shuffledOptions
    };
}

function mostrarTriviaAleatoria() {
    const trainingQuestionEl = document.getElementById('trainingQuestion');
    const trainingOptionsEl = document.getElementById('trainingOptions');
    const trainingResultEl = document.getElementById('trainingResult');
    
    if (!trainingQuestionEl || !trainingOptionsEl || !trainingResultEl || triviaBank.length === 0) return;
    
    const trivia = getRandomTrivia();
    trainingQuestionEl.textContent = trivia.pregunta;
    trainingOptionsEl.innerHTML = '';
    trainingResultEl.classList.add('hidden');
    
    trivia.opciones.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'training-option';
        optionEl.textContent = option;
        
        optionEl.addEventListener('click', () => {
            const isCorrect = option === trivia.respuestaCorrecta;
            
            trainingStats.totalAnswered++;
            
            if (isCorrect) {
                trainingStats.correct++;
                trainingStats.streak++;
                if (trainingStats.streak > trainingStats.bestStreak) {
                    trainingStats.bestStreak = trainingStats.streak;
                }
                
                playSound(correctSound);
                
                if (trainingStats.streak >= 5) {
                    console.log(`🔥 ¡Racha de ${trainingStats.streak}!`);
                }
            } else {
                trainingStats.incorrect++;
                trainingStats.streak = 0;
                
                playSound(wrongSound);
            }
            
            updateTrainingStatsUI();
            saveTrainingStats();
            
            trainingResultEl.textContent = isCorrect ? `🎉 ${trivia.mensajeCorrecto}` : `❌ ${trivia.mensajeIncorrecto}`;
            trainingResultEl.className = isCorrect ? 'training-result correct' : 'training-result incorrect';
            trainingResultEl.classList.remove('hidden');
            
            trainingOptionsEl.querySelectorAll('.training-option').forEach(opt => {
                opt.style.pointerEvents = 'none';
                if (opt.textContent === trivia.respuestaCorrecta) {
                    opt.classList.add('correct');
                } else if (opt.textContent === option && !isCorrect) {
                    opt.classList.add('incorrect');
                }
            });
        });
        
        trainingOptionsEl.appendChild(optionEl);
    });
}

function updateTrainingStatsUI() {
    const totalEl = document.getElementById('totalAnsweredStat');
    const correctEl = document.getElementById('correctStat');
    const incorrectEl = document.getElementById('incorrectStat');
    const accuracyEl = document.getElementById('accuracyStat');
    const streakEl = document.getElementById('streakStat');
    const bestStreakEl = document.getElementById('bestStreakStat');
    
    if (totalEl) totalEl.textContent = trainingStats.totalAnswered;
    if (correctEl) correctEl.textContent = trainingStats.correct;
    if (incorrectEl) incorrectEl.textContent = trainingStats.incorrect;
    if (streakEl) streakEl.textContent = trainingStats.streak;
    if (bestStreakEl) bestStreakEl.textContent = trainingStats.bestStreak;
    
    const accuracy = trainingStats.totalAnswered > 0 
        ? Math.round((trainingStats.correct / trainingStats.totalAnswered) * 100)
        : 0;
    if (accuracyEl) accuracyEl.textContent = accuracy + '%';
}

function reiniciarEstadisticasTrivia() {
    trainingStats = {
        totalAnswered: 0,
        correct: 0,
        incorrect: 0,
        streak: 0,
        bestStreak: 0
    };
    updateTrainingStatsUI();
    clearTrainingStats();
    console.log('📊 Estadísticas de entrenamiento reiniciadas');
}

function saveTrainingStats() {
    try {
        localStorage.setItem('trainingStats', JSON.stringify(trainingStats));
    } catch (error) {
        console.warn('No se pudieron guardar las estadísticas:', error);
    }
}

function loadTrainingStats() {
    try {
        const saved = localStorage.getItem('trainingStats');
        if (saved) {
            trainingStats = JSON.parse(saved);
            updateTrainingStatsUI();
        }
    } catch (error) {
        console.warn('No se pudieron cargar las estadísticas:', error);
    }
}

function clearTrainingStats() {
    try {
        localStorage.removeItem('trainingStats');
    } catch (error) {
        console.warn('No se pudieron limpiar las estadísticas:', error);
    }
}

function volverALaOficina() {
    stopBackgroundMusic();
    console.log('🏢 Volviendo a la oficina 3D...');
    window.location.href = 'oficina.html';
}

async function inicializarTrivia() {
    console.log('🧠 Inicializando sistema de trivia...');
    
    await loadTriviaBank();
    loadTrainingStats();
    initAudio();
    mostrarTriviaAleatoria();
    
    console.log('✅ Sistema de trivia listo!');
}

window.mostrarTriviaAleatoria = mostrarTriviaAleatoria;
window.reiniciarEstadisticasTrivia = reiniciarEstadisticasTrivia;
window.volverALaOficina = volverALaOficina;

document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM cargado, inicializando trivia...');
    inicializarTrivia();
    
    const musicBtn = document.getElementById('musicToggle');
    if (musicBtn) {
        musicBtn.addEventListener('click', toggleMusic);
    }
    
    document.addEventListener('click', () => {
        if (musicEnabled && backgroundMusic && backgroundMusic.paused) {
            playBackgroundMusic();
        }
    }, { once: true });
});

if (document.readyState !== 'loading') {
    console.log('📄 DOM ya estaba cargado, inicializando inmediatamente...');
    inicializarTrivia();
}