
// Variables de trabajo
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');
const miAudio = new Audio('Canción misión imposible.mp3');
const btnReproducir = document.getElementById('btnCNet');
btnReproducir.addEventListener('click', () => {
  if (miAudio.paused) {
    miAudio.loop = true; // Hacer que el audio se repita
    miAudio.play();
  }
});

let redAleatoria;
let nodoOrigen = 0, nodoDestino = 0;
let rutaMinimaConRetardos;

const pantallaWidth = 120;
const pantallaHeight = 120;

const nodeRadius = 40;
let numNodos = randomNumber(2, 6); // Generar un número aleatorio entre 2 y 5
const nodeConnect = 2;
const nodeRandomDelay = 1000;
const pipeRandomWeight = 100; // No hay retardo entre nodos 100

const imgPantalla = new Image();
imgPantalla.src = "pantalla.png";

const imgPantallaVerde = new Image();
imgPantallaVerde.src = "pantalla-verde.png"; // Esta debes crearla


// Localizando elementos en el DOM
const btnCNet = document.getElementById("btnCNet");
const btnMinPath = document.getElementById("btnMinPath");

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const scaleX = window.innerWidth / canvas.width;
  const scaleY = window.innerHeight / canvas.height;
  const scale = Math.min(scaleX, scaleY);

  canvas.style.width = `${canvas.width * scale}px`;
  canvas.style.height = `${canvas.height * scale}px`;

  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
}

// Clase para representar un nodo en el grafo
class Nodo {

  constructor(id, x, y, delay) {
    this.id = id; // Identificador del nodo
    this.x = x; // Coordenada X del nodo
    this.y = y; // Coordenada Y del nodo
    this.delay = delay; // Retardo del nodo en milisegundos
    this.conexiones = []; // Array de conexiones a otros nodos
  }
  
  // Método para agregar una conexión desde este nodo a otro nodo con un peso dado
  conectar(nodo, peso) {
    this.conexiones.push({ nodo, peso });
  }

  // Método para saber si un nodo está en la lista de conexiones de otro
  isconnected(idn) {

    let isconnected = false;

    this.conexiones.forEach(({ nodo: conexion, peso }) => {      
      if (idn == conexion.id) {
        //console.log("id nodo conectado:" + conexion.id);
        isconnected = true;
      }      
    });
    
    return isconnected;
  }

  // Método para saber la distancia entre dos nodos
  node_distance(nx, ny) {

    var a = nx - this.x;
    var b = ny - this.y;
        
    return Math.floor(Math.sqrt( a*a + b*b ));

  }

  // Método para encontrar el nodo más alejado
  far_node( nodos ) {

    let distn = 0;
    let cnode = this.id;
    let distaux = 0;
    let pos = 0;
    let npos = 0;

    for (let nodo of nodos) {
      distaux = this.node_distance(nodo.x, nodo.y);
  
      if (distaux != 0 && distaux > distn) {
        distn = distaux;
        cnode = nodo.id;
        npos = pos;
      }

      pos += 1;
    }
  
    return {pos: npos, id: cnode, distance: distn,};

  }

  // Método para encontrar el nodo más cercano
  close_node( nodos ) {

    let far_node = this.far_node( nodos );
    let cnode = far_node.id;
    let distn = far_node.distance;
    let distaux = 0;
    let pos = 0;
    let npos = 0;    
  
    for (let nodo of nodos) {
      distaux = this.node_distance(nodo.x, nodo.y);
  
      if (distaux != 0 && distaux <= distn) {
        distn = distaux;
        cnode = nodo.id;
        npos = pos;
      }

      pos += 1;
    }
  
    return {pos:npos, id: cnode, distance: distn,}
  
  }



}
  
