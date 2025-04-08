//-- Clase cronómetro
class Crono {
    constructor(display) {
      this.display = display;
      this.cent = 0;  // Centésimas
      this.seg = 0;   // Segundos
      this.min = 0;   // Minutos
      this.timer = null;  // Identificador del temporizador
    }
  
    // Se ejecuta cada centésima
    tic() {
      this.cent++;
      if (this.cent === 100) {
        this.seg++;
        this.cent = 0;
      }
      if (this.seg === 60) {
        this.min++;
        this.seg = 0;
      }
      this.display.innerHTML = `${this.min}:${this.seg.toString().padStart(2, '0')}:${this.cent.toString().padStart(2, '0')}`;
    }
  
    // Arranca el cronómetro
    start() {
      if (!this.timer) {
        this.timer = setInterval(() => this.tic(), 10);
      }
    }
  
    // Para el cronómetro
    stop() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  
    // Reinicia el cronómetro
    reset() {

      this.cent = 0;
      this.seg = 0;
      this.min = 0;
      this.display.innerHTML = "0:00:00";
    }
  }
  
  // Espera a que el DOM se cargue para obtener los elementos y asignar eventos
  document.addEventListener("DOMContentLoaded", () => {
    const display = document.getElementById("crono");
    const crono = new Crono(display);
  
    const btnIniciar = document.getElementById("btnIniciar");
    const btnInfinito = document.getElementById("btnInfinito");

    const btnReiniciar = document.getElementById("btnReiniciar");
  
    btnIniciar.addEventListener("click", () => {
      crono.start();
    });
  
    btnInfinito.addEventListener("click", () => {
      crono.start();
    });

    btnReiniciar.addEventListener("click", () => {
      crono.reset();
      crono.start();
    });
  
    // Función para detener el cronómetro cuando finaliza la partida.
    // Puede ser llamada desde otro archivo JS.
    window.finalizarPartida = () => {
      crono.stop();
    };
  });