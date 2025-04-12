
var audio_fondo = new Audio("Emi Meyer - For Whom the Bell Tolls (From Blue Eye Samurai).mp3");
var audio_gameover = new Audio("game-over.mp3");
var audio_nojuego = new Audio("I Dont Want To Set The World On Fire-The Ink Spots.mp3");
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
let bonusActivo = false; // Variable para controlar el estado del bonus
let velocidad_movimiento = 9;
let velocidad_disparo = 10;
let velocidad_enemigos = 3;
let puedeDisparar = true;
let enemigosLista = [];
let velocidad_bonus = 8;
let funcional = false;
const filas = 3, columnas = 9;
const ancho = 60, alto = 60;
const separacionX = 70, separacionY = 40;
let moviendoEnemigos = false;
let bajar = false;
let iniciado = false;
const imagenes = {
    mutaracha: "mutaracha.webp",
    mirelurk: "Mirelurk.webp",
    sanginario: "sanginario.webp",
    irradiado: "irradiado.webp",
    bonus: "bonus.png",
    mutascorpio: "mutascorpio.png",
    reina_mirelurk: "reina-mirelurk.webp",
    nukalurk: "nukalurk.webp",
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
            let tipoEnemigo;
            if (fila === 0) {
                tipoEnemigo = columna % 2 === 0 ? "sanginario" : "reina_mirelurk";
            } else if (fila === 1) {
                tipoEnemigo = columna % 2 === 0 ? "mirelurk" : "irradiado";
            } else {
                tipoEnemigo = columna % 2 === 0 ? "mutaracha" : "mutascorpio";
            }
            enemigosLista.push({ x, y, ancho, alto, imagen: tipoEnemigo });
        }
    }
}

let bonusx = 0; // Posición inicial del bonus
let bonusy = 0; // Posición inicial del bonus
let bonusAnimationFrame; 
function iniciarBonus() {
    function animarBonus() {
        if (!bonusActivo) {
            cancelAnimationFrame(bonusAnimationFrame); // Stop the animation if bonus is inactive
            return;
        }
        bonus();
        bonusAnimationFrame = requestAnimationFrame(animarBonus); // Continue animating the bonus
    }

    function mostrarBonus() {
        if (iniciado && enemigosLista.length > 0) { // Solo activar el bonus si hay enemigos vivos
            bonusActivo = true; // Activar el bonus
            animarBonus(); // Iniciar la animación del bonus
            setTimeout(() => {
                bonusActivo = false; // Desactivar el bonus después de 2 segundos
            }, 2000);
        }
    }
    bonusInterval = setInterval(mostrarBonus, Math.random() * (30000 - 15000) + 15000); // Every 15-30 seconds
}

