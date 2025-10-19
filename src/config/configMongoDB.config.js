
import mongoose from 'mongoose'
import ENVIROMENT from './enviroment.config.js'

async function connectToMongoDB (){
    try{
        const connection_string = ENVIROMENT.MONGO_DB_CONNECTION_STRING
        await mongoose.connect(connection_string)
        console.log("Conexion con DB exitosa!")
    }
    catch(error){
        console.log('[SERVER ERROR]: Fallo en la conexion',  error)
    }
}

export default connectToMongoDB