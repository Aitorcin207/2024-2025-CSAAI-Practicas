
function crearContraseña() {
    const digitos = document.getElementsByClassName("digito");
    for (let i = 0; i < 4; i++) {
        digitos[i].value = Math.floor(Math.random() * 9) + 1;
        }
        celda1.value = digitos[0].value;
        celda2.value = digitos[1].value;
        celda3.value = digitos[2].value;
        celda4.value = digitos[3].value;
        valor1 = "*";
        valor2 = "*";
        valor3 = "*";
        valor4 = "*";
        mostrarCronometro.celda1.innerHTML = valor1;
        mostrarCronometro.celda2.innerHTML = valor2;
        mostrarCronometro.celda3.innerHTML = valor3;
        mostrarCronometro.celda4.innerHTML = valor4;
        }

// Ejecutar la función al cargar la página
window.onload = crearContraseña;
puedes_jugar = false;

class Crono {

    //-- Constructor. Hay que indicar el 
    //-- display donde mostrar el cronómetro
    constructor(display) {
        this.display = display;

        //-- Tiempo
        this.cent = 0, //-- Centésimas
        this.seg = 0,  //-- Segundos
        this.min = 0,  //-- Minutos
        this.timer = 0;  //-- Temporizador asociado
    }

    //-- Método que se ejecuta cada centésima
    tic() {
        //-- Incrementar en una centesima
        this.cent += 1;

        //-- 100 centésimas hacen 1 segundo
        if (this.cent == 100) {
        this.seg += 1;
        this.cent = 0;
        }

        //-- 60 segundos hacen un minuto
        if (this.seg == 60) {
        this.min = 1;
        this.seg = 0;
        }

        //-- Mostrar el valor actual
        this.display.innerHTML = this.min + ":" + this.seg + ":" + this.cent
    }

    //-- Arrancar el cronómetro
    start() {
       if (!this.timer) {
          //-- Lanzar el temporizador para que llame 
          //-- al método tic cada 10ms (una centésima)
          this.timer = setInterval( () => {
              this.tic();
          }, 10);
        }
    }

    //-- Parar el cronómetro
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    //-- Reset del cronómetro
    reset() {
        this.cent = 0;
        this.seg = 0;
        this.min = 0;
        intentos = 0;
        this.display.innerHTML = "0:0:0";
    }
}
const mostrarCronometro = {
    display : document.getElementById("mostrar"),
    start : document.getElementById("Start"),
    stop : document.getElementById("Stop"),
    reset : document.getElementById("Reset"),
    digito : document.getElementsByClassName("digito"),
    celda1 : document.getElementById("celda1"),
    celda2 : document.getElementById("celda2"),
    celda3 : document.getElementById("celda3"),
    celda4 : document.getElementById("celda4")
    
}


//-- Definir un objeto cronómetro
const crono = new Crono(mostrarCronometro.display);

//---- Configurar las funciones de retrollamada

//-- Arranque del cronometro
mostrarCronometro.start.onclick = () => {
    console.log("Start!!");
    crono.start();
    puedes_jugar = true;
}
  
//-- Detener el cronómetro
mostrarCronometro.stop.onclick = () => {
    console.log("Stop!");
    crono.stop();
    puedes_jugar = false;
}

//-- Reset del cronómetro
mostrarCronometro.reset.onclick = () => {
    console.log("Reset!");
    crearContraseña();
    crono.reset();
}



for (let digito of mostrarCronometro) {
    digito.onclick = () => {
        verificarContraseña(digito);
    }
}

function verificarContraseña(digito) {
    if (puedes_jugar == true) {
        numerointentos();
        if (mostrarCronometro.celda1.value == digito.value) {
            valor1 = digito.value;
            mostrarCronometro.celda1.innerHTML = valor1;
        } else if (mostrarCronometro.celda2.value == digito.value) {
            valor2 = digito.value;
            mostrarCronometro.celda2.innerHTML = valor2;
        } else if (mostrarCronometro.celda3.value == digito.value) {
            valor3 = digito.value;
            mostrarCronometro.celda3.innerHTML = valor3;
        } else if (mostrarCronometro.celda4.value == digito.value) {
            valor4 = digito.value;
            mostrarCronometro.celda4.innerHTML = valor4;
        }
    }
}

function numerointentos() {
    let intentos = 0;
    for (let digito of digitos) {
        digito.onclick = () => {
            intentos++;
            if (intentos == 10) {
                alert("Un resplandor y hace BOOOOOOM");
                crono.stop();
            }
        };
    }
}