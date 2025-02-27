console.log("Ejecutando js...")

//-- Leer el párrafo identificado como test
const test = document.getElementById('test')

//-- Manejador del evento clic sobre el párrafo test
//-- Cada vez que se hace clic en el párrafo se invoca a esta función
function manejador_parrafo()
{
  console.log("Clic sobre el párrafo crack!");


  if (test.style.backgroundColor == "red") 
    {

    const img = document.createElement('img');
    img.src = 'vegetta.jpg'; // Reemplaza con la ruta de tu imagen
    img.alt = 'Descripción de la imagen';
    test.appendChild(img);
    test.style.backgroundColor = "white";
    test.style.color = "black"
    } 
  else {
    test.style.backgroundColor = "red";
    test.style.color = "white"
    const img = test.querySelector('img');
    if (img) {
        test.removeChild(img);
    }
  }
}

//-- Configurar el manejador para el evento de
//-- pulsación de botón: que se ejecute la
//-- funcion manejador_parrafo()
test.onclick = manejador_parrafo;