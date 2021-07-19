import mongoose from 'mongoose'
//  require('dotenv').config({path:'variables.env'})
import logger from 'pino'

const loggerInfo = logger()
const loggerError = logger('./logs/error.log')

export const conectarDB = async () => {
  try {
    const URL = 'mongodb+srv://maxirosanda:dalma123@cluster0.cawk2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
    loggerInfo.info('base de datos conectada')
  } catch (e) {
    loggerError.error(`error ${e}`)
    process.exit(1)
  }
}
