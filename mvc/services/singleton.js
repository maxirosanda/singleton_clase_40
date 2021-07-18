  
export default class BaseDeDatos {
    static instancia;

    constructor() {
        if(!BaseDeDatos.instancia) {
            this.base =  process.argv[3]
            BaseDeDatos.instancia = this;
            console.log(`Guardar Base de datos ${this.base}`);
        } else {
            console.log(`recuperar Base de datos : ${this.base}`);
            return  BaseDeDatos.instancia
        }
    }

    obtenerBaseDeDatos() {
        return this.base;
    }
}