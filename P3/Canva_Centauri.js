
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
let bajar = false; // Variable para controlar el descenso de los enemigos
const imagenes = ["mutaracha.webp", "sanginario.webp", "Mirelurk.webp"];
const imagenesCargadas = {}; // Almacenar imágenes cargadas para no recargarlas varias veces

function enemigos() {  


  // Cargar imágenes una sola vez
  imagenes.forEach((src) => {
      const img = new Image();
      img.src = src;
      imagenesCargadas[src] = img;
  });

  // Crear la lista de enemigos
  for (let fila = 0; fila < filas; fila++) {
      for (let columna = 0; columna < columnas; columna++) {
          let x = em1x + columna * separacionX;
          let y = em1y + fila * separacionY;
          let imagen = imagenes[fila % imagenes.length];

          enemigosLista.push({ x, y, ancho, alto, imagen });
      }
  }

  // Dibujar enemigos después de que las imágenes hayan cargado
  enemigosLista.forEach((enemigo) => {
      let img = imagenesCargadas[enemigo.imagen];
      img.onload = () => {
          ctx.drawImage(img, enemigo.x, enemigo.y, enemigo.ancho, enemigo.alto);
      };
      // Si la imagen ya está cargada, dibujarla directamente
      if (img.complete) {
          ctx.drawImage(img, enemigo.x, enemigo.y, enemigo.ancho, enemigo.alto);
      }
  });

  if (!moviendoEnemigos) {
      moviendoEnemigos = true;
      moverse_enemigos();
  }
}
// Objeto para almacenar las imágenes precargadas


function precargarImagenes() {
    const imagenes = {
        mutaracha: "mutaracha.webp",
        mirelurk: "Mirelurk.webp",
        sanginario: "sanginario.webp"
    };

    for (let key in imagenes) {
        const img = new Image();
        img.src = imagenes[key];
        imagenesCargadas[key] = img;
    }
}

// Llamar esta función al inicio para precargar las imágenes
precargarImagenes();

function moverse_enemigos() {
    if (em1y >= canvas.height - 150) {
        alert("Game Over! Los enemigos han llegado al fondo.");
        return;
    }

    // Cambiar dirección si llegan a los bordes
    if (em1x + 620 >= canvas.width || em1x <= 0) {
        velocidad_enemigos = -velocidad_enemigos;
        bajar = true;
        em1y += 10;
    }

    // Actualizar la posición de la primera fila
    em1x += velocidad_enemigos;

    // Borrar solo las áreas de los enemigos para no afectar el fondo
    enemigosLista.forEach((enemigo) => {
        ctx.clearRect(enemigo.x, enemigo.y, enemigo.ancho, enemigo.alto);
    });

    // Mover y redibujar los enemigos
    enemigosLista.forEach((enemigo, index) => {
        enemigo.x += velocidad_enemigos; // Mover enemigo horizontalmente
        if (bajar) enemigo.y += 10; // Bajar enemigo si corresponde

        // Asignar imagen según la fila
        let tipoEnemigo;
        if (index < columnas) tipoEnemigo = "mutaracha"; // Primera fila
        else if (index < columnas * 2) tipoEnemigo = "mirelurk"; // Segunda fila
        else tipoEnemigo = "sanginario"; // Tercera fila

        // Dibujar la imagen desde el objeto precargado
        const img = imagenesCargadas[tipoEnemigo];
        if (img.complete) {
            ctx.drawImage(img, enemigo.x, enemigo.y, enemigo.ancho, enemigo.alto);
        }
    });

    bajar = false; // Resetear el flag de bajada

    // Llamar de nuevo a la animación
    requestAnimationFrame(moverse_enemigos);
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
  em1y = 60;
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

const derecha = document.getElementById("btnDerecha");
const izquierda = document.getElementById("btnIzquierda");
const disparo = document.getElementById("btnShoot");
const controles = document.getElementById("btnControles");

derecha.addEventListener("click", function() {
  if (event.key === "ArrowRight") {
    x = (canvas.width - 64);
  } else {
    x += velocidad_movimiento; // Mover a la derecha
  }
});
izquierda.addEventListener("click", function() {
  if (event.key === "ArrowLeft") {
    x = 4;
  } else {
    x -= velocidad_movimiento; // Mover a la izquierda
  }
});

document.addEventListener("keydown", function(event) {
  if (event.key === "ArrowRight"|| derecha.onclick) {

    if (x >= (canvas.width - 64)) {
      x = (canvas.width - 64);
    }
    else {
      x += velocidad_movimiento; // Mover a la derecha
    }

  }

  else if (event.key === "ArrowLeft"|| izquierda.onclick) {
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
    let sonido_disparo = new Audio("laser-312360.mp3"); // Cargar el sonido
    let sonido_derribo = new Audio("cartoon-splat-310479.mp3"); // Cargar el sonido de derribo
    
    function dispararProyectil() {
        if (proyectilY === y) {
          sonido_disparo.play(); // Reproducir sonido solo una vez al inicio del disparo
        }
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
                  sonido_derribo.play(); // Reproducir sonido de derribo
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