function bonus() {
    if (bonusActivo) {
        //-- Algoritmo de animación:
        //-- 1) Actualizar posición del elemento
        //-- (física del movimiento rectilíneo uniforme)
        bonusx = bonusx + velocidad_bonus;

        // Reset bonus position if it moves out of the canvas
        if (bonusx > canvas.width) {
            bonusx = 0;
        }

        //-- 2) Borrar la línea del bonus
        ctx.clearRect(bonusx, bonusy, 60, 60);

        //-- 3) Dibujar los elementos visibles
        const nukalurkImg = imagenesCargadas["nukalurk"];
        if (nukalurkImg.complete) {
            ctx.drawImage(nukalurkImg, bonusx, bonusy, 60, 60);
        }

        //-- 4) Detectar colisión con proyectiles
        for (let i = 0; i < proyectiles.length; i++) {
            let proyectil = proyectiles[i];
            if (
                proyectil.x < bonusx + 60 &&
                proyectil.x + proyectil.ancho > bonusx &&
                proyectil.y < bonusy + 60 &&
                proyectil.y + proyectil.alto > bonusy
            ) {
                // Eliminar el bonus y el proyectil
                ctx.clearRect(bonusx, bonusy, 60, 60);
                proyectiles.splice(i, 1);
                bonusActivo = false;

                // Otorgar puntos
                puntuaje += 5000;
                document.getElementById("puntuacion").innerHTML = puntuaje + " pts";

                // Reproducir sonido de bonus
                let sonido_bonus = new Audio("bonus-sound.mp3");
                sonido_bonus.play();

                break;
            }
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
        bonusActivo = false; // Desactivar el bonus si no hay enemigos vivos
        cancelAnimationFrame(bonusAnimationFrame); // Cancelar la animación del bonus
        clearInterval(bonusInterval); // Limpiar el intervalo del bonus
        ctx.clearRect(bonusx, bonusy, 60, 60); // Limpiar el área del bonus
        
        if (infinito == true) {
            audio_fondo.pause();
            const mensajenivel = document.createElement("div");
            mensajenivel.innerText = "¡Felicidades! Has eliminado a todos los enemigos. ¡Nivel Completo!";
            mensajenivel.style.position = "absolute";
            mensajenivel.style.top = "50%";
            mensajenivel.style.left = "50%";
            mensajenivel.style.transform = "translate(-50%, -50%)";
            mensajenivel.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
            mensajenivel.style.color = "white";
            mensajenivel.style.padding = "20px";
            mensajenivel.style.borderRadius = "10px";
            mensajenivel.style.textAlign = "center";
            mensajenivel.style.zIndex = "1000";
            document.body.appendChild(mensajenivel);

            setTimeout(() => {
            document.body.removeChild(mensajenivel);
            }, 3000); // Remove the message after 3 seconds

            velocidad_enemigos += 2.3; // Aumentar la velocidad de los enemigos
            velocidad_disparo -= 0.5;
            iniciado = false; // Reiniciar el juego
            incrementarRonda(); // Incrementar la ronda para recargar la habilidad
            infinitoJuego();

            return;
        }
        // Si el juego es normal y todos los enemigos han sido eliminados
        if (normal == true) {
            audio_fondo.pause();
            audio_fondo.currentTime = 0; // Reiniciar el audio al inicio


            moviendoEnemigos = false; // Detener el movimiento de enemigos
            normal = false;
            funcional = false; // Desactivar la funcionalidad del juego
            audio_nojuego.play(); // Reiniciar el audio de fondo del menú
            // Repetir el audio de fondo
            const mensajenormal = document.createElement("div");
            mensajenormal.innerText = "Genial toda la horda de monstruos ha sido derrotada gracias a ti. Prepárate para enfrentarte al jefe final.";
            mensajenormal.style.position = "absolute";
            mensajenormal.style.top = "50%";
            mensajenormal.style.left = "50%";
            mensajenormal.style.transform = "translate(-50%, -50%)";
            mensajenormal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
            mensajenormal.style.color = "white";
            mensajenormal.style.padding = "20px";
            mensajenormal.style.borderRadius = "10px";
            mensajenormal.style.textAlign = "center";
            mensajenormal.style.zIndex = "1000";
            document.body.appendChild(mensajenormal);

            setTimeout(() => {
                document.body.removeChild(mensajenormal);
            }, 3000); // Remove the message after 3 seconds

            setTimeout(() => {
                window.location.href = "https://aitorcin207.github.io/2024-2025-CSAAI-Practicas/P3/boss_canva.html";
            }, 3000); // Wait for 3 seconds before redirecting

            finalizarPartida();
            clearInterval(cronometroIntervalo);
            return; // Salir de la función para evitar continuar el bucle
            // Redirigir a la página del jefe final

        }

    }

    // Calcular la posición más baja de los enemigos vivos
    let alturaMasBaja = Math.max(...enemigosVivos.map(enemigo => enemigo.y + enemigo.alto));
    if (alturaMasBaja >= canvas.height - 70) { // Ajusta el umbral según tus necesidades
        alert("Los monstruos han conseguido entrar en el refugio y han hecho una matanza :(.");
        finalizarPartida();
        cancelAnimationFrame(bonusAnimationFrame); // Cancelar la animación del bonus
        clearInterval(bonusInterval);
        moviendoEnemigos = false; // Detener el movimiento de enemigos
        normal = false;
        infinito = false;
        funcional = false;
        audio_fondo.pause();
        audio_gameover.play();
        audio_gameover.onended = () => {
            audio_nojuego.play(); // Reiniciar el audio de fondo del menú
        };
        audio_nojuego.loop = true; // Repetir el audio de fondo
        audio_fondo.currentTime = 0; // Reiniciar el audio al inicio

        // Detener el cronómetro
        clearInterval(cronometroIntervalo);

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
    if (iniciado == true) {
        ctx.clearRect(x, y, anchoProta, altoProta);
        ctx.drawImage(protaImg, x, y, anchoProta, altoProta);
    }
}

// Función para iniciar el juego
function iniciarJuego() {
    if (iniciado == false) {
        audio_nojuego.pause(); // Detener el audio de fondo del menú
        audio_nojuego.currentTime = 0; // Reiniciar el audio al inicio
        audio_fondo.play();
        audio_fondo.loop = true;
        
        funcional = true;
        velocidad_disparo = 10;
        velocidad_enemigos = 3;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dibujarProtagonista();
        generarEnemigos();
        dibujarEnemigos();
        iniciarBonus();
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
    if (iniciado == true) {
        audio_nojuego.pause(); // Detener el audio de fondo del menú
        audio_nojuego.currentTime = 0; // Reiniciar el audio al inicio
        cancelAnimationFrame(bonusAnimationFrame); // Cancelar la animación del bonus
        clearInterval(bonusInterval);
        velocidad_disparo = 10;
        velocidad_enemigos = 3;
        puntuaje = 0;
        habilidadUsada = false;
        funcional = true;
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
}

function infinitoJuego() {
    if (iniciado == false) {
        audio_nojuego.pause(); // Detener el audio de fondo del menú
        audio_nojuego.currentTime = 0; // Reiniciar el audio al inicio
        audio_fondo.play();
        audio_fondo.loop = true;
        
        funcional = true;
        em1x = 130;
        em1y = 60;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dibujarProtagonista();
        generarEnemigos();
        dibujarEnemigos();
        iniciarBonus();
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



let moviendoIzquierda = false;
let moviendoDerecha = false;

document.getElementById("btnIzquierda").addEventListener("mousedown", function() {
    if (funcional == false) return;
    moviendoIzquierda = true;
});
document.getElementById("btnIzquierda").addEventListener("mouseup", function() {
    moviendoIzquierda = false;
});
document.getElementById("btnIzquierda").addEventListener("touchstart", function(event) {
    event.preventDefault(); // Evitar comportamiento predeterminado en móviles
    if (funcional == false) return;
    moviendoIzquierda = true;
});
document.getElementById("btnIzquierda").addEventListener("touchend", function(event) {
    event.preventDefault();
    moviendoIzquierda = false;
});

document.getElementById("btnDerecha").addEventListener("mousedown", function() {
    if (funcional == false) return;
    moviendoDerecha = true;
});
document.getElementById("btnDerecha").addEventListener("mouseup", function() {
    moviendoDerecha = false;
});
document.getElementById("btnDerecha").addEventListener("touchstart", function(event) {
    event.preventDefault();
    if (funcional == false) return;
    moviendoDerecha = true;
});
document.getElementById("btnDerecha").addEventListener("touchend", function(event) {
    event.preventDefault();
    moviendoDerecha = false;
});

document.getElementById("btnShoot").addEventListener("click", function() {
    if (puedeDisparar) {
        dispararProyectil();
    }
});
document.getElementById("btnShoot").addEventListener("touchstart", function(event) {
    event.preventDefault();
    if (puedeDisparar) {
        dispararProyectil();
    }
});

document.getElementById("btnUlti").addEventListener("click", function() {
    if (funcional) {
        activarRafaga();
    }
});
document.getElementById("btnUlti").addEventListener("touchstart", function(event) {
    event.preventDefault();
    if (funcional) {
        activarRafaga();
    }
});

// Actualizar movimiento continuo con velocidad reducida
function actualizarMovimiento() {
    if (moviendoIzquierda && x > 0) {
        x -= velocidad_movimiento * 0.5; // Reducir la velocidad a la mitad
        dibujarProtagonista();
    }
    if (moviendoDerecha && x < canvas.width - anchoProta) {
        x += velocidad_movimiento * 0.5; // Reducir la velocidad a la mitad
        dibujarProtagonista();
    }
    requestAnimationFrame(actualizarMovimiento);
}

// Iniciar el bucle de movimiento continuo
actualizarMovimiento();


document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowRight" && funcional) {
        if (x < canvas.width - anchoProta) x += velocidad_movimiento;
    } else if (event.key === "ArrowLeft" && funcional) {
        if (x > 0) x -= velocidad_movimiento;
    } else if (event.key === " " && puedeDisparar) {
        dispararProyectil(); 
    }
    dibujarProtagonista();
});

// Variables del disparo

// Variables de la habilidad especial
let habilidadUsada = false;
let rayoActivo = false;
let rayoX, rayoY;
let rondasTranscurridas = 0; // Contador de rondas para recargar la habilidad


function activarRafaga() {
    if (habilidadUsada || !funcional) return; // Evitar usar la habilidad si ya se ha usado o el juego no está funcional

    habilidadUsada = true;
    let rafagaInterval = setInterval(() => {
        if (!funcional) {
            clearInterval(rafagaInterval);
            return;
        }
        dispararProyectilEspacial(); // Disparar proyectil rápidamente
    }, 100); // Intervalo entre disparos en la ráfaga

    setTimeout(() => {
        clearInterval(rafagaInterval); // Detener la ráfaga después de 1 segundo
    }, 1000);

    let sonido_rafaga = new Audio("VATS.mp3");
    sonido_rafaga.play();
}

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5,    // Velocidad base
    dx: 0,       // Velocidad actual horizontal (inicialmente 0)
    health: 10
};

function verificarRecargaHabilidad() {
    if (habilidadUsada && rondasTranscurridas >= 2) {
        habilidadUsada = false; // Recargar la habilidad después de 2 rondas
        rondasTranscurridas = 0; // Reiniciar el contador de rondas
        let mensajeRecarga = document.createElement("div");
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
        }, 1000); // Remove the message after 3 seconds

    }
}

