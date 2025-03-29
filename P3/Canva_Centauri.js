
const canvas = document.getElementById("canvas");

//-- Definir el tamaño del canvas

canvas.height = 900;
canvas.width = 600;

//-- Obtener el contexto del canvas
const ctx = canvas.getContext("2d");

//-- Coordenadas del objeto
let x = (canvas.width - 60) / 2; // Centrado horizontalmente
let y = canvas.height - 35; // Abajo en el canvas

//-- Velocidades del objeto
let velx = 3;
let vely = 1;

dibujarP(x, y, 60, 30, "blue"); 
//-- Función principal de animación
function update() 
{
  console.log("test");
  //-- Algoritmo de animación:
  //-- 1) Actualizar posición del  elemento
  //-- (física del movimiento rectilíneo uniforme)

  //-- Condición de rebote en extremos verticales del canvas
  if (x < 0 || x >= (canvas.width - 20)) {
    rebote_sound.currentTime = 0;
    rebote_sound.play();
    velx = -velx;

    // Evitar que traspase las paredes laterales
    x = Math.max(0, Math.min(x, canvas.width - 20));
  }

  //-- Condición de rebote en extremos horizontales del canvas
  if (y <= 0 || y > 80) {
    rebote_sound.currentTime = 0;
    rebote_sound.play();
    vely = -vely;

    // Evitar que traspase las paredes horizontales
    y = Math.max(0, Math.min(y, 80));
  }

  //-- Actualizar la posición
  x = x + velx;
  y = y + vely;

  //-- 2) Borrar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  //-- 4) Volver a ejecutar update cuando toque
  requestAnimationFrame(update);
}

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
}



//-- ¡Que empiece la función!
update();