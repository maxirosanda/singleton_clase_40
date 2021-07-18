import  Carrito from '../models/carrito.js'
import logger from 'pino'
const loggerError = logger('./logs/error.log')


export const getCarritos = async (req, res, next) => {
  try{

     const carrito = await Carrito.find({id_comprador: req.user._id}).lean() 
     await res.json({productos: carrito})  
  }
  catch (e) { loggerError.error(e) } 
  }



  export const createCarrito = async (req, res, next) => {  
    try{

      const encontrado = await Carrito.find({codigo:req.body.codigo}).lean() 
      if(!(Object.entries(encontrado).length === 0))
        {
       
          if(encontrado[0].id_comprador == req.user._id){
            let nuevoproducto={}
            nuevoproducto.cant_compra= encontrado[0].cant_compra + parseInt(req.body.cant_compra); 
            let carrito = await Carrito.findOneAndUpdate(
            {_id: encontrado[0]._id},
            {$set:nuevoproducto},
            {new:true}
            )
          await res.redirect("/carrito")
          }else{
            req.body.id_comprador=req.user._id
            const carrito = new Carrito(req.body)
            await carrito.save()
            await res.redirect("/carrito")
          }
     
      }else
      {
        const carrito = new Carrito(req.body)
        await carrito.save()
        await res.redirect("/carrito")
     
      }

    }
  catch (e) {  loggerError.error(e) }
}



export const updateCarrito = async (req, res, next) => { 
    let id = req.params.id;
    const {nombre,codigo,descripcion,url,precio,cant_compra}=req.body
    let nuevoproducto={}
    
    if(nombre) nuevoproducto.nombre=nombre
    if(codigo) nuevoproducto.codigo=codigo
    if(descripcion) nuevoproducto.descripcion=descripcion
    if(url) nuevoproducto.url=url
    if(precio) nuevoproducto.precio=precio
    if(cant_compra) nuevoproducto.cant_compra= cant_compra
  
    try{
      let carrito = await Carrito.findOneAndUpdate(
      {_id: id},
      {$set:nuevoproducto},
      {new:true}
      )
      await res.status(200).json(carrito)  
    }
    catch (e) {  loggerError.error(e) }
  
    }

  export const deleteCarrito = async (req, res, next) => {
    let id = req.params.id;
    try{
     const  carrito = await  Carrito.deleteOne({_id: id})
      await res.redirect("/carrito")  
    }
     catch (e) {  loggerError.error(e) } 

}