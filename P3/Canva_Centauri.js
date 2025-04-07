
const canvas = document.getElementById("canvas");
canvas.height = 650;
canvas.width = 900;
const ctx = canvas.getContext("2d");

// Variables del protagonista
let x = (canvas.width - 60) / 2; // Centrado horizontalmente
let y = canvas.height - 80; // Posición inicial
let normal = false;
let infinito = false;
const anchoProta = 60, altoProta = 60;
const protaImg = new Image();
protaImg.src = "servo.png"; // Imagen del protagonista

// Variables de los enemigos
let em1x = 130, em1y = 60;
let puntuaje = 0;
let velocidad_movimiento = 9;
let velocidad_disparo = 10;
let velocidad_enemigos = 3;
let puedeDisparar = true;
let enemigosLista = [];
const filas = 3, columnas = 9;
const ancho = 60, alto = 60;
const separacionX = 70, separacionY = 40;
let moviendoEnemigos = false;
let bajar = false;
let iniciado = false;
const imagenes = {
    mutaracha: "mutaracha.webp",
    mirelurk: "Mirelurk.webp",
    sanginario: "sanginario.webp"
};
const imagenesCargadas = {}; // Para precargar imágenes

// Precargar imágenes
function precargarImagenes() {
    for (let key in imagenes) {
        const img = new Image();
        img.src = imagenes[key];
        imagenesCargadas[key] = img;
    }
}
precargarImagenes();

// Función para generar enemigos
function generarEnemigos() {
    enemigosLista = [];
    for (let fila = 0; fila < filas; fila++) {
        for (let columna = 0; columna < columnas; columna++) {
            let x = em1x + columna * separacionX;
            let y = em1y + fila * separacionY;
            let tipoEnemigo = fila === 0 ? "sanginario" : fila === 1 ? "mirelurk" :"mutaracha";
            enemigosLista.push({ x, y, ancho, alto, imagen: tipoEnemigo });
        }
    }
}

// Dibujar enemigos
function dibujarEnemigos() {
    enemigosLista.forEach((enemigo) => {
        const img = imagenesCargadas[enemigo.imagen];
        if (img.complete) {
            ctx.drawImage(img, enemigo.x, enemigo.y, enemigo.ancho, enemigo.alto);
        }
    });
}

// Función para mover los enemigos
function moverse_enemigos() {
    // Filtrar solo los enemigos que no han sido eliminados
    let enemigosVivos = enemigosLista.filter(enemigo => !enemigo.eliminado);
    
    // Si ya se han eliminado todos, ganaste
    if (enemigosVivos.length === 0) {
        if (infinito == true) {
            alert("¡Felicidades! Has eliminado a todos los enemigos. ¡Nivel Completo!");
            velocidad_enemigos += 0.5; // Aumentar la velocidad de los enemigos
            // filas += 1; // Aumentar el número de filas
            iniciado = false; // Reiniciar el juego
            infinitoJuego();
            return;
        }  
        if (normal == true) {
            alert("¡Felicidades! Has eliminado a todos los enemigos.");
            finalizarPartida();
            moviendoEnemigos = false; // Detener el movimiento de enemigos
            normales = false;
        return;
        } 

    }

    // Calcular la posición más baja de los enemigos vivos
    let alturaMasBaja = Math.max(...enemigosVivos.map(enemigo => enemigo.y + enemigo.alto));
    
    if (alturaMasBaja >= canvas.height - 70) { // Ajusta el umbral según tus necesidades
        alert("Game Over! Los enemigos han llegado al fondo.");
        finalizarPartida();
        moviendoEnemigos = false; // Detener el movimiento de enemigos
        normales = false;
        infinito = false;
        return;
    }

    // Cambiar dirección si llegan a los bordes
    if (em1x + columnas * separacionX >= canvas.width || em1x <= 0) {
        velocidad_enemigos = -velocidad_enemigos;
        bajar = true;
        em1y += 10;
    }

    em1x += velocidad_enemigos;

    // Borrar solo las áreas de los enemigos
    enemigosLista.forEach((enemigo) => {
        ctx.clearRect(enemigo.x, enemigo.y, enemigo.ancho, enemigo.alto);
    });

    // Mover y redibujar los enemigos
    enemigosLista.forEach((enemigo) => {
        enemigo.x += velocidad_enemigos;
        if (bajar) enemigo.y += 10;
        const img = imagenesCargadas[enemigo.imagen];
        if (img.complete) {
            ctx.drawImage(img, enemigo.x, enemigo.y, enemigo.ancho, enemigo.alto);
        }
    });

    bajar = false;

    if (iniciado) {
        requestAnimationFrame(moverse_enemigos); // Continuar moviendo solo si el juego está iniciado
    }
}

