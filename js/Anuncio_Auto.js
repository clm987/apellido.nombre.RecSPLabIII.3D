import { Anuncio } from "./Anuncio.js";
export class Anuncio_Auto extends Anuncio {
constructor(auxId, auxTitulo, auxTransaccion,auxDescripcion, auxPrecio, puertas, kms, potencia){
super(auxId, auxTitulo, auxTransaccion,auxDescripcion, auxPrecio);
this.puertas = puertas;
this.kms = kms;
this.potencia = potencia;
}
}