document.addEventListener('DOMContentLoaded', (event) => {
    let time = 600; // 10분 (초 단위)
    const countdownElement = document.getElementById('countdown');

    function updateCountdown() {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        time--;

        if (time < 0) {
            clearInterval(interval);
            countdownElement.textContent = "폭발!";
            document.getElementById('explosion').style.display = 'block';
        }
    }

    const interval = setInterval(updateCountdown, 1000);
});