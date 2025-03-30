
const canvas = document.getElementById("canvas");

//-- Definir el tamaño del canvas

canvas.height = 650;
canvas.width = 900;

//-- Obtener el contexto del canvas
const ctx = canvas.getContext("2d");

//-- Coordenadas del objeto
let x = (canvas.width - 60) / 2; // Centrado horizontalmente
let y = canvas.height - 35; // Abajo en el canvas

let em1x = 130;
let em1y = 200;

//-- Velocidades del objeto
let velocidad_movimiento = 4;
let velocidad_disparo = 10;
let velocidad_enemigos = 2;
let puedeDisparar = true; // Flag para controlar el disparo
requestAnimationFrame(enemigos);

dibujarP(x, y, 60, 30, "blue"); 
//-- Función principal de animación

let enemigosLista = []; // Almacenará los enemigos generados

const filas = 3, columnas = 9;
const ancho = 60, alto = 30;
const separacionX = 70, separacionY = 40;
let moviendoEnemigos = false; // Evita múltiples loops de animación

function enemigos() {  
    enemigosLista = []; // Crear la lista una sola vez

    for (let fila = 0; fila < filas; fila++) {
        for (let columna = 0; columna < columnas; columna++) {
            let x = em1x + columna * separacionX;
            let y = em1y + fila * separacionY;

            enemigosLista.push({ x, y, ancho, alto });
        }
    }

    if (!moviendoEnemigos) {
        moviendoEnemigos = true;
        moverse_enemigos();
    }
}

function moverse_enemigos() {
    setTimeout(() => {
        // Limpiar solo el área de los enemigos
        ctx.clearRect(em1x - 5, em1y - 5, columnas * separacionX + 10, filas * separacionY + 10);

        em1x += velocidad_enemigos; // Mover en grupo

        // Detectar colisión con el borde del canvas
        let bordeDerecho = em1x + (columnas * separacionX);
        if (bordeDerecho >= canvas.width || em1x <= 0) {
            velocidad_enemigos *= -1; // Cambiar dirección
            em1y += 40; // Bajar una fila

            // También bajamos cada enemigo individualmente
            enemigosLista.forEach(enemigo => {
                enemigo.y += 40;
            });
        }

        // Mover y redibujar cada enemigo
        enemigosLista.forEach(enemigo => {
            enemigo.x += velocidad_enemigos;
            dibujarP(enemigo.x, enemigo.y, enemigo.ancho, enemigo.alto, "red");
        });

        requestAnimationFrame(moverse_enemigos);
    }, 16); // Control de FPS (~60 FPS)
}

// Llamar solo una vez al iniciar
enemigos();

function iniciar() {
  dibujarP(x, y, 60, 30, "blue"); // Pintar el proyectil
  moverse(); // Llamar a la función de actualización
  //console.log("test");
}

document.addEventListener("keydown", function(event) {
  if (event.key === "ArrowRight") {

    if (x >= (canvas.width - 64)) {
      x = (canvas.width - 64);
    }
    else {
      x += velocidad_movimiento; // Mover a la derecha
    }

  }

  else if (event.key === "ArrowLeft") {
    if (x <= 4) {
      x = 4;
    }
    else {
      x -= velocidad_movimiento; // Mover a la izquierda
    }
  }

  else if (event.key === "ArrowUp" && puedeDisparar) {
    puedeDisparar = false; // Bloquear disparo

    let proyectilX = x + 30;
    let proyectilY = y;
    let proyectilAncho = 4, proyectilAlto = 10;
    
    function dispararProyectil() {
        ctx.clearRect(proyectilX - 2, proyectilY, proyectilAncho, proyectilAlto);

        // Verificar colisión con algún enemigo
        for (let i = 0; i < enemigosLista.length; i++) {
            let enemigo = enemigosLista[i];
            if (
                proyectilX < enemigo.x + enemigo.ancho &&
                proyectilX + proyectilAncho > enemigo.x &&
                proyectilY < enemigo.y + enemigo.alto &&
                proyectilY + proyectilAlto > enemigo.y
            ) {
                console.log("¡Impacto en un enemigo!");
                  ctx.clearRect(enemigo.x, enemigo.y, enemigo.ancho, enemigo.alto); // Limpiar el enemigo del canvas
                  enemigosLista.splice(i, 1); // Eliminar enemigo
                return; // Detener el disparo
            }
        }

        proyectilY -= 5; // Mover el proyectil hacia arriba

        // Dibujar proyectil
        ctx.fillStyle = "yellow";
        ctx.fillRect(proyectilX - 2, proyectilY, proyectilAncho, proyectilAlto);
        
        requestAnimationFrame(dispararProyectil);
    }

    dispararProyectil();

    setTimeout(() => {
        puedeDisparar = true;
    }, 1600);
}

  ctx.clearRect(0, y, canvas.width, 30);


});



function dibujarP(x,y,lx,ly,color) {

  //-- Pintando el proyectil
  ctx.beginPath();

  //-- Definir un rectángulo de dimensiones lx x ly,
  ctx.rect(x, y, lx, ly);

  //-- Color de relleno del rectángulo
  ctx.fillStyle = color;

  //-- Mostrar el relleno
  ctx.fill();

  //-- Mostrar el trazo del rectángulo
  ctx.stroke();

  ctx.closePath();
  requestAnimationFrame(iniciar);

}



//-- ¡Que empiece la función!
update();