// Función para generar una red aleatoria con nodos en diferentes estados de congestión
function crearRedAleatoriaConCongestion(numNodos, numConexiones) {
  
  const nodos = [];
  let x = 0, y = 0, delay = 0;
  let nodoActual = 0, nodoAleatorio = 0, pickNode = 0, peso = 0;
  let bSpace = false;

  const xs = Math.floor(canvas.width / numNodos);
  const ys = Math.floor(canvas.height / 2 );
  const xr = canvas.width - nodeRadius;
  const yr = canvas.height - nodeRadius;
  let xp = nodeRadius;
  let yp = nodeRadius;
  let xsa = xs;
  let ysa = ys;

  // Generamos los nodos
  for (let i = 0; i < numNodos; i++) {

    //var random_boolean = Math.random() < 0.5;
    if (Math.random() < 0.5) {
      yp = nodeRadius;
      ysa = ys;
    } 
    else {
      yp = ys;
      ysa = yr;
    }

    x = randomNumber(xp, xsa); // Generar coordenada x aleatoria
    y = randomNumber(yp, ysa); // Generar coordenada y aleatoria

    xp = xsa;
    xsa = xsa + xs;

    if ( xsa > xr && xsa <= canvas.width ) {
      xsa = xr;
    }

    if ( xsa > xr && xsa < canvas.width ) {
      xp = nodeRadius;
      xsa = xs;
    }    

    delay = generarRetardo(); // Retardo aleatorio para simular congestión
    nodos.push(new Nodo(i, x, y, delay)); // Generar un nuevo nodo y añadirlo a la lista de nodos de la red
  }
  
  // Conectamos los nodos
  for (let i = 0; i < numNodos; i++) {
    nodoActual = nodos[i];
    for (let j = 0; j < numConexiones; j++) {
      pickNode = Math.floor(Math.random() * numNodos);
      nodoAleatorio = nodos[pickNode];
      //peso = Math.random() * pipeRandomWeight; // Peso aleatorio para simular la distancia entre nodos
      peso = pipeRandomWeight; // El mismo peso para todas las conexiones
      nodoActual.conectar(nodoAleatorio, peso);
    }
  }
    
  // Conectamos los nodos
  // Seleccionamos los nodos más cercanos teniendo en cuenta la distancia
  // Seleccionamos tantos nodos como indica la variable numConexiones
  // El nodo será candidato siempre que no estén ya conectados
  for (let nodo of nodos) {
    //console.log("id: " + nodo.id + " distancia al nodo: " + nodo.node_distance(nodos[0].x, nodos[0].y));
 
     const clonedArray = [...nodos];
 
     for (let j = 0; j < numConexiones; j++) {
       let close_node = nodo.close_node(clonedArray);
       //console.log(close_node);
 
       if (!nodo.isconnected(close_node.id) && !clonedArray[close_node.pos].isconnected(nodo.id)) {
         // Añadimos una nueva conexión
         // Con el nodo más cercano y la distancia a ese nodo como el peso de la conexión
         nodo.conectar(clonedArray[close_node.pos], close_node.distance);
       }
 
       // Eliminamos el nodo seleccionado del array clonado para evitar que 
       // vuelva a salir elegido con splice.
       // 0 - Inserta en la posición que le indicamos.
       // 1 - Remplaza el elemento, y como no le damos un nuevo elemento se queda vacío.      
       clonedArray.splice(close_node.pos, 1);
     }
 
   }

  return nodos;
}

// Función para generar un retardo aleatorio entre 0 y 1000 ms
function generarRetardo() {
  return Math.random() * nodeRandomDelay;
}

// Generar un número aleatorio dentro de un rango
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

refWidth = canvas.width;
refHeight = canvas.height;

function drawNet(nnodes, ruta = []) {
  ctx.clearRect(0, 0, refWidth, refHeight);

  // Dibujar conexiones
  nnodes.forEach(nodo => {
    nodo.conexiones.forEach(({ nodo: conexion, peso }) => {
      ctx.beginPath();
      ctx.moveTo(nodo.x, nodo.y);
      ctx.lineTo(conexion.x, conexion.y);
      ctx.strokeStyle = 'white';
      ctx.stroke();
      
      ctx.font = '12px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      pw = "N" + nodo.id + " pw " + peso;
      const midX = Math.floor((nodo.x + conexion.x)/2);
      const midY = Math.floor((nodo.y + conexion.y)/2);
      ctx.fillText(pw, midX, midY);  

    });
  });

  // Resaltar ruta más corta
  for (let i = 0; i < ruta.length - 1; i++) {
    const nodoA = ruta[i];
    const nodoB = ruta[i + 1];
    ctx.beginPath();
    ctx.moveTo(nodoA.x, nodoA.y);
    ctx.lineTo(nodoB.x, nodoB.y);
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.lineWidth = 1;
  }

  // Dibujar nodos
  nnodes.forEach(nodo => {
    const esRuta = ruta.includes(nodo);
    const imagen = esRuta ? imgPantallaVerde : imgPantalla;
  
    // Dibujar la imagen como nodo
    ctx.drawImage(imagen, nodo.x - pantallaWidth / 2, nodo.y - pantallaHeight / 2, pantallaWidth, pantallaHeight);
  
    // Dibujar el texto encima de la imagen
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.font = '12px Arial';
    const nodoDesc = `N${nodo.id} delay ${Math.floor(nodo.delay)}`;
    ctx.fillText(nodoDesc, nodo.x, nodo.y + 5);
  });
  
}


