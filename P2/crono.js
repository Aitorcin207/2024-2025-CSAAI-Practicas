
window.onload = crearContraseña;
let puedes_jugar = false;
let intentos = 0;
let cincos = 0;
let musica_fondo = 0;
var audio_fondo = new Audio("Resident Evil OST-RE2_ Ada's theme-yt.savetube.me.mp3");


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
        mostrarCronometro.celda1.style.color = "red";
        mostrarCronometro.celda2.style.color = "red";
        mostrarCronometro.celda3.style.color = "red";
        mostrarCronometro.celda4.style.color = "red";
        mostrarCronometro.celda1.innerHTML = valor1;
        mostrarCronometro.celda2.innerHTML = valor2;
        mostrarCronometro.celda3.innerHTML = valor3;
        mostrarCronometro.celda4.innerHTML = valor4;
        mostrarCronometro.intento.innerHTML = "Tienes un total de 10 intentos.";
        alert("DESACTIVA LA BOMBA ANTES DE QUE EXPLOTE Y SALVA RACCOON CITY");

        audio_fondo.volume = 1.0; // Subir el volumen al máximo
        audio_fondo.loop = true; // Hacer que el audio suene en bucle
        audio_fondo.play();
    }

// Ejecutar la función al cargar la página

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
        this.display.innerHTML = this.min + ":" + this.seg + ":" + this.cent;
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
            puedes_jugar = false;
        }
    }

    //-- Reset del cronómetro
    reset() {
        this.cent = 0;
        this.seg = 0;
        this.min = 0;
        intentos = 0;
        musica_fondo = 0;
        mostrarCronometro.intento.innerHTML = "Tienes un total de 10 intentos.";
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
    celda4 : document.getElementById("celda4"),
    intento : document.getElementById("intento")
    
};


//-- Definir un objeto cronómetro
const crono = new Crono(mostrarCronometro.display);

//---- Configurar las funciones de retrollamada

//-- Arranque del cronometro
mostrarCronometro.start.onclick = () => {
    console.log("Start!!");
    crono.start();
    puedes_jugar = true;
};
  
//-- Detener el cronómetro
mostrarCronometro.stop.onclick = () => {
    console.log("Stop!");
    crono.stop();
    puedes_jugar = false;
};

//-- Reset del cronómetro
mostrarCronometro.reset.onclick = () => {
    console.log("Reset!");
    document.body.style.backgroundImage = "url('cuarto.avif')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    cincos = 0;
    crearContraseña();
    crono.reset();
    
};

const digitos = { 
                  uno : document.getElementById("1"),
                  dos : document.getElementById("2"),
                  tres : document.getElementById("3"),
                  cuatro : document.getElementById("4"),
                  cinco : document.getElementById("5"),
                  seis : document.getElementById("6"),
                  siete : document.getElementById("7"),
                  ocho : document.getElementById("8"),
                  nueve : document.getElementById("9"),
                  cero : document.getElementById("0")

 };
    
digitos.uno.onclick = () => {
    digitos.uno.value = 1;
    console.log("UNO");
    verificarContraseña(digitos.uno);
};
    
digitos.dos.onclick = () => {
    digitos.dos.value = 2;
    console.log("DOS");
    verificarContraseña(digitos.dos);
};

digitos.tres.onclick = () => {
    digitos.tres.value = 3;
    console.log("TRES");
    verificarContraseña(digitos.tres);
};

digitos.cuatro.onclick = () => {
    digitos.cuatro.value = 4;
    console.log("CUATRO");
    verificarContraseña(digitos.cuatro);
};

digitos.cinco.onclick = () => {
    digitos.cinco.value = 5;
    console.log("CINCOS");
    verificarContraseña(digitos.cinco);
};

digitos.seis.onclick = () => {
    digitos.seis.value = 6;
    console.log("SEIS");
    verificarContraseña(digitos.seis);
};

digitos.siete.onclick = () => {
    digitos.siete.value = 7;
    console.log("SIETE");
    verificarContraseña(digitos.siete);
};

digitos.ocho.onclick = () => {
    digitos.ocho.value = 8;
    console.log("OCHO");
    verificarContraseña(digitos.ocho);
};

digitos.nueve.onclick = () => {
    digitos.nueve.value = 9;
    console.log("NUEVE");
    verificarContraseña(digitos.nueve);
};

digitos.cero.onclick = () => {
    digitos.cero.value = 0;
    console.log("CERO");
    verificarContraseña(digitos.cero);
};

function verificarContraseña(digito) {
    if (puedes_jugar == true) {
        numerointentos();
        console.log(digito.value);
        console.log(celda1.value);
        console.log(celda2.value);
        console.log(celda3.value);
        console.log(celda4.value);
        if (mostrarCronometro.celda1.value == digito.value) {
            mostrarCronometro.celda1.value = "*";
            mostrarCronometro.celda1.style.color = "green";
            valor1 = digito.value;
            mostrarCronometro.celda1.innerHTML = digito.value;
        } else if (mostrarCronometro.celda2.value == digito.value) {
            mostrarCronometro.celda2.value = "*";
            mostrarCronometro.celda2.style.color = "green";
            valor2 = digito.value;
            mostrarCronometro.celda2.innerHTML = digito.value;
        } else if (mostrarCronometro.celda3.value == digito.value) {
            mostrarCronometro.celda3.value = "*";
            mostrarCronometro.celda3.style.color = "green";
            valor3 = digito.value;
            mostrarCronometro.celda3.innerHTML = digito.value;
        } else if (mostrarCronometro.celda4.value == digito.value) {
            mostrarCronometro.celda4.value = "*";
            valor4 = digito.value;
            mostrarCronometro.celda4.innerHTML = digito.value;
            mostrarCronometro.celda4.style.color = "green";
        }
    if (digito.value == 5) {
        cincos++;
        if (cincos == 5) {
            var audio = new Audio('for-the-republic-star-wars.mp3');
            audio.play();
            alert("FOR THE REPUBLIC");
            document.body.style.backgroundImage = "url('CINCOS.webp')";
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
            

        }
    }
    if (valor1 != "*" && valor2 != "*" && valor3 != "*" && valor4 != "*") {
        alert("BOMBA DESACTIVADA");
        document.body.style.backgroundImage = "url('campo.jpg')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        var audio_victoria = new Audio('Victoria.mp3');
        audio_fondo.pause();
        audio_fondo.currentTime = 0;
        
        audio_victoria.play();
        alert("HAS ESCAPADO Y SALVADO LA CIUDAD DE RACCOON CITY");
        puedes_jugar = false;
        crono.stop();
        intentos = 0;

    }
}

}

function numerointentos() {

    intentos++;
    total = 10 - intentos;
    mostrarCronometro.intento.innerHTML = "Tienes un total de " + total + " intentos.";
    if (intentos == 10) {
        var audio_derrota = new Audio('explosion-42132.mp3');
        audio_derrota.play();
        alert("Un resplandor y hace BOOOOOOM");
        
        puedes_jugar = false;
        crono.stop();
        intentos = 0;
        audio_fondo.pause();
        audio_fondo.currentTime = 0;
    }
}
