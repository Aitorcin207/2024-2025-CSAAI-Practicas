// ------------------------------------
// CARGA DE IMÁGENES Y VARIABLES INICIALES
// ------------------------------------

// Cargar imagen de la explosión
const explosionImg = new Image();
explosionImg.src = "assets/explosion.png";

// Cargar imagen del boss (jefe)
const bossImg = new Image();
bossImg.src = "prydwen.png";

// Sonidos para disparos y golpes
const shootSounds = [
    new Audio("laser-312360.mp3"),
    new Audio("laser-312360.mp3"),
    new Audio("laser-312360.mp3")
];
let shootIndex = 0;
const hitSounds = [
    new Audio("sound/hitted.mp3"),
    new Audio("sound/hitted.mp3"),
    new Audio("sound/hitted.mp3")
];
let hitIndex = 0;
const victorySound = new Audio("sound/victory.mp3");

let gameOver = false;
let victory = false;

// Variables adicionales para el jugador (control, disparo y habilidad especial)
let funcional = true;      // Si el juego está activo para el jugador
let puedeDisparar = true;  // Para limitar la cadencia de disparos
let habilidadUsada = false;
let rondasTranscurridas = 0;  // Para recargar la habilidad especial

// Variables para controles táctiles
let moviendoIzquierda = false;
let moviendoDerecha = false;

// Obtención y configuración del canvas
const canvas = document.getElementById("canvas");
canvas.height = 650;
canvas.width = 900;
const ctx = canvas.getContext("2d");

// ------------------------------------
// OBJETOS Y VARIABLES PRINCIPALES
// ------------------------------------

// Objeto jugador
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 10,
    dx: 0,
    health: 10 // El jugador puede recibir 10 impactos
};

// Listas para disparos y explosiones
const bullets = [];
const explosions = [];
const bossBullets = [];

// Definición del jefe
const boss = {
    x: canvas.width / 2 - 75,
    y: 100,
    width: 280,
    height: 180,
    health: 30,
    alive: true,
    damageTimer: 0,
    dx: 2,
    dy: 0.5
};

// ------------------------------------
// DIBUJADOS
// ------------------------------------

function drawPlayer() {
    const playerImg = new Image();
    playerImg.src = "servo.png"; // Imagen del protagonista
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function drawPlayerHealthBar() {
    const barWidth = 100;
    const barHeight = 10;
    const x = 20;
    const y = canvas.height - barHeight - 20;
    const healthRatio = player.health / 10;
    ctx.fillStyle = "gray";
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.fillStyle = "lightyellow";
    ctx.fillRect(x, y, barWidth * healthRatio, barHeight);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x, y, barWidth, barHeight);
}

function drawBoss() {
    if (!boss.alive) return;
    ctx.drawImage(bossImg, boss.x, boss.y, boss.width, boss.height);
    if (boss.damageTimer > 0) {
        if (boss.damageTimer % 2 === 0) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
            ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
        }
        boss.damageTimer--;
    }
}

function drawBossHealthBar() {
    if (!boss.alive) return;
    const barWidth = 200;
    const barHeight = 20;
    const x = canvas.width - barWidth - 20;
    const y = 20;
    const healthRatio = boss.health / 30;
    ctx.fillStyle = "gray";
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, barWidth * healthRatio, barHeight);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x, y, barWidth, barHeight);
}

function drawBullets() {
    ctx.fillStyle = "yellow";
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function drawBossBullets() {
    ctx.fillStyle = "purple";
    bossBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function drawExplosions() {
    explosions.forEach((explosion, index) => {
        ctx.drawImage(explosionImg, explosion.x, explosion.y, explosion.width, explosion.height);
        explosion.timer--;
        if (explosion.timer <= 0) {
            explosions.splice(index, 1);
        }
    });
}

function drawGameOver() {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("¡Game Over!", canvas.width / 2 - 100, canvas.height / 2);
    const text = "Pulsa el botón Restart para reiniciar";
    const textWidth = ctx.measureText(text).width;
    ctx.fillText(text, (canvas.width - textWidth) / 2, canvas.height / 2 + 50);
    window.location.href = "https://www.youtube.com/watch?v=YFnM2idBlZU";
}

function drawVictory() {
    ctx.fillStyle = "green";
    ctx.font = "40px Arial";
    ctx.fillText("¡Victoria!", canvas.width / 2 - 80, canvas.height / 2);
    window.location.href = "https://www.youtube.com/watch?v=kAAlEoLRuTA";

}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBoss();
    drawBossHealthBar();
    drawExplosions();
    drawBullets();
    drawBossBullets();
    drawPlayerHealthBar();
    if (victory) {
        drawVictory();
    } else if (gameOver) {
        drawGameOver();
    }
}

// ------------------------------------
// MOVIMIENTO Y ACTUALIZACIÓN
// ------------------------------------

// Función para mover los proyectiles del jugador
function moveBullets() {
    // Recorremos el array al revés para evitar problemas al eliminar elementos
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
            bullets.splice(i, 1);
        }
    }
}

