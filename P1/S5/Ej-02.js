console.log("Ejecutando JS...");

const elemento = document.getElementById("elemento");
const boton = document.getElementById("boton");

boton.onclick = () => {
  console.log("Clic!");

  //-- Cambiar color
  if (elemento.style.backgroundColor == "blue") {
    elemento.style.backgroundColor = "red";
  }
  else {
    elemento.style.backgroundColor = "blue";
  }
}