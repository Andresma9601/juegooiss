let scene, camera, renderer;
const player = {
    position: new THREE.Vector3(0, 1.6, 5),
    velocity: new THREE.Vector3(0, 0, 0),
    speed: 0.1,
    isDancing: false
};
const keys = {};
let mouseX = 0;
let nearbyComputer = null;
let nearbyRedirectDesk = null;
let nearbyPairsDesk = null;
let nearbyChessDesk = null;
let nearbyComingSoon1 = null;
let nearbyComingSoon2 = null;
let nearbyComingSoon3 = null;

let computer = null;
let redirectDesk = null;
let pairsDesk = null;
let chessDesk = null;
let comingSoonDesk1 = null;
let comingSoonDesk2 = null;
let comingSoonDesk3 = null;

let officeMusic = null;
let musicEnabled = localStorage.getItem('officeMusic') !== 'false';

const OISS_COLORS = {
    blue: 0x005daa,
    green: 0x69a341,
    white: 0xffffff,
    lightGray: 0xf0f0f0,
    darkGray: 0x333333
};

function initAudio() {
    officeMusic = document.getElementById('officeMusic');
    
    if (officeMusic) {
        officeMusic.volume = 0.4;
        
        const musicToggle = document.getElementById('musicToggle');
        if (musicToggle) {
            musicToggle.addEventListener('click', toggleMusic);
        }
        
        // Agregar funcionalidad del botón toggle de instrucciones
        const toggleInstructions = document.getElementById('toggleInstructions');
        if (toggleInstructions) {
            toggleInstructions.addEventListener('click', toggleInstructionsPanel);
        }
        
        updateMusicButton();
        
        if (musicEnabled) {
            playOfficeMusic();
        }
        
        document.addEventListener('click', () => {
            if (musicEnabled && officeMusic && officeMusic.paused) {
                playOfficeMusic();
            }
        }, { once: true });
    }
}

function playOfficeMusic() {
    if (officeMusic && musicEnabled) {
        officeMusic.play().catch(error => {
            console.log('No se pudo reproducir la música de oficina:', error);
        });
    }
}

function stopOfficeMusic() {
    if (officeMusic) {
        officeMusic.pause();
        officeMusic.currentTime = 0;
    }
}

function toggleMusic() {
    musicEnabled = !musicEnabled;
    localStorage.setItem('officeMusic', musicEnabled);
    
    if (musicEnabled) {
        playOfficeMusic();
    } else {
        stopOfficeMusic();
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

function initWorld3D() {
    const container = document.getElementById('canvas-container');
    if (!container) {
        return;
    }

    scene = new THREE.Scene();
    scene.background = new THREE.Color(OISS_COLORS.lightGray);
    scene.fog = new THREE.Fog(OISS_COLORS.lightGray, 15, 40);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    createOffice();
    computer = createComputer();
    scene.add(computer);
    redirectDesk = createRedirectDesk();
    scene.add(redirectDesk);
    pairsDesk = createPairsDesk();
    scene.add(pairsDesk);
    chessDesk = createChessDesk();
    scene.add(chessDesk);
    
    // Agregar los 3 escritorios de "Próximamente"
    comingSoonDesk1 = createComingSoonDesk1();
    scene.add(comingSoonDesk1);
    comingSoonDesk2 = createComingSoonDesk2();
    scene.add(comingSoonDesk2);
    comingSoonDesk3 = createComingSoonDesk3();
    scene.add(comingSoonDesk3);
    
    addDecorations();

    const tvLeft = createTV({
        position: new THREE.Vector3(-9.9, 2, 0),
        rotation: new THREE.Euler(0, Math.PI / 2, 0)
    });
    scene.add(tvLeft);

    const tvRight = createTV({
        position: new THREE.Vector3(9.9, 2, 0),
        rotation: new THREE.Euler(0, -Math.PI / 2, 0)
    });
    scene.add(tvRight);

    setupEventListeners();
    animate();
}

function createOffice() {
    const officeSize = 20;

    const floorGeometry = new THREE.PlaneGeometry(officeSize, officeSize);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: OISS_COLORS.lightGray,
        roughness: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const wallMaterial = new THREE.MeshStandardMaterial({ color: OISS_COLORS.white });
    const accentWallMaterial = new THREE.MeshStandardMaterial({ color: OISS_COLORS.blue });
    const wallHeight = 6;

    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(officeSize, wallHeight), accentWallMaterial);
    backWall.position.set(0, wallHeight / 2, -officeSize / 2);
    backWall.receiveShadow = true;
    scene.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(officeSize, wallHeight), wallMaterial);
    leftWall.position.set(-officeSize / 2, wallHeight / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(officeSize, wallHeight), wallMaterial);
    rightWall.position.set(officeSize / 2, wallHeight / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    scene.add(rightWall);
}

function createModernDesk() {
    const deskGroup = new THREE.Group();
    const deskTop = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.08, 0.9),
        new THREE.MeshStandardMaterial({ color: OISS_COLORS.white })
    );
    deskTop.position.y = 0.75;
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    const legGeometry = new THREE.BoxGeometry(0.05, 0.73, 0.05);
    const legMaterial = new THREE.MeshStandardMaterial({ color: OISS_COLORS.darkGray });
    const legPositions = [
        [-0.95, 0.365, -0.4],
        [0.95, 0.365, -0.4],
        [-0.95, 0.365, 0.4],
        [0.95, 0.365, 0.4]
    ];
    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(...pos);
        leg.castShadow = true;
        deskGroup.add(leg);
    });

    const monitor = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.45, 0.04),
        new THREE.MeshStandardMaterial({ color: OISS_COLORS.darkGray })
    );
    monitor.position.set(0, 1.05, -0.2);
    monitor.castShadow = true;
    deskGroup.add(monitor);

    const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(0.75, 0.4),
        new THREE.MeshStandardMaterial({
            color: 0x001a33,
            emissive: 0xcccccc, 
            emissiveIntensity: 0.2
        })
    );
    screen.position.set(0, 1.05, -0.179);
    deskGroup.add(screen);

    return deskGroup;
}