// Disparo del jefe: dispara cada 1 segundo
function bossShoot() {
    if (gameOver || !boss.alive) return;
    const bulletSpeed = 3;
    const bulletWidth = 5;
    const bulletHeight = 10;
    const bulletX = boss.x + boss.width / 2 - bulletWidth / 2;
    const bulletY = boss.y + boss.height;
    bossBullets.push({ x: bulletX, y: bulletY, width: bulletWidth, height: bulletHeight, speed: bulletSpeed });
}

function moveBossBullets() {
    bossBullets.forEach((bullet, index) => {
        bullet.y += bullet.speed;
        if (bullet.y > canvas.height) {
            bossBullets.splice(index, 1);
        }
    });
}

function checkBossBulletCollisions() {
    bossBullets.forEach((bullet, index) => {
        if (
            bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y
        ) {
            bossBullets.splice(index, 1); // Eliminar el disparo del jefe
            player.health--; // Reducir la salud del jugador

            // Reproducir el sonido del golpe al protagonista
            const golpeProtaSound = new Audio("golpe_prota.mp3");
            golpeProtaSound.play();

            if (player.health <= 0) {
                gameOver = true; // Terminar el juego si la salud llega a 0
            }
        }
    });
}

function moveBoss() {
    if (!boss.alive || gameOver) return;
    boss.x += boss.dx;
    boss.y += boss.dy;
    if (boss.x <= 0 || boss.x + boss.width >= canvas.width) {
        boss.dx *= -1;
    }
    if (boss.y <= 50 || boss.y + boss.height >= canvas.height / 2) {
        boss.dy *= -1;
    }
    if (Math.random() < 0.01) boss.dx *= -1;
    if (Math.random() < 0.01) boss.dy *= -1;
}

function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        if (boss.alive &&
            bullet.x < boss.x + boss.width &&
            bullet.x + bullet.width > boss.x &&
            bullet.y < boss.y + boss.height &&
            bullet.y + bullet.height > boss.y) {
            bullets.splice(bIndex, 1);
            boss.health--;
            explosions.push({
                x: bullet.x - 20,
                y: bullet.y - 20,
                width: 40,
                height: 40,
                timer: 10
            });
            boss.damageTimer = 10;
            hitSounds[hitIndex].currentTime = 0;
            hitSounds[hitIndex].play();
            hitIndex = (hitIndex + 1) % hitSounds.length;
            if (boss.health <= 0) {
                boss.alive = false;
                victory = true;
                crearTracaFinal();
                victorySound.play();
            }
        }
    });
}

function crearTracaFinal() {
    const numExplosiones = 12;
    for (let i = 0; i < numExplosiones; i++) {
        const delay = i * 100;
        setTimeout(() => {
            const offsetX = Math.random() * boss.width;
            const offsetY = Math.random() * boss.height;
            explosions.push({
                x: boss.x + offsetX - 20,
                y: boss.y + offsetY - 20,
                width: boss.width,
                height: boss.height,
                timer: 15
            });
        }, delay);
    }
}

// ------------------------------------
// DISPAROS Y HABILIDAD ESPECIAL (JUGADOR)
// ------------------------------------

function dispararProyectil() {
    if (!funcional || !puedeDisparar) return;
    puedeDisparar = false;
    // Se usa la posición del jugador para el disparo
    bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10, speed: 5 });
    shootSounds[shootIndex].currentTime = 0;
    shootSounds[shootIndex].play();
    shootIndex = (shootIndex + 1) % shootSounds.length;
    setTimeout(() => {
        puedeDisparar = true;
    }, 1200);
}

