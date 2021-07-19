import Producto from '../models/productos.js'
import Mensaje from '../models/mensajes.js'
import mongoose from 'mongoose'
import logger from 'pino'

mongoose.set('useCreateIndex', true)
const loggerError = logger('./logs/error.log')

function makeid (length) {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const agregar = async (req, res, next) => {
  try {
    const producto = await Producto.find({}).lean()
    res.json(producto)
  } catch (e) { loggerError.error(e) }
}

export const getProductos = async (req, res, next) => {
  try {
    const producto = await Producto.find({}).lean()
    await res.json({ productos: producto, id_usuario: req.user._id, activo: req.isAuthenticated() })
  } catch (e) { loggerError.error(e) }
}
export const getProducto = async (req, res, next) => {
  const id = req.params.id
  try {
    const producto = await Producto.find({ _id: id }).lean()
    const mensaje = await Mensaje.find({ articulo: id }).lean()
    console.log(producto)
    await res.json({ producto: producto, mensaje: mensaje, id_usuario: req.user._id })
  } catch (e) { loggerError.error(e) }
}

export const createProductos = async (req, res, next) => {
  try {
    const producto = new Producto(req.body)
    await producto.save()
    await res.status(200).send('Producto agregado a la bases de datos')
  } catch (e) { console.log(e) }
}

export const updateProducto = async (req, res, next) => {
  const id = req.params.id
  const { nombre, descripcion, precio, url, stock } = req.body
  const nuevoproducto = {}
  if (nombre) nuevoproducto.nombre = nombre
  if (descripcion) nuevoproducto.descripcion = descripcion
  if (precio) nuevoproducto.precio = precio
  if (stock) nuevoproducto.stock = stock
  if (url) nuevoproducto.url = url
  nuevoproducto.actualizar = makeid(20)
  try {
    await Producto.findOneAndUpdate(
      { _id: id },
      { $set: nuevoproducto },
      { new: true }
    )
    await res.status(200).send('Producto actualizado en la base de datos')
  } catch (e) { loggerError.error(e) }
}
export const deleteProductos = async (req, res, next) => {
  const id = req.params.id
  try {
    await Producto.deleteOne({ _id: id })
    await res.status(200).send('Producto borrado de la base de datos')
  } catch (e) { loggerError.error(e) }
}
