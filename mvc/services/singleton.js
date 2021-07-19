
export default class BaseDeDatos {
    static instancia
    constructor (base) {
        if(!BaseDeDatos.instancia) {
            this.base =  base
            BaseDeDatos.instancia = this
            console.log(`Guardar Base de datos ${this.base}`)
        } else {
            console.log(`recuperar Base de datos`)
            return  BaseDeDatos.instancia
        }
    }
}