function dispararProyectilEspacial() {
    if (!funcional || !puedeDisparar) return;
    puedeDisparar = false;
    let disparosRealizados = 0;
    let intervaloDisparos = setInterval(() => {
        if (disparosRealizados >= 10) {
            clearInterval(intervaloDisparos);
            puedeDisparar = true;
            return;
        }
        bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10, speed: 5 });
        shootSounds[shootIndex].currentTime = 0;
        shootSounds[shootIndex].play();
        shootIndex = (shootIndex + 1) % shootSounds.length;
        disparosRealizados++;
    }, 100);
    let sonido_rafaga = new Audio("VATS.mp3");
    sonido_rafaga.play();
}

function activarRafaga() {
    if (habilidadUsada || !funcional) return;
    habilidadUsada = true;
    dispararProyectilEspacial();
}

function verificarRecargaHabilidad() {
    if (habilidadUsada && rondasTranscurridas >= 2) {
        habilidadUsada = false;
        rondasTranscurridas = 0;
        const mensajeRecarga = document.createElement("div");
        mensajeRecarga.innerText = "¡Habilidad especial recargada!";
        mensajeRecarga.style.position = "absolute";
        mensajeRecarga.style.top = "70%";
        mensajeRecarga.style.left = "50%";
        mensajeRecarga.style.transform = "translate(-50%, -50%)";
        mensajeRecarga.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        mensajeRecarga.style.color = "white";
        mensajeRecarga.style.padding = "20px";
        mensajeRecarga.style.borderRadius = "10px";
        mensajeRecarga.style.textAlign = "center";
        mensajeRecarga.style.zIndex = "1000";
        document.body.appendChild(mensajeRecarga);
        setTimeout(() => {
            document.body.removeChild(mensajeRecarga);
        }, 1000);
    }
}

function incrementarRonda() {
    if (habilidadUsada) {
        rondasTranscurridas++;
        verificarRecargaHabilidad();
    }
}

// ------------------------------------
// EVENTOS DE CONTROLES (TECLADO Y BOTONES)
// ------------------------------------

// Controles táctiles para movimiento
document.getElementById("btnIzquierda")?.addEventListener("mousedown", function() {
    if (!funcional) return;
    moviendoIzquierda = true;
});
document.getElementById("btnIzquierda")?.addEventListener("mouseup", function() {
    moviendoIzquierda = false;
});
document.getElementById("btnIzquierda")?.addEventListener("touchstart", function(event) {
    event.preventDefault();
    if (!funcional) return;
    moviendoIzquierda = true;
});
document.getElementById("btnIzquierda")?.addEventListener("touchend", function(event) {
    event.preventDefault();
    moviendoIzquierda = false;
});

document.getElementById("btnDerecha")?.addEventListener("mousedown", function() {
    if (!funcional) return;
    moviendoDerecha = true;
});
document.getElementById("btnDerecha")?.addEventListener("mouseup", function() {
    moviendoDerecha = false;
});
document.getElementById("btnDerecha")?.addEventListener("touchstart", function(event) {
    event.preventDefault();
    if (!funcional) return;
    moviendoDerecha = true;
});
document.getElementById("btnDerecha")?.addEventListener("touchend", function(event) {
    event.preventDefault();
    moviendoDerecha = false;
});

// Disparo y habilidad mediante botones (si existen en el HTML)
document.getElementById("btnShoot")?.addEventListener("click", function() {
    if (puedeDisparar) {
        dispararProyectil();
    }
});
document.getElementById("btnShoot")?.addEventListener("touchstart", function(event) {
    event.preventDefault();
    if (puedeDisparar) {
        dispararProyectil();
    }
});

document.getElementById("btnUlti")?.addEventListener("click", function() {
    if (funcional) {
        activarRafaga();
    }
});
document.getElementById("btnUlti")?.addEventListener("touchstart", function(event) {
    event.preventDefault();
    if (funcional) {
        activarRafaga();
    }
});