function createModernChair(color) {
    const chairGroup = new THREE.Group();
    
    // Asiento de la silla
    const chairSeat = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.05, 0.45),
        new THREE.MeshStandardMaterial({ color: color })
    );
    chairSeat.position.set(0, 0.5, 0.8);
    chairGroup.add(chairSeat);

    // Respaldo de la silla
    const chairBack = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.55, 0.05),
        new THREE.MeshStandardMaterial({ color: color })
    );
    chairBack.position.set(0, 0.77, 1.02);
    chairGroup.add(chairBack);
    
    // Patas de la silla (4 patas)
    const legMaterial = new THREE.MeshStandardMaterial({ color: OISS_COLORS.darkGray });
    const legGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5);
    
    // Pata delantera izquierda
    const leg1 = new THREE.Mesh(legGeometry, legMaterial);
    leg1.position.set(-0.18, 0.25, 0.62);
    chairGroup.add(leg1);
    
    // Pata delantera derecha
    const leg2 = new THREE.Mesh(legGeometry, legMaterial);
    leg2.position.set(0.18, 0.25, 0.62);
    chairGroup.add(leg2);
    
    // Pata trasera izquierda
    const leg3 = new THREE.Mesh(legGeometry, legMaterial);
    leg3.position.set(-0.18, 0.25, 0.98);
    chairGroup.add(leg3);
    
    // Pata trasera derecha
    const leg4 = new THREE.Mesh(legGeometry, legMaterial);
    leg4.position.set(0.18, 0.25, 0.98);
    chairGroup.add(leg4);
    
    return chairGroup;
}

function createCoffeeTable() {
    const tableGroup = new THREE.Group();
    const tabletop = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.05, 0.6),
        new THREE.MeshStandardMaterial({ color: OISS_COLORS.white, roughness: 0.8 })
    );
    tabletop.position.y = 0.4;
    tabletop.castShadow = true;
    tabletop.receiveShadow = true;
    tableGroup.add(tabletop);

    const legGeometry = new THREE.BoxGeometry(0.05, 0.35, 0.05);
    const legMaterial = new THREE.MeshStandardMaterial({ color: OISS_COLORS.darkGray });
    const legPositions = [
        [-0.5, 0.175, -0.25],
        [0.5, 0.175, -0.25],
        [-0.5, 0.175, 0.25],
        [0.5, 0.175, 0.25]
    ];
    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(...pos);
        tableGroup.add(leg);
    });
    return tableGroup;
}

