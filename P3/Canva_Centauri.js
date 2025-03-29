
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
let velocidad_enemigos = 5;
requestAnimationFrame(enemigos);

dibujarP(x, y, 60, 30, "blue"); 
//-- Función principal de animación

function enemigos() {
  const filas = 3; // Número de filas de enemigos
  const columnas = 9; // Número de enemigos por fila
  const ancho = 60;
  const alto = 30;
  const separacionX = 70;
  const separacionY = 40;

  for (let fila = 0; fila < filas; fila++) {
    for (let columna = 0; columna < columnas; columna++) {
      let x = em1x + columna * separacionX;
      let y = em1y - fila * separacionY;
      dibujarP(x, y, ancho, alto, "red");
    }
  }

  requestAnimationFrame(moverse_enemigos);
}

function moverse_enemigos() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar todo el canvas
  em1x += velocidad_enemigos; // Mover a la derecha
  if (em1x + 630 >= canvas.width) {
    em1x = 0; // Reiniciar la posición del enemigo al lado izquierdo
    if (em1y >= canvas.height - 80) {
      velocidad_enemigos = 0; // Detener el movimiento del enemigo
    } else {
      em1y += 40; // Cambiar la posición vertical del enemigo
    }
  }

  enemigos(); // Redibujar enemigos
}

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