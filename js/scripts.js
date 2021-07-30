import { Anuncio_Auto } from "./Anuncio_Auto.js";
let boton = null;
let anuncios = [];
let anuncionsFiltrados = [];
let checksColumnas = [];

window.addEventListener("DOMContentLoaded", () => {
 TraerTodoFetch();
  document.forms[0].addEventListener("submit", handlerSubmit);
  document.addEventListener("click", handlerClick);
  document.getElementById("outResultado").value = "N/A";
  let selects = document.getElementById("filtroOperacion");
  selects.addEventListener("change", handlerFiltro);
});

function handlerChecks(e) {
  handlerClickCargar(anuncios);
  document.getElementById("outResultado").value = "N/A";
  guardarSeleccion();
  
}

function handlerFiltro(e) {
  let indicador = document.getElementById("filtroIndicador");
  indicador.addEventListener("change", filtrarRows)
}

function handlerClickCargar(e) {
  renderizarLista(crearTabla(anuncios), document.getElementById("divLista"));
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
    let valKey = validarKey(key);
    if (key !== "id") {
      validarKey(key);
      if (valKey) {
        const th = document.createElement("th");
        const texto = document.createTextNode(key);
        th.appendChild(texto);
        tr.appendChild(th);
      }
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
        let valKey = validarKey(key);
        if (key === "id") {
          tr.setAttribute("data-id", element[key]);
        } else {
          if (valKey) {
            const td = document.createElement("td");
            const texto = document.createTextNode(element[key]);
            td.appendChild(texto);
            tr.appendChild(td);
          }
        }
    }
    tbody.appendChild(tr);
  });
  return tbody;
}

function validarKey(key) {
  let retValue = false;
  let checkBoxes = document.querySelectorAll("input[type=checkbox]");
  checkBoxes.forEach((element) => {
    if (element.checked) {
      if (element.id.toString() == key) {
        retValue = true;
      }
    }
  });
  return retValue;
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
          "Confirma que desea eliminar el anuncio: " +
            document.forms[0].titulo.value
        )
      ) {;
        EliminarFetch(idEliminar);
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
    const auxAnuncioAModificar = new Anuncio_Auto(
      auxId,
      auxTitulo,
      auxTransaccion,
      auxDescripcion,
      auxPrecio,
      auxPuertas,
      auxKms,
      auxPotencia
    );
    agregarSpinner();
    setTimeout(() => {
      modificarAjax(auxAnuncioAModificar);
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
    const auxAnuncio = new Anuncio_Auto(
      Date.now(),
      auxTitulo,
      auxTransaccion,
      auxDescripcion,
      auxPrecio,
      auxPuertas,
      auxKms,
      auxPotencia
    );
    agregarSpinner();
    setTimeout(() => {
      altaAjax(auxAnuncio);
      eliminarSpinner();
      handlerClickCargar();
    }, 3000);
  }
  limpiarFormulario(auxFormulario);
  resetBotonesForm();
}

function agregarSpinner() {
  let spinner = document.createElement("img");
  spinner.setAttribute("src", "./assets/spinner.gif");
  spinner.setAttribute("alt", "Imagen spinner");
  document.getElementById("spinner-container").appendChild(spinner);
}

function eliminarSpinner() {
  let child = document.getElementById("spinner-container").lastChild;
  document.getElementById("spinner-container").removeChild(child);
}

function almacenarDatos(data) {
  localStorage.setItem("lista", JSON.stringify(data));
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

function altaAjax(nuevoAnuncio) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 299) 
      {
       anuncios.push(JSON.parse(xhr.responseText));
            if (anuncios.length > 0) 
            {
              handlerClickCargar(anuncios);
              let ckecks = document.getElementById("divChecks");
              ckecks.addEventListener("change", handlerChecks);
            }
      } else {
        const statusText = xhr.statusText || "Ocurrio un error";
        console.error(`Error: ${xhr.status} : ${statusText}`);
      }
    }
  };
  xhr.open("POST", "http://localhost:3000/anuncios", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
  xhr.send(JSON.stringify(nuevoAnuncio));
}

function modificarAjax(AnuncioEditado) {
  let id = AnuncioEditado.id;
  let index = -1;
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 299) {
        anuncios = JSON.parse(xhr.responseText);
        index = anuncios.findIndex((p) => {
          return p.id == id;
        });
        anuncios.splice(index, 1, AnuncioEditado);
          handlerClickCargar(anuncios);
          let ckecks = document.getElementById("divChecks");
          ckecks.addEventListener("change", handlerChecks);
      } else {
        const statusText = xhr.statusText || "Ocurrio un error";
        console.error(`Error: ${xhr.status} : ${statusText}`);
      }

    }
  };
  xhr.open("PUT", `http://localhost:3000/anuncios/${id}`);
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
  xhr.send(JSON.stringify(AnuncioEditado));
}

function EliminarAjax(id) {
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 299) {
        anuncios = JSON.parse(xhr.responseText);
        console.log(anuncios);
        handlerClickCargar(anuncios);
      } else {
        const statusText = xhr.statusText || "Ocurrio un error";
        console.error(`Error: ${xhr.status} : ${statusText}`);
      }
    }
  };

  xhr.open("DELETE", `http://localhost:3000/anuncios/${id}`);
  xhr.send();
}