function createWallArt() {
    const frameMaterial = new THREE.MeshStandardMaterial({ color: OISS_COLORS.darkGray, metalness: 0.9, roughness: 0.2 });
    const imageMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });

    const createArt = (x, y, z, rotationY) => {
        const artGroup = new THREE.Group();
        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.05), frameMaterial);
        frame.position.set(x, y, z);
        frame.rotation.y = rotationY;
        artGroup.add(frame);

        const image = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), imageMaterial);
        image.position.set(x, y, z + (0.025 * Math.sin(rotationY)));
        image.rotation.y = rotationY;
        artGroup.add(image);
        scene.add(artGroup);
    };

    createArt(-9.9, 3, -6, Math.PI / 2);
    createArt(-9.9, 3, -3, Math.PI / 2);
    createArt(9.9, 3, -6, -Math.PI / 2);
    createArt(9.9, 3, -3, -Math.PI / 2);
}

function createComputer() {
    const computerGroup = createModernDesk();

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    context.fillStyle = `rgba(0, 93, 170, 0.9)`;
    context.fillRect(0, 0, 512, 128);
    context.fillStyle = 'white';
    context.font = 'bold 48px Arial';
    context.textAlign = 'center';
    context.fillText('TRIVIA', 256, 55);
    context.font = '32px Arial';
    context.fillText('Presiona E para comenzar', 256, 90);

    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.SpriteMaterial({ map: texture });
    const labelSprite = new THREE.Sprite(labelMaterial);
    labelSprite.position.set(0, 1.8, 0);
    labelSprite.scale.set(4.0, 1.0, 1);
    computerGroup.add(labelSprite);

    const chair = createModernChair(OISS_COLORS.blue);
    computerGroup.add(chair);
    computerGroup.position.set(0, 0, -7);
    computerGroup.userData = {
        type: 'computer',
        interactable: true,
        redirectTo: 'trivia.html'
    };
    return computerGroup;
}

function createRedirectDesk() {
    const deskGroup = createModernDesk();
    const chair = createModernChair(OISS_COLORS.green);
    deskGroup.add(chair);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    context.fillStyle = `rgba(105, 163, 65, 0.9)`;
    context.fillRect(0, 0, 512, 128);
    context.fillStyle = 'white';
    context.font = 'bold 36px Arial';
    context.textAlign = 'center';
    context.fillText('IR AL JUEGO PRINCIPAL', 256, 55);
    context.font = '26px Arial';
    context.fillText('Presiona E para ir a Decisiones de Vida', 256, 90);

    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.SpriteMaterial({ map: texture });
    const labelSprite = new THREE.Sprite(labelMaterial);
    labelSprite.position.set(0, 1.8, 0);
    labelSprite.scale.set(4.2, 1.05, 1);
    deskGroup.add(labelSprite);

    deskGroup.position.set(-5, 0, -7);
    deskGroup.rotation.y = 0.4;
    deskGroup.userData = {
        type: 'redirect',
        interactable: true,
        redirectTo: 'index.html'
    };
    return deskGroup;
}

function createPairsDesk() {
    const deskGroup = createModernDesk();
    const chair = createModernChair(OISS_COLORS.green);
    deskGroup.add(chair);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    context.fillStyle = `rgba(105, 163, 65, 0.9)`;
    context.fillRect(0, 0, 512, 128);
    context.fillStyle = 'white';
    context.font = 'bold 42px Arial';
    context.textAlign = 'center';
    context.fillText('JUEGO DE PAREJAS', 256, 55);
    context.font = '30px Arial';
    context.fillText('Presiona E para jugar Memoria', 256, 90);

    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.SpriteMaterial({ map: texture });
    const labelSprite = new THREE.Sprite(labelMaterial);
    labelSprite.position.set(0, 1.8, 0);
    labelSprite.scale.set(4.2, 1.05, 1);
    deskGroup.add(labelSprite);

    deskGroup.position.set(5, 0, -7);
    deskGroup.rotation.y = -0.4;
    deskGroup.userData = {
        type: 'pairs',
        interactable: true,
        redirectTo: 'parejas.html'
    };
    return deskGroup;
}