// Dibujar al protagonista
function dibujarProtagonista() {
    ctx.clearRect(x, y, anchoProta, altoProta);
    ctx.drawImage(protaImg, x, y, anchoProta, altoProta);
}

// Función para iniciar el juego
function iniciarJuego() {
    if (iniciado == false) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dibujarProtagonista();
        generarEnemigos();
        dibujarEnemigos();
        iniciado = true;
        normal = true;
        if (!moviendoEnemigos) {
            moviendoEnemigos = true;
            moverse_enemigos();
        }
    }
}

// Función para reiniciar el juego
function reiniciarJuego() {
    puntuaje = 0;
    document.getElementById("puntuacion").innerHTML = puntuaje + " pts";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    x = (canvas.width - 60) / 2;
    y = canvas.height - 80;
    em1x = 130;
    em1y = 60;
    enemigosLista = [];
    puedeDisparar = true;
    iniciado = false;
    iniciarJuego();
}

function infinitoJuego() {
    if (iniciado == false) {
        em1x = 130;
        em1y = 60;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dibujarProtagonista();
        generarEnemigos();
        dibujarEnemigos();
        iniciado = true;
        infinito = true;
        moviendoEnemigos = false; 
        if (!moviendoEnemigos) {
            moviendoEnemigos = true;
            moverse_enemigos();
        }
    }
}

document.getElementById("btnIniciar").addEventListener("click", iniciarJuego);
document.getElementById("btnInfinito").addEventListener("click", infinitoJuego);
document.getElementById("btnReiniciar").addEventListener("click", reiniciarJuego);


document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowRight") {
        if (x < canvas.width - anchoProta) x += velocidad_movimiento;
    } else if (event.key === "ArrowLeft") {
        if (x > 0) x -= velocidad_movimiento;
    } else if (event.key === "ArrowUp" && puedeDisparar) {
        dispararProyectil();
    }
    dibujarProtagonista();
});
// Variables del disparo

// Variables de la habilidad especial
let habilidadUsada = false;
let rayoActivo = false;
let rayoX, rayoY;

// Función para activar el rayo especial
// function activarRayo() {
//     if (habilidadUsada || rayoActivo) return; // Solo se puede usar una vez
//     habilidadUsada = true;
//     rayoActivo = true;
//     rayoX = x + anchoProta / 2 - 5; // Centrar el rayo en el protagonista
//     rayoY = 0; // Empieza desde la parte superior

//     let sonido_rayo = new Audio("rayo-laser.mp3");
//     sonido_rayo.play();

//     // Mover el rayo hacia abajo
//     function moverRayo() {
//         ctx.clearRect(rayoX, 0, 10, canvas.height); // Limpiar el rayo anterior
//         ctx.fillStyle = "cyan";
//         ctx.fillRect(rayoX, 0, 10, canvas.height); // Dibujar el rayo

//         // Verificar colisión con enemigos
//         for (let i = 0; i < enemigosLista.length; i++) {
//             let enemigo = enemigosLista[i];
//             if (rayoX < enemigo.x + enemigo.ancho &&
//                 rayoX + 10 > enemigo.x) {
//                 // Eliminar al enemigo si está en la trayectoria del rayo
//                 ctx.clearRect(enemigo.x, enemigo.y, enemigo.ancho, enemigo.alto);
//                 enemigosLista.splice(i, 1);
//                 puntuaje += 500;
//                 document.getElementById("puntuacion").innerHTML = puntuaje + " pts";
//                 i--; // Ajustar índice tras eliminación
//             }
//         }

