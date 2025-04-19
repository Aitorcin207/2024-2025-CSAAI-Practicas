const board = document.getElementById('gameBoard');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const sizeSelect = document.getElementById('size');
const movesDisplay = document.getElementById('moves');
const timeDisplay = document.getElementById('time');
const winMessage = document.getElementById('winMessage');
const finalMoves = document.getElementById('finalMoves');
const finalTime = document.getElementById('finalTime');
const gameModeSelect = document.getElementById('gameMode');
const flipSound = new Audio('flipcard.mp3');
var musica_fondo = new Audio('The Whims of Fate.mp3');

const images = [
  '8ball_joker.png', 'balatro_joker.png', 'blue_joker.png', 'borroso_joker.png', 'cyan_joker.png', 'egg_joker.png',
  'faceless_joker.png', 'fiestero_joker.png', 'flor_joker.png', 'gato_joker.png', 'glass_joker.png', 'hiker_joker.png',
  'imitator_joker.png', 'joker_banano.png', 'joker_credit_card.png', 'joker_ladron.png', 'misterious_joker.png', 'orange_joker.png'
];

const muerteCard = 'muerte.png';

let gameOver = false;

let size = 4;
let cards = [];
let revealedCards = [];
let matchedPairs = 0;
let totalPairs = 0;
let moves = 0;
let time = 0;
let timer;
let gameStarted = false;
let jugando = false; // Variable para controlar si el juego ha comenzado

function iniciarTemporizador(callback, limite) {
  clearInterval(timer); // Limpia cualquier temporizador anterior
  time = 0;

  if (limite !== null) {
    timeDisplay.textContent = limite - time;
  }
  else {
    timeDisplay.textContent = time;
  }
  timer = setInterval(() => {
    time++;

    if (limite !== null) {
      timeDisplay.textContent = limite - time;
    }
    else {
      timeDisplay.textContent = time;
    }

    if (limite !== null && time >= limite) {
      detenerTemporizador();
      callback();
    }
  }, 1000);
}

function detenerTemporizador() {
  clearInterval(timer);
  timer = null;
}

function startGame() {
  if (jugando) return; // Evita iniciar el juego si ya está en curso
  const contenedorTiempos = document.getElementById('mejoresTiempos');
  contenedorTiempos.style.display = 'block';
  jugando = true; // Marca que el juego ha comenzado
  size = parseInt(sizeSelect.value);
  const mode = gameModeSelect.value;
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  revealedCards = [];
  matchedPairs = 0;
  totalPairs = (size * size) / 2;
  if (mode === 'muerte') {
    totalPairs--; // Restamos 1 porque la pareja de muerte NO cuenta para ganar
  }
  moves = 0;
  time = 0;
  gameStarted = false;
  musica_fondo.play();
  musica_fondo.loop = true; // Reproduce la música de fondo en bucle
  musica_fondo.volume = 0.3; // Ajusta el volumen de la música de fondo (0.0 a 1.0)
  movesDisplay.textContent = moves;
  timeDisplay.textContent = time;
  winMessage.classList.add('hidden');
  resetBtn.disabled = false;
  sizeSelect.disabled = true;
  gameModeSelect.disabled = true;
  document.getElementById('startHint').style.display = 'none';
  document.getElementById('startHint2').style.display = 'none';
  gameOver = false;

  cards = generateCards(size, mode);
  drawBoard();

  const timeLimits = {
    normal: null,
    tiempo: { 2: 2, 4: 30, 6: 90 },
    puntos: { 2: 3, 4: 30, 6: 50 },
  };
  
  if (mode === 'tiempo' || mode === 'puntos') {
    const limit = timeLimits[mode][size];

    if (mode === 'puntos') {
      const duplicadas = cards.filter((item, index, arr) =>
        arr.indexOf(item) !== index
      );
      const cartaObjetivo = duplicadas[Math.floor(Math.random() * duplicadas.length)];
      window.cartaObjetivo = cartaObjetivo;
      mostrarCartaObjetivo(cartaObjetivo);
    }

    iniciarTemporizador(() => {
      gameOver = true;
      jugando = false;
      alert('¡Se acabó el tiempo! No encontraste la pareja.');
      resetBtn.disabled = false;
    }, limit);
  } else {
    detenerTemporizador(); // Para evitar que quede corriendo un temporizador anterior
    timeDisplay.textContent = 0;
  }
  // Mostrar los mejores tiempos al iniciar el juego
  document.getElementById('mejoresTiempos').classList.remove('hidden');
  mostrarMejoresTiempos(gameModeSelect.value, size);
}