function createChessDesk() {
    const deskGroup = createModernDesk();
    const chair = createModernChair(OISS_COLORS.blue);
    deskGroup.add(chair);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    context.fillStyle = `rgba(0, 93, 170, 0.9)`;
    context.fillRect(0, 0, 512, 128);
    context.fillStyle = 'white';
    context.font = 'bold 48px Arial';
    context.textAlign = 'center';
    context.fillText('AJEDREZ SOCIAL', 256, 55);
    context.font = '30px Arial';
    context.fillText('Presiona E para jugar', 256, 90);

    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.SpriteMaterial({ map: texture });
    const labelSprite = new THREE.Sprite(labelMaterial);
    labelSprite.position.set(0, 1.8, 0);
    labelSprite.scale.set(4.2, 1.05, 1);
    deskGroup.add(labelSprite);

    deskGroup.position.set(8, 0, 0);
    deskGroup.rotation.y = -Math.PI / 2;
    deskGroup.userData = {
        type: 'chess',
        interactable: true,
        redirectTo: 'ajedrez.html'
    };
    return deskGroup;
}

function createComingSoonDesk1() {
    const deskGroup = createModernDesk();
    const chair = createModernChair(OISS_COLORS.green);
    deskGroup.add(chair);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    context.fillStyle = `rgba(105, 163, 65, 0.9)`;
    context.fillRect(0, 0, 512, 128);
    context.fillStyle = 'white';
    context.font = 'bold 36px Arial';
    context.textAlign = 'center';
    context.fillText('PRÓXIMAMENTE', 256, 45);
    context.font = '24px Arial';
    context.fillText('Añadiremos más juegos', 256, 75);
    context.font = '20px Arial';
    context.fillText('¡Mantente atento!', 256, 100);

    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.SpriteMaterial({ map: texture });
    const labelSprite = new THREE.Sprite(labelMaterial);
    labelSprite.position.set(0, 1.8, 0);
    labelSprite.scale.set(4.2, 1.05, 1);
    deskGroup.add(labelSprite);

    deskGroup.position.set(-8, 0, 0);
    deskGroup.rotation.y = Math.PI / 2;
    deskGroup.userData = {
        type: 'comingSoon1',
        interactable: false
    };
    return deskGroup;
}

function createComingSoonDesk2() {
    const deskGroup = createModernDesk();
    const chair = createModernChair(OISS_COLORS.blue);
    deskGroup.add(chair);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    context.fillStyle = `rgba(0, 93, 170, 0.9)`;
    context.fillRect(0, 0, 512, 128);
    context.fillStyle = 'white';
    context.font = 'bold 36px Arial';
    context.textAlign = 'center';
    context.fillText('PRÓXIMAMENTE', 256, 45);
    context.font = '24px Arial';
    context.fillText('Añadiremos más juegos', 256, 75);
    context.font = '20px Arial';
    context.fillText('¡Mantente atento!', 256, 100);

    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.SpriteMaterial({ map: texture });
    const labelSprite = new THREE.Sprite(labelMaterial);
    labelSprite.position.set(0, 1.8, 0);
    labelSprite.scale.set(4.2, 1.05, 1);
    deskGroup.add(labelSprite);

    deskGroup.position.set(-3, 0, 8);
    deskGroup.rotation.y = Math.PI;
    deskGroup.userData = {
        type: 'comingSoon2',
        interactable: false
    };
    return deskGroup;
}

function createComingSoonDesk3() {
    const deskGroup = createModernDesk();
    const chair = createModernChair(OISS_COLORS.green);
    deskGroup.add(chair);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    context.fillStyle = `rgba(105, 163, 65, 0.9)`;
    context.fillRect(0, 0, 512, 128);
    context.fillStyle = 'white';
    context.font = 'bold 36px Arial';
    context.textAlign = 'center';
    context.fillText('PRÓXIMAMENTE', 256, 45);
    context.font = '24px Arial';
    context.fillText('Añadiremos más juegos', 256, 75);
    context.font = '20px Arial';
    context.fillText('¡Mantente atento!', 256, 100);

    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.SpriteMaterial({ map: texture });
    const labelSprite = new THREE.Sprite(labelMaterial);
    labelSprite.position.set(0, 1.8, 0);
    labelSprite.scale.set(4.2, 1.05, 1);
    deskGroup.add(labelSprite);

    deskGroup.position.set(3, 0, 8);
    deskGroup.rotation.y = Math.PI;
    deskGroup.userData = {
        type: 'comingSoon3',
        interactable: false
    };
    return deskGroup;
}