//         // Desactivar el rayo después de cierto tiempo
//         setTimeout(() => {
//             rayoActivo = false;
//             ctx.clearRect(rayoX, 0, 10, canvas.height); // Borrar el rayo después de su uso
//         }, 1000);
//     }

//     // Ejecutar la animación del rayo
//     const interval = setInterval(() => {
//         moverRayo();
//         if (!rayoActivo) clearInterval(interval); // Detener el intervalo cuando el rayo se desactiva
//     }, 50);
// }

// Evento para activar la habilidad especial con la tecla "Abajo"
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowDown") {
        activarRayo();
    }
});

const controles = document.getElementById("btnControles");
controles.addEventListener("click", () => {
    if (window.innerWidth <= 768) { // Umbral para considerar dispositivos móviles
        alert(`Controles para móvil:\n- Mover: Botones táctiles\n- Disparar: Botón táctil de disparo\n- Habilidad Especial: Botón táctil especial`);
    } else {
        alert(`Controles:\n- Mover: Flechas Izquierda y Derecha\n- Disparar: Flecha Arriba\n- Habilidad Especial: Flecha Abajo`);
    }
});

let proyectiles = [];

function dispararProyectil() {
    if (!puedeDisparar) return;
    
    puedeDisparar = false;
    let nuevoProyectil = {
        x: x + anchoProta / 2 - 2,
        y: y,
        ancho: 4,
        alto: 10,
        velocidad: 5
    };
    
    proyectiles.push(nuevoProyectil);
    let sonido_disparo = new Audio("laser-312360.mp3");
    sonido_disparo.play();

    setTimeout(() => {
        puedeDisparar = true;
    }, 1200); // Permitir otro disparo después de 300ms
}

// Dibujar proyectiles en pantalla
function dibujarProyectiles() {
    ctx.fillStyle = "yellow";
    proyectiles.forEach((proyectil) => {
        ctx.fillRect(proyectil.x, proyectil.y, proyectil.ancho, proyectil.alto);
    });
}

// Mover proyectiles y detectar colisiones
function moverProyectiles() {
    for (let i = 0; i < proyectiles.length; i++) {
        let proyectil = proyectiles[i];
        proyectil.y -= proyectil.velocidad;

        // Verificar colisión con enemigos
        for (let j = 0; j < enemigosLista.length; j++) {
            let enemigo = enemigosLista[j];
            if (
                proyectil.x < enemigo.x + enemigo.ancho &&
                proyectil.x + proyectil.ancho > enemigo.x &&
                proyectil.y < enemigo.y + enemigo.alto &&
                proyectil.y + proyectil.alto > enemigo.y
            ) {
                ctx.clearRect(enemigo.x, enemigo.y, enemigo.ancho, enemigo.alto);
                enemigosLista.splice(j, 1); // Eliminar enemigo
                proyectiles.splice(i, 1); // Eliminar proyectil
                puntuaje += 400;
                document.getElementById("puntuacion").innerHTML = puntuaje + " pts";
                let sonido_derribo = new Audio("cartoon-splat-310479.mp3");
                sonido_derribo.play();
                return;
            }
        }

        // Eliminar proyectil si sale de la pantalla
        if (proyectil.y < 0) {
            proyectiles.splice(i, 1);
        }
    }
}

// Actualizar el canvas continuamente
function actualizarCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarProtagonista();
    dibujarEnemigos();
    dibujarProyectiles();
    moverProyectiles();
    requestAnimationFrame(actualizarCanvas);
}

// Evento de disparo con la tecla "Arriba"
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp") {
        dispararProyectil();
    }
});

// Iniciar el bucle de actualización
actualizarCanvas();
