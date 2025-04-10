//-- Cargar la imagen de la explosión
const explosionImg = new Image();
explosionImg.src = "assets/explosion.png";


hitIndex = 0;
let gameOver = false;

const canvas = document.getElementById("canvas");
canvas.height = 650;
canvas.width = 900;

const ctx = canvas.getContext("2d");

//-- Cargar la imagen del boss
const bossImg = new Image();
bossImg.src = "prydwen.png";

const shootSounds = [
    new Audio("sound/shoot.mp3"),
    new Audio("sound/shoot.mp3"),
    new Audio("sound/shoot.mp3")
];
let shootIndex = 0;
const hitSounds = [
    new Audio("sound/hit.mp3"),
    new Audio("sound/hit.mp3"),
    new Audio("sound/hit.mp3")
];
const victorySound = new Audio("sound/victory.mp3");

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    health: 10 // El jugador puede recibir 10 impactos antes de ser derrotado
};

//-- lista de disparos
const bullets = [];
//-- lista de explosiones
const explosions = [];
const bossBullets = [];

//-- Definición de Boss
const boss = {
    x: canvas.width / 2 - 75,
    y: 100,
    width: 280,
    height: 180,
    health: 500,
    alive: true,
    damageTimer: 0, // Temporizador de daño recibido
    dx: 2, // velocidad horizontal
    dy: 0.5 // velociadad horizontal
};

let victory = false;

function drawPlayer() {
    ctx.fillStyle = "white";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlayerHealthBar() {
    const barWidth = 100;
    const barHeight = 10;
    const x = 20;
    const y = canvas.height - barHeight - 20;

    const healthRatio = player.health / 10; // Suponiendo 10 impactos totales

    ctx.fillStyle = "gray";
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = "green";
    ctx.fillRect(x, y, barWidth * healthRatio, barHeight);

    ctx.strokeStyle = "white";
    ctx.strokeRect(x, y, barWidth, barHeight);
}


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

function drawBossBullets() {
    ctx.fillStyle = "purple";
    bossBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
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
            bossBullets.splice(index, 1);
            player.health--; // Reducir la salud del jugador
            if (player.health <= 0) {
                gameOver = true;
            }
        }
    });
}

function drawGameOver() {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("¡Game Over!", canvas.width / 2 - 100, canvas.height / 2);
}

//-- funcion para dibujar el Boss
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

//-- funcion para dibujar la barra de vida del boss
function drawBossHealthBar() {
    if (!boss.alive) return;
    const barWidth = 200;
    const barHeight = 20;
    const x = canvas.width - barWidth - 20;
    const y = 20;

    const healthRatio = boss.health / 500; // suponiendo 10 impactos totales

    ctx.fillStyle = "gray";
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = "red";
    ctx.fillRect(x, y, barWidth * healthRatio, barHeight);

    ctx.strokeStyle = "white";
    ctx.strokeRect(x, y, barWidth, barHeight);
}

function drawBullets() {
    ctx.fillStyle = "red";
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) bullets.splice(index, 1);
    });
}

//-- funcion para gestionar colisiones entre balas y el boss
function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        if (boss.alive &&
            bullet.x < boss.x + boss.width &&
            bullet.x + bullet.width > boss.x &&
            bullet.y < boss.y + boss.height &&
            bullet.y + bullet.height > boss.y) {
            bullets.splice(bIndex, 1);
            boss.health--; // restamos vida al boss
            
            explosions.push({ //añadimos la explosión a la lista de explosiones
                x: bullet.x - 20, // centramos un poco la explosión
                y: bullet.y - 20,
                width: 40,
                height: 40,
                timer: 10
            });

            boss.damageTimer = 10;// poner en marcha el temporizador de daño
            hitSounds[hitIndex].currentTime = 0;
            hitSounds[hitIndex].play();
            hitIndex = (hitIndex + 1) % hitSounds.length;
            if (boss.health <= 0) {
                boss.alive = false;
                victory = true;
                crearTracaFinal(); // crear la traca final
                victorySound.play();
            }
        }
    });
}

//-- funcion para crear la traca final Boss
function crearTracaFinal() {
    const numExplosiones = 12;

    for (let i = 0; i < numExplosiones; i++) {
        const delay = i * 100; // separamos en el tiempo

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

//-- funcion para disparar balas
function shoot() {
    bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10, speed: 5 });
    shootSounds[shootIndex].currentTime = 0;
    shootSounds[shootIndex].play();
    shootIndex = (shootIndex + 1) % shootSounds.length;
}

//-- funcion para dibujar explosiones
function drawExplosions() {
    explosions.forEach((explosion, index) => {
        ctx.drawImage(explosionImg, explosion.x, explosion.y, explosion.width, explosion.height);
        explosion.timer--;
        if (explosion.timer <= 0) {
            explosions.splice(index, 1);
        }
    });
}

function drawVictory() {
    ctx.fillStyle = "green";
    ctx.font = "40px Arial";
    ctx.fillText("¡Victoria!", canvas.width / 2 - 80, canvas.height / 2);
}

function update() {
    if (!victory && !gameOver) {
        player.x += player.dx;
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
        moveBullets();
        moveBoss();
        moveBossBullets();
        checkCollisions();
        checkBossBulletCollisions();
    }
    draw();
    requestAnimationFrame(update);
}


function moveBoss() {
    if (!boss.alive || gameOver) return;

    boss.x += boss.dx;
    boss.y += boss.dy;

    // Rebote en bordes
    if (boss.x <= 0 || boss.x + boss.width >= canvas.width) {
        boss.dx *= -1;
    }
    if (boss.y <= 50 || boss.y + boss.height >= canvas.height / 2) {
        boss.dy *= -1;
    }

    // Cambio aleatorio de dirección
    if (Math.random() < 0.01) boss.dx *= -1;
    if (Math.random() < 0.01) boss.dy *= -1;
}


function update() {
    if (!victory) {
        player.x += player.dx;
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
        moveBullets();
        moveBossBullets();
        checkCollisions();
        checkBossBulletCollisions();
        moveBoss();
    }
    draw();
    drawBossBullets();
    requestAnimationFrame(update);

}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBoss();
    drawBossHealthBar();
    drawExplosions();
    drawBullets();
    drawBossBullets();
    drawPlayerHealthBar(); // Dibujar la barra de salud del jugador
    if (victory) {
        drawVictory();
    } else if (gameOver) {
        drawGameOver();
    }
}
setInterval(bossShoot, 1000); // El jefe disparará cada 2 segundos
document.addEventListener("keydown", (e) => {
    if (!gameOver) {
        if (e.key === "ArrowLeft") player.dx = -player.speed;
        if (e.key === "ArrowRight") player.dx = player.speed;
        if (e.key === " ") shoot();
    }
});
document.addEventListener("keyup", (e) => {
    if (!gameOver) {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") player.dx = 0;
    }
});

const mensaje = document.createElement("div");
mensaje.innerText = "La Hermandad del Acero fueron los que trajeron a la horda de monstruos para debilitarnos y ahora vienen con su Prydwen. ¡No podemos dejar que se salgan con la suya!";
mensaje.style.position = "absolute";
mensaje.style.top = "50%";
mensaje.style.left = "50%";
mensaje.style.transform = "translate(-50%, -50%)";
mensaje.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
mensaje.style.color = "white";
mensaje.style.padding = "20px";
mensaje.style.borderRadius = "10px";
mensaje.style.textAlign = "center";
mensaje.style.zIndex = "1000";
document.body.appendChild(mensaje);
update();