function createTV(options = {}) {
    const tvGroup = new THREE.Group();

    const tvFrame = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, 2, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.1 })
    );
    tvFrame.castShadow = true;
    tvGroup.add(tvFrame);

    const tvScreen = new THREE.Mesh(
        new THREE.PlaneGeometry(3.3, 1.8),
        new THREE.MeshStandardMaterial({
            color: 0x000000,
            emissive: 0x55aaff,
            emissiveIntensity: 0.4
        })
    );
    tvScreen.position.z = 0.06;
    tvGroup.add(tvScreen);

    const cable = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 1.5),
        new THREE.MeshStandardMaterial({ color: 0x111111 })
    );
    cable.position.set(0.5, -1.0, 0);
    tvGroup.add(cable);

    if (options.position) {
        tvGroup.position.copy(options.position);
    }
    if (options.rotation) {
        tvGroup.rotation.copy(options.rotation);
    }

    return tvGroup;
}

function createFilingCabinet(x, z, rotationY) {
    const cabinetGroup = new THREE.Group();

    const cabinetBox = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.5, 0.6),
        new THREE.MeshStandardMaterial({ color: OISS_COLORS.lightGray, metalness: 0.2, roughness: 0.8 })
    );
    cabinetBox.position.set(0, 0.75, 0);
    cabinetBox.castShadow = true;
    cabinetBox.receiveShadow = true;
    cabinetGroup.add(cabinetBox);

    for (let i = 0; i < 3; i++) {
        const drawer = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.4, 0.02),
            new THREE.MeshStandardMaterial({ color: OISS_COLORS.white, metalness: 0.1, roughness: 0.5 })
        );
        drawer.position.set(0, 1.25 - i * 0.5, 0.3);
        cabinetGroup.add(drawer);

        const handle = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.05, 0.05),
            new THREE.MeshStandardMaterial({ color: OISS_COLORS.darkGray, metalness: 0.9, roughness: 0.1 })
        );
        handle.position.set(0, 1.25 - i * 0.5, 0.35);
        cabinetGroup.add(handle);
    }

    cabinetGroup.position.set(x, 0, z);
    if (rotationY) {
        cabinetGroup.rotation.y = rotationY;
    }
    scene.add(cabinetGroup);
}

function addDecorations() {
    const plantPotGeometry = new THREE.CylinderGeometry(0.25, 0.2, 0.3, 8);
    const plantPotMaterial = new THREE.MeshStandardMaterial({ color: OISS_COLORS.darkGray });
    const plantLeavesGeometry = new THREE.SphereGeometry(0.5, 6, 5);
    const plantLeavesMaterial = new THREE.MeshStandardMaterial({ color: OISS_COLORS.green });

    const createPlant = (x, z) => {
        const plantGroup = new THREE.Group();
        const pot = new THREE.Mesh(plantPotGeometry, plantPotMaterial);
        pot.position.y = 0.15;
        pot.castShadow = true;
        plantGroup.add(pot);

        const leaves = new THREE.Mesh(plantLeavesGeometry, plantLeavesMaterial);
        leaves.position.y = 0.6;
        leaves.castShadow = true;
        plantGroup.add(leaves);

        plantGroup.position.set(x, 0, z);
        scene.add(plantGroup);
    };
    
    createPlant(-8.5, -8.5);
    createPlant(8.5, -8.5);
    createPlant(-8.5, 8.5);
    createPlant(8.5, 8.5);
    createPlant(-3, -8.5);
    createPlant(3, -8.5);

    createFilingCabinet(-9.5, 5, Math.PI / 2);
    createFilingCabinet(9.5, 5, -Math.PI / 2);
    createFilingCabinet(-9.5, -5, Math.PI / 2);
    createFilingCabinet(9.5, -5, -Math.PI / 2);

    const coffeeTable = createCoffeeTable();
    coffeeTable.position.set(0, 0, 8);
    scene.add(coffeeTable);

    // Sillas blancas corregidas - mejor posicionadas alrededor de la mesa
    const chair1 = createModernChair(OISS_COLORS.white);
    chair1.position.set(-1.5, 0, 7.2);
    chair1.rotation.y = 0;
    scene.add(chair1);

    const chair2 = createModernChair(OISS_COLORS.white);
    chair2.position.set(1.5, 0, 7.2);
    chair2.rotation.y = 0;
    scene.add(chair2);
    
    // Mesa adicional (no silla)
    const sideTable = createSideTable();
    sideTable.position.set(0, 0, 9.5);
    scene.add(sideTable);

    // Agregar más elementos decorativos
    addOfficeDecorations();
    
    createWallArt();
}