// Incrementar rondas y verificar recarga de habilidad
function incrementarRonda() {
    if (habilidadUsada) {
        rondasTranscurridas++;
        verificarRecargaHabilidad();
    }
}

document.addEventListener("keydown", function(event) {
    if (event.key.toLowerCase() === "s" && funcional) {
        activarRafaga();
    }
});

const controles = document.getElementById("btnControles");
controles.addEventListener("click", () => {
    if (window.innerWidth <= 768) { // Umbral para considerar dispositivos móviles
        alert(`Controles para móvil:\n- Mover: Botones táctiles\n- Disparar: Botón táctil de disparo\n- Habilidad Especial: Botón táctil especial(solo un uso, en modo infinito se recarga cada 2 rondas)`);
    } else {
        alert(`Controles:\n- Mover: Flechas Izquierda y Derecha\n- Disparar: Espacio\n- Habilidad Especial: Tecla "S"(solo un uso, en modo infinito se recarga cada 2 rondas)`);
    }
});

let proyectiles = [];

function dispararProyectil() {
    if (funcional == false) return;
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

function dispararProyectilEspacial() {
    if (funcional == false) return;
    if (!puedeDisparar) return;

    puedeDisparar = false;

    let disparosRealizados = 0;
    let intervaloDisparos = setInterval(() => {
        if (disparosRealizados >= 10) {
            clearInterval(intervaloDisparos);
            puedeDisparar = true;
            return;
        }

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

        disparosRealizados++;
    }, 100); // Disparar cada 100ms
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
    if (iniciado == true) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dibujarProtagonista();
        dibujarEnemigos();
        dibujarProyectiles();
        moverProyectiles();

    }
    requestAnimationFrame(actualizarCanvas);
}

const mensaje = document.createElement("div");
mensaje.innerText = "New Vegas está en peligro, vienen oleadas de monstruos mutados a por nosotros y debes defendernos, te daremos chapas a cambio.";
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

setTimeout(() => {
    document.body.removeChild(mensaje);
}, 3000); // Remove the message after 3 seconds

document.addEventListener("keydown", function(event) {
    if (event.code === "Space" && document.activeElement.tagName === "BUTTON") {
        event.preventDefault();
    }
});
document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        event.preventDefault(); // Evita que la página se desplace
        dispararProyectil();    // Llama a tu función de disparo
    }
});

audio_nojuego.play();
audio_nojuego.loop = true; // Repetir el audio de fondo
actualizarCanvas();