function TraerTodoFetch() {
 restaurarChecks();
  fetch("http://localhost:3000/anuncios")
    .then((res) => {
      return res.ok ? res.json() : Promise.reject(res);
    })
    .then((data) => {
      anuncios = data;
      if (anuncios.length > 0) {
      handlerClickCargar(anuncios);
      let ckecks = document.getElementById("divChecks");
        ckecks.addEventListener("change", handlerChecks);
   
      }
    })
    .catch((err) => {
      console.error(`Error: ${err.status} : ${err.statusText}`);
    })
    .finally(() => {
    });
}

function EliminarFetch(id) {
  agregarSpinner();
  fetch(`http://localhost:3000/anuncios/${id}`, { method: "DELETE" })
    .then((res) => {
      return res.ok ? res.json() : Promise.reject(res);
    })
    .then((data) => {
      anuncios = data;
      handlerClickCargar(anuncios);
      let ckecks = document.getElementById("divChecks");
        ckecks.addEventListener("change", handlerChecks);
    })
    .catch((err) => {
      console.error(`Error: ${err.status} : ${err.statusText}`);
    })
    .finally(() => {
      eliminarSpinner();
    });
}

function filtrarRows()
{
const select = document.getElementById("filtroOperacion").value;
const indicador = document.getElementById("filtroIndicador").value;
const output = document.getElementById("resultado");

switch (select) {
  case "venta":
    anuncionsFiltrados = anuncios.filter((p)=> p.transaccion == "venta");
    renderizarLista(crearTabla(anuncionsFiltrados), document.getElementById("divLista"));
    if (indicador == "promedio") 
    {
      let suma = 0;
      let sumaPotencia = 0;
      let precios =[];
      let potencias = [];
      let prom = 0;
      let promPotencia = 0;
      precios = anuncionsFiltrados.map(function (anuncio) {
 
        return parseInt(anuncio.precio); 
     
    });
      suma = precios.reduce((p, a) => p + a, 0);

    prom = suma / precios.length;
    document.getElementById("outResultado").value = prom;
    potencias = anuncionsFiltrados.map(function (anuncio) {
 
      return parseInt(anuncio.potencia); 
   
  });
  sumaPotencia = potencias.reduce((a, b) => a + b, 0);
  promPotencia = sumaPotencia / potencias.length;
  console.log(promPotencia);
  document.getElementById("resultadoPotencia").value = promPotencia;
    }else if(indicador == "minimo")
    {
      let minimo = 0;
      let precios =[];
      precios = anuncionsFiltrados.map(function (anuncio) {
 
        return parseInt(anuncio.precio); 
     
    });
    minimo = Math.min.apply(null, precios);
    document.getElementById("outResultado").value = minimo;
    }else
    {
      let maximo = 0;
      let precios =[];
      precios = anuncionsFiltrados.map(function (anuncio) {
 
        return parseInt(anuncio.precio); 
     
    });
    maximo = Math.max.apply(null, precios);
    document.getElementById("outResultado").value = maximo
    }
    break;
  case "alquiler":
    anuncionsFiltrados = anuncios.filter((p)=> p.transaccion == "alquiler");
    renderizarLista(crearTabla(anuncionsFiltrados), document.getElementById("divLista"));
    if (indicador == "promedio") 
    {
      let suma = 0;
      let sumaPotencia = 0;
      let precios =[];
      let potencias = [];
      let prom = 0;
      let promPotencia = 0;
      precios = anuncionsFiltrados.map(function (anuncio) {
 
        return parseInt(anuncio.precio); 
     
    });
      suma = precios.reduce((a, b) => a + b, 0);
    prom = suma / precios.length;
    document.getElementById("outResultado").value = prom;

    potencias = anuncionsFiltrados.map(function (anuncio) {
 
      return parseInt(anuncio.potencia); 
   
  });
  sumaPotencia = potencias.reduce((a, b) => a + b, 0);
  promPotencia = sumaPotencia / potencias.length;
  console.log(promPotencia);
  document.getElementById("resultadoPotencia").value = promPotencia;
    }else if(indicador == "minimo")
    {
      let minimo = 0;
      let precios =[];
      precios = anuncionsFiltrados.map(function (anuncio) {
 
        return parseInt(anuncio.precio); 
     
    });
    minimo = Math.min.apply(null, precios);
    document.getElementById("outResultado").value = minimo;
    }else
    {
      let maximo = 0;
      let precios =[];
      precios = anuncionsFiltrados.map(function (anuncio) {
 
        return parseInt(anuncio.precio); 
     
    });
    maximo = Math.max.apply(null, precios);
    document.getElementById("outResultado").value = maximo
    }

      break;
  default:
    document.getElementById("outResultado").value = "N/A"
    break;
}

}

function guardarSeleccion(){
  let checkBoxesSelec = document.querySelectorAll("input[type=checkbox]");
  let idChecks = [];
  checkBoxesSelec.forEach((element) => {
    if (element.checked) {
     idChecks.push(element.id);
    }
  });
  almacenarDatos(idChecks);
}

function restaurarChecks(){
  let checkBoxesSelec = document.querySelectorAll("input[type=checkbox]");
  checkBoxesSelec.forEach((element) => {
    if (element.checked == false) {
      let ids = [];
      ids = localStorage.getItem("lista");
      let arrayIds = ids.split(",");
      arrayIds.forEach((checkId)=>{
        if(element.id == checkId){
          console.log("element.id :" + element.id);
          console.log("checkId :" + checkId);
          element.checked = true;
        }
      })
    }
  });

  
}