function addOfficeDecorations() {
    // Plantas decorativas
    const plant1 = createOfficePlant();
    plant1.position.set(-8, 0, 5);
    scene.add(plant1);
    
    const plant2 = createOfficePlant();
    plant2.position.set(8, 0, 8);
    scene.add(plant2);
    
    // Estantería con libros
    const bookshelf = createBookshelf();
    bookshelf.position.set(-9, 0, -2);
    scene.add(bookshelf);
    
    // Papelera
    const trashCan = createTrashCan();
    trashCan.position.set(3, 0, -8.5);
    scene.add(trashCan);
    
    // Lámpara de pie
    const floorLamp = createFloorLamp();
    floorLamp.position.set(-6, 0, 9);
    scene.add(floorLamp);
    
    // Cuadros adicionales en las paredes
    const painting1 = createWallPainting();
    painting1.position.set(0, 2, -9.9);
    scene.add(painting1);
    
    const painting2 = createWallPainting();
    painting2.position.set(-9.9, 2, 0);
    painting2.rotation.y = Math.PI / 2;
    scene.add(painting2);
}

function createOfficePlant() {
    const plantGroup = new THREE.Group();
    
    // Maceta
    const pot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.25, 0.4),
        new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    );
    pot.position.set(0, 0.2, 0);
    plantGroup.add(pot);
    
    // Planta (hojas verdes)
    const leaves = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 8, 6),
        new THREE.MeshStandardMaterial({ color: 0x228B22 })
    );
    leaves.position.set(0, 0.7, 0);
    leaves.scale.set(1, 1.2, 1);
    plantGroup.add(leaves);
    
    return plantGroup;
}

function createBookshelf() {
    const shelfGroup = new THREE.Group();
    
    // Estructura de la estantería
    const shelf = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 2, 0.3),
        new THREE.MeshStandardMaterial({ color: OISS_COLORS.darkGray })
    );
    shelf.position.set(0, 1, 0);
    shelfGroup.add(shelf);
    
    // Libros (varios colores)
    const bookColors = [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0x96CEB4, 0xFECA57];
    for (let i = 0; i < 8; i++) {
        const book = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.25, 0.02),
            new THREE.MeshStandardMaterial({ color: bookColors[i % bookColors.length] })
        );
        book.position.set(-0.6 + (i * 0.17), 1.5, 0.1);
        shelfGroup.add(book);
    }
    
    return shelfGroup;
}

function createTrashCan() {
    const trashCan = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.18, 0.4),
        new THREE.MeshStandardMaterial({ color: 0x333333 })
    );
    trashCan.position.set(0, 0.2, 0);
    return trashCan;
}

function createFloorLamp() {
    const lampGroup = new THREE.Group();
    
    // Base de la lámpara
    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.05),
        new THREE.MeshStandardMaterial({ color: OISS_COLORS.darkGray })
    );
    base.position.set(0, 0.025, 0);
    lampGroup.add(base);
    
    // Poste
    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 1.5),
        new THREE.MeshStandardMaterial({ color: OISS_COLORS.darkGray })
    );
    pole.position.set(0, 0.75, 0);
    lampGroup.add(pole);
    
    // Pantalla de la lámpara
    const shade = new THREE.Mesh(
        new THREE.ConeGeometry(0.3, 0.4, 8),
        new THREE.MeshStandardMaterial({ color: OISS_COLORS.white })
    );
    shade.position.set(0, 1.7, 0);
    lampGroup.add(shade);
    
    return lampGroup;
}

function createWallPainting() {
    const paintingGroup = new THREE.Group();
    
    // Marco
    const frame = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.8, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    );
    paintingGroup.add(frame);
    
    // Cuadro (imagen abstracta)
    const painting = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.6, 0.02),
        new THREE.MeshStandardMaterial({ color: OISS_COLORS.blue })
    );
    painting.position.set(0, 0, 0.015);
    paintingGroup.add(painting);
    
    return paintingGroup;
}

