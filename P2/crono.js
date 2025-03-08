
function crearContraseña() {
    const digitos = document.getElementsByClassName("digito");
    for (let i = 0; i < 5; i++) {
        digitos[i].value = Math.floor(Math.random() * 9) + 1;
    }
}

let segundos = 0;
let minutos = 0;
let horas = 0;
function iniciarCronometro() {

    let intervalo = setInterval(() => {
        segundos++;
        if (segundos === 60) {
            segundos = 0;
            minutos++;
        }
        if (minutos === 60) {
            minutos = 0;
            horas++;
        }
        document.getElementById("cronometro").textContent = `${horas}:${minutos}:${segundos}`;
    }, 1000);

    document.getElementById("Start").onclick = iniciarCronometro;

    document.getElementById("Stop").onclick = () => {
        document.getElementById("cronometro").textContent = `${horas}:${minutos}:${segundos}`;
    }

    document.getElementById("Reset").onclick = () => {
        clearInterval(intervalo);
    };
}


const digitos = document.getElementsByClassName("digito");

function verificarContraseña() {
    let contraseña = "";
    for (let digito of digitos) {
        contraseña += digito.value;
    }

    if (contraseña.length === 4 && !isNaN(contraseña)) {
        document.getElementById("resultado").textContent = "Contraseña válida: " + contraseña;
    } else {
        document.getElementById("resultado").textContent = "Contraseña inválida. Debe contener 4 dígitos.";
    }
}