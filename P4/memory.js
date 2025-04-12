document.addEventListener("DOMContentLoaded", () => {
    const tablero = document.querySelector(".tablero");
    if (!tablero) {
        console.error("Element with class 'tablero' not found.");
        return;
    }
    const gridDimension = parseInt(tablero.getAttribute("grid-dimension"), 10);
    if (isNaN(gridDimension) || gridDimension <= 0) {
        console.error("Invalid or missing 'grid-dimension' attribute on 'tablero' element.");
        return;
    }
    const cards = Array.from({ length: gridDimension * gridDimension }, (_, index) => `
        <div class="card">
            <div class="card-front"></div>
            <div class="card-back">${String.fromCharCode(65 + (index % 26))}</div>
        </div>
    `).join('');
    tablero.innerHTML = cards;
});