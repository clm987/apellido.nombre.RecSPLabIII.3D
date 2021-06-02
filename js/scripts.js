import { Anuncio_Auto } from "./Anuncio_Auto.js";
let boton = null;
let anuncios = JSON.parse(localStorage.getItem("lista")) || [];

window.addEventListener("DOMContentLoaded", () => {
    document.forms[0].addEventListener("submit", handlerSubmit);
    document.addEventListener("click", handlerClick);
    if (anuncios.length > 0) {
      handlerClickCargar(anuncios);
    }
  });

function handlerClickCargar(e) {
    renderizarLista(crearTabla(anuncios), document.getElementById("divLista"));
}

function handlerClickBorrar(e) {
    renderizarLista(null, document.getElementById("divLista"));
    const emisor = e.target;
    emisor.textContent = "Cargar Lista";
    emisor.removeEventListener("click", handlerClickBorrar);
    emisor.addEventListener("click", handlerClickCargar);
}

function renderizarLista(lista, contenedor) {
    while (contenedor.hasChildNodes()) {
      contenedor.removeChild(contenedor.firstChild);
    }
    if (lista) {
      contenedor.appendChild(lista);
    }
}

function crearTabla(items) {
    const tabla = document.createElement("table");
    tabla.appendChild(crearThead(items[0]));
    tabla.appendChild(crearTbody(items));
    return tabla;
  }
  
  function crearThead(item) {
    const head = document.createElement("thead");
    const tr = document.createElement("tr");
    for (const key in item) {
      if (key !== "id") {
        const th = document.createElement("th");
        const texto = document.createTextNode(key);
        th.appendChild(texto);
        tr.appendChild(th);
      }
    }
    head.appendChild(tr);
    return head;
  }
  
  function crearTbody(items) {
    const tbody = document.createElement("tbody");
    items.forEach((element) => {
      const tr = document.createElement("tr");
  
      for (const key in element) {
        if (key === "id") {
          tr.setAttribute("data-id", element[key]);
        } else {
          const td = document.createElement("td");
          const texto = document.createTextNode(element[key]);
          td.appendChild(texto);
          tr.appendChild(td);
        }
      }
      tbody.appendChild(tr);
    });
    return tbody;
  }
  
  function handlerClick(e) {
    switch (true) {
      case e.target.matches("td"):
        let id = e.target.parentNode.dataset.id;
        let auxForm = document.forms[0];
        cargarFormulario(auxForm, buscarAnuncio(id));
        break;
      case e.target.matches("#btnEliminar"):
        let idEliminar = parseInt(document.forms[0].id.value);
        if (
          confirm(
            "Confirma que desea eliminar el anuncio: " + document.forms[0].titulo.value
          )
        ) {
          let index = anuncios.findIndex((el) => el.id == idEliminar);
          anuncios.splice(index, 1);
          almacenarDatos(anuncios);
          limpiarFormulario(document.forms[0]);
          resetBotonesForm();
          handlerClickCargar();
        }
        limpiarFormulario(document.forms[0]);
        resetBotonesForm();
        break;
      default:
        return;
        break;
    }
  }
  
  function handlerSubmit(e) {
    e.preventDefault();
    const auxFormulario = e.target;
    if (auxFormulario.id.value) {
      const auxTitulo = auxFormulario.titulo.value;
      const auxTransaccion = auxFormulario.transaccion.value;
      const auxDescripcion = auxFormulario.descripcion.value;
      const auxPrecio = auxFormulario.precio.value;
      const auxId = parseInt(auxFormulario.id.value);
      const auxPuertas = auxFormulario.puertas.value;
      const auxKms = auxFormulario.kms.value;
      const auxPotencia = auxFormulario.potencia.value;
      const auxAnuncioAModificar = new Anuncio_Auto(auxId, auxTitulo, auxTransaccion,auxDescripcion, auxPrecio, auxPuertas, auxKms, auxPotencia);
      agregarSpinner();
      setTimeout(()=>{
        modificarAnuncio(auxAnuncioAModificar);
        eliminarSpinner();
        handlerClickCargar();
      }, 3000);
      
    } else {
      const auxTitulo = auxFormulario.titulo.value;
      const auxTransaccion = auxFormulario.transaccion.value;
      const auxDescripcion = auxFormulario.descripcion.value;
      const auxPrecio = auxFormulario.precio.value;
      const auxPuertas = auxFormulario.puertas.value;
      const auxKms = auxFormulario.kms.value;
      const auxPotencia = auxFormulario.potencia.value;
      const auxAnuncio = new Anuncio_Auto(Date.now(), auxTitulo, auxTransaccion,auxDescripcion, auxPrecio, auxPuertas, auxKms, auxPotencia);
      agregarSpinner();
      setTimeout(()=>{
        altaAnuncio(auxAnuncio);
        eliminarSpinner();
        handlerClickCargar();
      }, 3000);
     
    }
    limpiarFormulario(auxFormulario);
    resetBotonesForm();
  }
  
  function agregarSpinner(){
    let spinner = document.createElement("img");
    spinner.setAttribute("src", "./assets/spinner.gif");
    spinner.setAttribute("alt", "Imagen spinner");
    document.getElementById("spinner-container").appendChild(spinner);
  }
  
  function eliminarSpinner(){
    let child = document.getElementById("spinner-container").lastChild;
    document.getElementById("spinner-container").removeChild(child);
  }
  
  function almacenarDatos(data) {
    localStorage.setItem("lista", JSON.stringify(data));
  }
  
  function modificarAnuncio(pEdit)
  {
   let index = anuncios.findIndex((p)=>{return p.id == pEdit.id});
   anuncios.splice(index, 1, pEdit);
   almacenarDatos(anuncios);
  }
  
  
  function altaAnuncio(auxAnuncio) {
    anuncios.push(auxAnuncio);
    almacenarDatos(anuncios);
    handlerClickCargar();
  }
  
  function limpiarFormulario(frm) {
    frm.reset(frm);
    document.forms[0].id.value = "";
  }
  
  function cargarFormulario(frm, anuncio) {
    frm.id.value = anuncio.id;
    frm.titulo.value = anuncio.titulo;
    frm.descripcion.value = anuncio.descripcion;
    frm.transaccion.value = anuncio.transaccion;
    frm.precio.value = anuncio.precio;
    frm.puertas.value = anuncio.puertas;
    frm.kms.value = anuncio.kms;
    frm.potencia.value = anuncio.potencia;
    cambiarBotonesForm();
  }
  
  function buscarAnuncio(id) {
    let auxAnuncioSeleccionado = null;
    auxAnuncioSeleccionado = anuncios.filter((p) => p.id == id)[0];
    return auxAnuncioSeleccionado;
  }
  
  function resetBotonesForm() {
    document.getElementById("btnSubmit").value = "Guardar";
    document.getElementById("btnEliminar").classList.replace("visible", "oculto");
  }
  
  function cambiarBotonesForm() {
    document.getElementById("btnSubmit").value = "Modificar";
    document.getElementById("btnEliminar").classList.replace("oculto", "visible");
  }
  