function generateCards(size, mode) {
  const totalCards = size * size;
  const neededPairs = totalCards / 2;
  let availableImages = [...images];

  if (mode === 'muerte') {
    availableImages = availableImages.filter(img => img !== muerteCard);
    const selected = shuffle(availableImages).slice(0, neededPairs - 1);
    selected.push(muerteCard); // Solo una carta muerte (duplicada después)
    const fullDeck = [...selected, ...selected];
    return shuffle(fullDeck);
  } else {
    const selected = shuffle(availableImages).slice(0, neededPairs);
    const fullDeck = [...selected, ...selected];
    return shuffle(fullDeck);
  }
  
}

function drawBoard() {
  board.innerHTML = '';
  cards.forEach((value, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.index = index;
    card.dataset.value = value;

    const inner = document.createElement('div');
    inner.classList.add('card-inner');

    const front = document.createElement('div');
    front.classList.add('card-front');

    const back = document.createElement('div');
    back.classList.add('card-back');

    const img = document.createElement('img');
    img.src = `./${value}`;
    img.alt = '';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';

    back.appendChild(img);
    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);
    card.style.cursor = 'pointer';
    card.addEventListener('click', handleCardClick);
    board.appendChild(card);
  });
}

function handleCardClick(e) {
    
  const card = e.currentTarget;
  const index = card.dataset.index;
  if (gameOver || card.classList.contains('revealed') || card.classList.contains('matched') || revealedCards.length >= 2) return;

  if (!gameStarted && (gameModeSelect.value === 'normal' || gameModeSelect.value === 'muerte')) {
    gameStarted = true;
    iniciarTemporizador(() => {}, null); // sin límite de tiempo
  }
  card.classList.add('revealed');
  revealedCards.push(card);
    flipSound.currentTime = 0; // Reinicia el sonido al inicio
    flipSound.play(); // Reproduce el sonido al hacer clic en la carta

  if (revealedCards.length === 2) {
    const [first, second] = revealedCards;

    // Si estamos en modo "puntos" (Encontrar la pareja)
    if (gameModeSelect.value === 'puntos') {
      moves++;
      movesDisplay.textContent = moves;
      if (first.dataset.value === window.cartaObjetivo && second.dataset.value === window.cartaObjetivo) {
        clearInterval(timer);
        finalMoves.textContent = moves;
        finalTime.textContent = time;
        winMessage.classList.remove('hidden');
        resetBtn.disabled = false;
        gameOver = true;
        guardarTiempo(gameModeSelect.value, time, size);
      } else {
        setTimeout(() => {
          first.classList.remove('revealed');
          second.classList.remove('revealed');
          revealedCards = [];
        }, 800);
      }
      return; // Salimos para no seguir con la lógica normal
    }

    // Revisa muerte
    if (first.dataset.value === muerteCard && second.dataset.value === muerteCard && gameModeSelect.value === 'muerte') {
      clearInterval(timer);
      setTimeout(() => {
        alert('¡Has emparejado las cartas de la muerte! Has perdido.');
        resetBtn.disabled = false;
        gameOver = true;
      }, 300);
      return;
    }

    moves++;
    movesDisplay.textContent = moves;

    if (first.dataset.value === second.dataset.value) {
      first.classList.add('matched');
      second.classList.add('matched');
      matchedPairs++;
      revealedCards = [];

      if (matchedPairs === totalPairs) {
        clearInterval(timer);
      
        // Verificamos si NO se ha emparejado la carta de muerte (porque si sí, se pierde)
        const matchedDeath = document.querySelectorAll(`.card.matched[data-value="${muerteCard}"]`).length;
        if (gameModeSelect.value === 'muerte' && matchedDeath === 2) {
          alert('¡Has emparejado las cartas de la muerte! Has perdido.');
          resetBtn.disabled = false;
          return;
        }
      
        finalMoves.textContent = moves;
        finalTime.textContent = time;
        winMessage.classList.remove('hidden');
        resetBtn.disabled = false;
        gameOver = true;
        // alert('¡Felicidades! Has ganado el juego.');
        // Guardar el tiempo en los mejores tiempos
        guardarTiempo(gameModeSelect.value, time, size, moves);

      }
      
    } else {
      setTimeout(() => {
        first.classList.remove('revealed');
        second.classList.remove('revealed');
        flipSound.currentTime = 0; // Reinicia el sonido al inicio
        flipSound.play(); // Reproduce el sonido al hacer clic en la carta
        revealedCards = [];
      }, 800);
    }
  }
}