document.addEventListener("keydown", function(event) {
    if (!funcional) return;
    if (event.key === "ArrowRight") {
        player.dx = player.speed;
    } else if (event.key === "ArrowLeft") {
        player.dx = -player.speed;
    } else if (event.key === "ArrowUp" && puedeDisparar) {
        dispararProyectil();
    } else if (event.key.toLowerCase() === "s") {
        activarRafaga();
    }
});

document.addEventListener("keyup", function(event) {
    // Resetea la velocidad horizontal cuando se sueltan las flechas
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        player.dx = 0;
    }
});

// (Opcional) mensaje de controles si se pulsa el botón (si existe)
document.getElementById("btnControles")?.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
        alert(`Controles para móvil:
- Mover: Botones táctiles
- Disparar: Botón táctil
- Habilidad Especial: Botón especial (se recarga cada 2 rondas)`);
    } else {
        alert(`Controles:
- Mover: Flechas Izquierda y Derecha
- Disparar: Flecha Arriba
- Habilidad Especial: Tecla "S" (se recarga cada 2 rondas)`);
    }
});

document.getElementById("btnRestart")?.addEventListener("click", () => {
    location.reload(); // Recargar la página para reiniciar el juego

});
document.getElementById("btnVolver")?.addEventListener("click", () => {
    window.location.href = "https://aitorcin207.github.io/2024-2025-CSAAI-Practicas/P3/index.html"; // Volver a la página principal
});

// ------------------------------------
// MENSAJE INICIAL (opcional)
// ------------------------------------

const mensaje = document.createElement("div");
mensaje.innerText = "La Hermandad del Acero trajeron a la horda de monstruos para debilitarnos y ahora vienen con su Prydwen. ¡No podemos dejar que se salgan con la suya!";
mensaje.style.position = "absolute";
mensaje.style.top = "40%";
mensaje.style.left = "50%";
mensaje.style.transform = "translate(-50%, -50%)";
mensaje.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
mensaje.style.color = "white";
mensaje.style.padding = "20px";
mensaje.style.borderRadius = "10px";
mensaje.style.textAlign = "center";
mensaje.style.zIndex = "1000";
document.body.appendChild(mensaje);

setTimeout(() => {
    document.body.removeChild(mensaje);
}, 3000);


// ------------------------------------
// BUCLE DE ACTUALIZACIÓN PRINCIPAL
// ------------------------------------

function update() {
    if (!victory && !gameOver) {
        // Actualizar posición usando dx para un movimiento fluido
        player.x += player.dx;
        
        // Asegurarse de no salir del canvas
        if (player.x < 0) {
            player.x = 0;
        }
        if (player.x + player.width > canvas.width) {
            player.x = canvas.width - player.width;
        }
        
        // También procesar el movimiento de botones táctiles si existieran
        if (moviendoIzquierda && player.x > 0) {
            player.x -= player.speed * 0.5;
        }
        if (moviendoDerecha && player.x < canvas.width - player.width) {
            player.x += player.speed * 0.5;
        }
    
        // Mover los disparos del jugador, del boss, detectar colisiones, etc.
        moveBullets();
        moveBoss();
        moveBossBullets();
        checkCollisions();
        checkBossBulletCollisions();
    }
    draw();
    drawBossBullets();
    requestAnimationFrame(update);
}

// Inicia el disparo periódico del jefe
setInterval(bossShoot, 1000);


const mensajeMejora = document.createElement("div");
mensajeMejora.innerText = "Te hemos mejorado la servoarmadura para que te puedas mover más rápido y disparar más rápido. ¡No dejes que el Prydwen te alcance y acaba con la hermandad del acero!";
mensajeMejora.style.position = "absolute";
mensajeMejora.style.top = "50%";
mensajeMejora.style.left = "50%";
mensajeMejora.style.transform = "translate(-50%, -50%)";
mensajeMejora.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
mensajeMejora.style.color = "white";
mensajeMejora.style.padding = "20px";
mensajeMejora.style.borderRadius = "10px";
mensajeMejora.style.textAlign = "center";
mensajeMejora.style.zIndex = "1000";
document.body.appendChild(mensajeMejora);

setTimeout(() => {
    document.body.removeChild(mensajeMejora);
}, 3000); // Remove the message after 3 seconds
// Inicia automáticamente el juego al cargar el script
update();