function createSideTable() {
    const tableGroup = new THREE.Group();
    
    // Superficie de la mesa
    const tabletop = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.05, 0.6),
        new THREE.MeshStandardMaterial({ color: OISS_COLORS.white })
    );
    tabletop.position.set(0, 0.4, 0);
    tableGroup.add(tabletop);
    
    // Patas de la mesa (4 patas)
    const legMaterial = new THREE.MeshStandardMaterial({ color: OISS_COLORS.darkGray });
    const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.4);
    
    // Pata 1
    const leg1 = new THREE.Mesh(legGeometry, legMaterial);
    leg1.position.set(-0.5, 0.2, -0.25);
    tableGroup.add(leg1);
    
    // Pata 2
    const leg2 = new THREE.Mesh(legGeometry, legMaterial);
    leg2.position.set(0.5, 0.2, -0.25);
    tableGroup.add(leg2);
    
    // Pata 3
    const leg3 = new THREE.Mesh(legGeometry, legMaterial);
    leg3.position.set(-0.5, 0.2, 0.25);
    tableGroup.add(leg3);
    
    // Pata 4
    const leg4 = new THREE.Mesh(legGeometry, legMaterial);
    leg4.position.set(0.5, 0.2, 0.25);
    tableGroup.add(leg4);
    
    // Agregar algunos objetos decorativos en la mesa
    const decoration = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.1, 0.1),
        new THREE.MeshStandardMaterial({ color: OISS_COLORS.blue })
    );
    decoration.position.set(0.2, 0.47, 0.1);
    tableGroup.add(decoration);
    
    return tableGroup;
}

function setupEventListeners() {
    document.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
        if (e.key.toLowerCase() === 'e') {
            if (nearbyComputer) redirectToTrivia();
            else if (nearbyRedirectDesk) redirectToMainGame();
            else if (nearbyPairsDesk) redirectToPairsGame();
            else if (nearbyChessDesk) redirectToChessGame();
        }
        if (e.key === ' ') {
            e.preventDefault();
            player.isDancing = true;
        }
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
        if (e.key === ' ') {
            player.isDancing = false;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (document.pointerLockElement === renderer.domElement) {
            mouseX += e.movementX * 0.002;
        }
    });

    if (renderer && renderer.domElement) {
        renderer.domElement.addEventListener('click', () => {
            renderer.domElement.requestPointerLock();
        });
    }

    window.addEventListener('resize', () => {
        if (camera && renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    });
}

function redirectTo(url, text, object) {
    createFloatingText(text, object.position);
    setTimeout(() => {
        stopOfficeMusic();
        window.location.href = url;
    }, 1000);
}

function redirectToTrivia() {
    redirectTo('trivia.html', '🧠 ¡Yendo a la trivia!', computer);
}

function redirectToMainGame() {
    redirectTo('index.html', '🎮 ¡Yendo al juego principal!', redirectDesk);
}

function volverALanding() {
    createFloatingText('🚪 ¡Volviendo al inicio!', player.position);
    setTimeout(() => {
        stopOfficeMusic();
        // Ocultar la oficina 3D y mostrar la pantalla de intro
        document.getElementById('mundo3D').classList.add('hidden');
        document.getElementById('introPantalla').classList.remove('hidden');
    }, 1000);
}

function toggleInstructionsPanel() {
    // Función placeholder - por implementar después
    console.log('Toggle de instrucciones - por implementar');
}

function redirectToPairsGame() {
    redirectTo('parejas.html', '🎯 ¡Yendo al juego de parejas!', pairsDesk);
}

function redirectToChessGame() {
    redirectTo('ajedrez.html', '♟️ ¡Vamos a jugar Ajedrez Social!', chessDesk);
}


function createFloatingText(text, worldPos) {
    if (!camera || !worldPos) return;

    const screenPos = worldPos.clone();
    screenPos.project(camera);

    const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-screenPos.y * 0.5 + 0.5) * window.innerHeight;

    const div = document.createElement('div');
    div.className = 'floating-text';
    div.textContent = text;
    div.style.left = x + 'px';
    div.style.top = y + 'px';
    document.body.appendChild(div);

    setTimeout(() => {
        if (div.parentNode) {
            div.remove();
        }
    }, 2000);
}

