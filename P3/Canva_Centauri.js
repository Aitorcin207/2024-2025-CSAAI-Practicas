
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
let em1y = 60;
let puntuaje = 0;

//-- Velocidades del objeto
let velocidad_movimiento = 9;
let velocidad_disparo = 10;
let velocidad_enemigos = 3;
let puedeDisparar = true; // Flag para controlar el disparo



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
  {
    if (em1x + 620 >= canvas.width) {
      velocidad_enemigos = -velocidad_enemigos;
      em1y += 20;
    }
    
    if (em1x  <= 0) {
      velocidad_enemigos = -velocidad_enemigos;
      em1y += 20;
    }

    //-- Actualizar la posición
    em1x += velocidad_enemigos;
    //-- 2) Borrar solo la parte de los bloques
    enemigosLista.forEach((enemigo) => {
      ctx.clearRect(enemigo.x, enemigo.y, enemigo.ancho, enemigo.alto);
    });

    //-- 3) Dibujar los enemigos
    enemigosLista.forEach((enemigo) => {
      enemigo.x += velocidad_enemigos; // Mover cada enemigo
      ctx.beginPath();
      ctx.rect(enemigo.x, enemigo.y, enemigo.ancho, enemigo.alto);

      //-- Dibujar
      ctx.fillStyle = 'red';

      //-- Rellenar
      ctx.fill();

      //-- Dibujar el trazo
      ctx.stroke();
      ctx.closePath();
    });
  
    //-- 4) Volver a ejecutar update cuando toque
    requestAnimationFrame(moverse_enemigos);
  }
}
document.getElementById("btnIniciar").addEventListener("click", function() {
  dibujarP(x, y, 60, 30, "blue"); 
  enemigos();
});
document.getElementById("btnReiniciar").addEventListener("click", function() {
  // Limpiar el canvas completamente
  puntuaje = 0;
  puntuacion.innerHTML = puntuaje + "pts";
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Reiniciar las variables
  x = (canvas.width - 60) / 2; // Centrado horizontalmente
  y = canvas.height - 35; // Abajo en el canvas
  em1x = 130;
  em1y = 200;
  enemigosLista = [];
  puedeDisparar = true;

  // Dibujar el jugador nuevamente
  dibujarP(x, y, 60, 30, "blue");

  // Reiniciar los enemigos
  enemigos();
});

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
                  puntuaje += 400;
                  console.log(puntuaje);
                  puntuacion.innerHTML = puntuaje + "pts"; // Actualizar la puntuación en el HTML
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