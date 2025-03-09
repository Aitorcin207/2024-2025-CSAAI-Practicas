
function crearContraseña() {
    const digitos = document.getElementsByClassName("digito");
    for (let i = 0; i < 4; i++) {
        digitos[i].value = Math.floor(Math.random() * 9) + 1;

    }
    celda1 = digitos[0].value;
    celda2 = digitos[1].value;
    celda3 = digitos[2].value;
    celda4 = digitos[3].value;
}

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

        this.display.innerHTML = "0:0:0";
    }
}
const mostrarCronometro = {
    display : document.getElementById("mostrar"),
    start : document.getElementById("Start"),
    stop : document.getElementById("Stop"),
    reset : document.getElementById("Reset")
}


//-- Definir un objeto cronómetro
const crono = new Crono(mostrarCronometro.display);

//---- Configurar las funciones de retrollamada

//-- Arranque del cronometro
mostrarCronometro.start.onclick = () => {
    console.log("Start!!");
    crono.start();
}
  
//-- Detener el cronómetro
mostrarCronometro.stop.onclick = () => {
    console.log("Stop!");
    crono.stop();
}

//-- Reset del cronómetro
mostrarCronometro.reset.onclick = () => {
    console.log("Reset!");
    crono.reset();
}

const digitos = document.getElementsByClassName("digito");

function verificarContraseña() {

    for (let digito of digitos) {
        if (celda1.value == digito.value) {
            
        }
        else if (celda2.value == digito.value) {

        }
        else if (celda3.value == digito.value) {

        }
        else if (celda4.value == digito.value) {

        }
    }
}
