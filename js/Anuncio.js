export class Anuncio {
  constructor(id, titulo, transaccion, descripcion, precio) {
    console.log(titulo);
    this.id = id;
    this.titulo = titulo;
    this.transaccion = transaccion;
    this.descripcion = descripcion;
    this.precio = precio;
  }
}