// Función de calback para generar la red de manera aleatoria
btnCNet.onclick = () => {

  numNodos = randomNumber(2, 6);
  // Generar red de nodos con congestión creada de manera aleatoria redAleatoria
  // Cada nodo tendrá un delay aleatorio para simular el envío de paquetes de datos
  redAleatoria = crearRedAleatoriaConCongestion(numNodos, nodeConnect);

  // Limpiamos el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar la red que hemos generado
  drawNet(redAleatoria);

  // Mostrar información de los nodos
  const infoNodosDiv = document.getElementById("infoNodos");
  infoNodosDiv.innerHTML = ""; // Limpia los nodos anteriores

  redAleatoria.forEach(nodo => {
    const nodoDiv = document.createElement("div");
    const colorValue = Math.floor((nodo.id / (redAleatoria.length - 1)) * 255);
    nodoDiv.style.border = `10px solid rgb(${colorValue}, ${colorValue}, ${colorValue})`;
    nodoDiv.style.padding = "10px";
    nodoDiv.style.width = "120px";
    nodoDiv.style.textAlign = "center";
    nodoDiv.style.backgroundColor = "gray";
    nodoDiv.style.color = "white";
    nodoDiv.style.margin = "5px";
    nodoDiv.style.borderRadius = "8px";
    nodoDiv.innerHTML = `<strong>N${nodo.id}</strong><br>Delay: ${Math.floor(nodo.delay)} ms`;
    infoNodosDiv.appendChild(nodoDiv);
  });
}
btnMinPath.onclick = () => {
  if (!redAleatoria || redAleatoria.length === 0) {
    alert("Primero debes crear la red haciendo clic en 'Crear Red'");
    return;
  }

  nodoOrigen = redAleatoria[0];
  nodoDestino = redAleatoria[numNodos - 1];

  rutaMinimaConRetardos = dijkstraConRetardos(redAleatoria, nodoOrigen, nodoDestino);
  drawNet(redAleatoria, rutaMinimaConRetardos);

  const tiempoTotal = rutaMinimaConRetardos.reduce((total, nodo) => total + nodo.delay, 0);
  const rutaTexto = document.getElementById("infoRed");
  rutaTexto.innerHTML = `
    <div><strong>Número de nodos:</strong> ${redAleatoria.length}</div>
    <div><strong>Tiempo total:</strong> ${Math.floor(tiempoTotal)} ms</div>
    <div><strong>Ruta más corta:</strong></div>
    <div>${rutaMinimaConRetardos.map(n => `N${n.id}`).join(" → ")}</div>
    <div><em>¡¡¡Red Generada!!!</em></div>
  `;
};






function dijkstraConRetardos(nodos, nodoInicio, nodoFin) {
  const distancias = new Map();
  const previos = new Map();
  const visitados = new Set();

  // Inicializar distancias y previos
  nodos.forEach(nodo => {
    distancias.set(nodo.id, Infinity);
    previos.set(nodo.id, null);
  });
  distancias.set(nodoInicio.id, nodoInicio.delay); // El coste inicial es el retardo del nodo de inicio

  while (visitados.size < nodos.length) {
    // Encontrar el nodo no visitado con la menor distancia
    let nodoActual = null;
    let menorDistancia = Infinity;

    distancias.forEach((distancia, id) => {
      if (!visitados.has(id) && distancia < menorDistancia) {
        menorDistancia = distancia;
        nodoActual = nodos.find(n => n.id === id);
      }
    });

    if (!nodoActual) {
      break; // No hay más nodos alcanzables
    }

    visitados.add(nodoActual.id);

    // Actualizar distancias a los nodos vecinos
    nodoActual.conexiones.forEach(({ nodo: vecino }) => {
      if (!visitados.has(vecino.id)) {
        const nuevaDistancia = distancias.get(nodoActual.id) + vecino.delay;
        if (nuevaDistancia < distancias.get(vecino.id)) {
          distancias.set(vecino.id, nuevaDistancia);
          previos.set(vecino.id, nodoActual.id);
        }
      }
    });
  }

  // Reconstruir la ruta desde el nodoFin hacia el nodoInicio
  const ruta = [];
  let nodoId = nodoFin.id;
  while (nodoId !== null) {
    const nodo = nodos.find(n => n.id === nodoId);
    ruta.unshift(nodo);
    nodoId = previos.get(nodoId);
  }

  return ruta;
}