function resetGame() {
  clearInterval(timer);
  const contenedorTiempos = document.getElementById('mejoresTiempos');
  contenedorTiempos.style.display = 'none';
  gameStarted = false;
  sizeSelect.disabled = false;
  gameModeSelect.disabled = false;
  board.innerHTML = ''; // Limpia el tablero
  movesDisplay.textContent = 0;
  timeDisplay.textContent = 0;
  winMessage.classList.add('hidden');
  document.getElementById('startHint').style.display = 'block';
  document.getElementById('startHint2').style.display = 'block';
  gameOver = false;
  musica_fondo.pause(); // Detiene la música de fondo
  musica_fondo.currentTime = 0; // Reinicia la música de fondo
  jugando = false; // Reinicia la variable de control del juego

  // Ocultar los mejores tiempos
  document.getElementById('mejoresTiempos').classList.add('hidden');

  const objetivo = document.querySelector('.objetivo');
if (objetivo) objetivo.remove();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

document.addEventListener('dragstart', function(event) {
  event.preventDefault();
});

function mostrarCartaObjetivo(valor) {
  const contenedor = document.createElement('div');
  contenedor.classList.add('objetivo');
  contenedor.innerHTML = `
    <p class="objetivo-texto">Encuentra la pareja de esta carta:</p>
    <img src="./${valor}" alt="Carta objetivo" class="objetivo-imagen">
  `;
  document.body.insertBefore(contenedor, board);

  // Eliminar la carta objetivo tras 2 segundos
  setTimeout(() => {
    contenedor.remove();
  }, 2000);
}

function guardarTiempo(modo, tiempo, size, movimientos) {
  const clave = 'mejoresTiempos';
  const datos = JSON.parse(sessionStorage.getItem(clave)) || {};
  const ahora = new Date();
  const fecha = ahora.toLocaleString('es-ES', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });

  const modoYSize = `${modo}-${size}`;

  if (!datos[modoYSize]) {
    datos[modoYSize] = [];
  }

  datos[modoYSize].push({ tiempo, movimientos, fecha });

  // Ordenar por tiempo ascendente y mantener solo los 10 mejores
  datos[modoYSize].sort((a, b) => a.tiempo - b.tiempo);
  datos[modoYSize] = datos[modoYSize].slice(0, 10);

  sessionStorage.setItem(clave, JSON.stringify(datos));
}

function mostrarMejoresTiempos(modo, size) {
  const clave = 'mejoresTiempos';
  const datos = JSON.parse(sessionStorage.getItem(clave)) || {};
  const modoYSize = `${modo}-${size}`;
  const tiempos = datos[modoYSize] || [];

  // Ordenar por tiempo ascendente y, en caso de empate, por movimientos ascendente
  tiempos.sort((a, b) => {
    if (a.tiempo === b.tiempo) {
      return a.movimientos - b.movimientos;
    }
    return a.tiempo - b.tiempo;
  });

  const contenedor = document.getElementById('mejoresTiempos');
  if (contenedor) {
    contenedor.innerHTML = `<h3>🏆 Mejores tiempos para ${modo} (${size}):</h3>`;
    const lista = document.createElement('ul');
    tiempos.forEach((registro, index) => {
      const item = document.createElement('li');
      item.textContent = `${index + 1}. ${registro.tiempo.toFixed(2)} segundos, ${registro.movimientos} movimientos - ${registro.fecha}`;
      lista.appendChild(item);
    });
    contenedor.appendChild(lista);
  } else {
    console.log(`🏆 Mejores tiempos para ${modo} (${size}):`);
    tiempos.forEach((registro, index) => {
      console.log(`${index + 1}. ${registro.tiempo.toFixed(2)} segundos, ${registro.movimientos} movimientos - ${registro.fecha}`);
    });
  }
}


startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