function animate() {
    requestAnimationFrame(animate);

    if (scene && camera && renderer) {
        player.velocity.set(0, 0, 0);

        if (keys['w']) player.velocity.z = player.speed;
        if (keys['s']) player.velocity.z = -player.speed;
        if (keys['a']) player.velocity.x = -player.speed;
        if (keys['d']) player.velocity.x = player.speed;

        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        forward.y = 0;
        forward.normalize();
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
        right.y = 0;
        right.normalize();

        player.position.add(forward.multiplyScalar(player.velocity.z));
        player.position.add(right.multiplyScalar(player.velocity.x));

        const boundary = 9;
        player.position.x = Math.max(-boundary, Math.min(boundary, player.position.x));
        player.position.z = Math.max(-boundary, Math.min(boundary, player.position.z));

        if (player.isDancing) {
            camera.position.y = player.position.y + Math.sin(Date.now() * 0.01) * 0.2;
            camera.rotation.z = Math.sin(Date.now() * 0.01) * 0.1;
        } else {
            camera.position.copy(player.position);
            camera.rotation.z = 0;
        }

        camera.rotation.y = mouseX;

        nearbyComputer = player.position.distanceTo(computer.position) < 3 ? computer : null;
        nearbyRedirectDesk = player.position.distanceTo(redirectDesk.position) < 3 ? redirectDesk : null;
        nearbyPairsDesk = player.position.distanceTo(pairsDesk.position) < 3 ? pairsDesk : null;
        nearbyChessDesk = player.position.distanceTo(chessDesk.position) < 3 ? chessDesk : null;
        nearbyComingSoon1 = player.position.distanceTo(comingSoonDesk1.position) < 3 ? comingSoonDesk1 : null;
        nearbyComingSoon2 = player.position.distanceTo(comingSoonDesk2.position) < 3 ? comingSoonDesk2 : null;
        nearbyComingSoon3 = player.position.distanceTo(comingSoonDesk3.position) < 3 ? comingSoonDesk3 : null;

        const interactionPrompt = document.getElementById('interaction-prompt');
        if (interactionPrompt) {
            if (nearbyComputer) {
                interactionPrompt.style.display = 'block';
                interactionPrompt.textContent = 'Presiona E para ir a la Trivia';
            } else if (nearbyRedirectDesk) {
                interactionPrompt.style.display = 'block';
                interactionPrompt.textContent = 'Presiona E para ir al juego principal';
            } else if (nearbyPairsDesk) {
                interactionPrompt.style.display = 'block';
                interactionPrompt.textContent = 'Presiona E para jugar Parejas';
            } else if (nearbyChessDesk) {
                interactionPrompt.style.display = 'block';
                interactionPrompt.textContent = 'Presiona E para jugar Ajedrez Social';
            } else if (nearbyComingSoon1 || nearbyComingSoon2 || nearbyComingSoon3) {
                interactionPrompt.style.display = 'block';
                interactionPrompt.textContent = 'Próximamente añadiremos más juegos';
            } else {
                interactionPrompt.style.display = 'none';
            }
        }
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
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

function iniciarJuego() {
    const introPantalla = document.getElementById('introPantalla');
    const mundo3D = document.getElementById('mundo3D');
    cambiarPantalla(introPantalla, mundo3D);

    setTimeout(() => {
        if (!scene) {
            init3DWorld();
        }
        initAudio();
    }, 600);
}

function checkDependencies() {
    if (typeof THREE === 'undefined') {
        alert('Error: Three.js no está cargado.');
        return false;
    }
    return true;
}

function init3DWorld() {
    if (!checkDependencies()) {
        return;
    }
    try {
        initWorld3D();
    } catch (error) {
        alert('Error inicializando el juego.');
    }
}

function init() {
}

window.iniciarJuego = iniciarJuego;
window.redirectToMainGame = redirectToMainGame;
window.redirectToPairsGame = redirectToPairsGame;
window.redirectToTrivia = redirectToTrivia;
window.redirectToChessGame = redirectToChessGame;
window.volverALanding = volverALanding;
window.toggleInstructionsPanel = toggleInstructionsPanel;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}



// ========== PERSONAJES ANIMADOS ==========
