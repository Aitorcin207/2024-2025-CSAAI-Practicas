
//-- Punto de entrada: una vez cargada la página se llama a esta
console.log("Aquí comienza tu código JS...")
console.log("¡Que comiencen los juegos del JS!")
document.addEventListener('DOMContentLoaded', (event) => {
    let time = 600; // 10 minutes in seconds
    const countdownElement = document.getElementById('countdown');

    function updateCountdown() {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        time--;

        if (time < 0) {
            clearInterval(interval);
            countdownElement.textContent = "¡Tiempo agotado!";
        }
    }

    const interval = setInterval(updateCountdown, 1000);
});