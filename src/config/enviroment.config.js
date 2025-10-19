import dotenv from 'dotenv'
//cargar las variables de entorno en process.env
dotenv.config()
const ENVIROMENT = {
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    GMAIL_USER: process.env.GMAIL_USER,
    PORT: process.env.PORT,
    URL_FRONTEND: process.env.URL_FRONTEND,
    JWT_SECRET: process.env.JWT_SECRET,
   /*  MONGO_DB_HOST: process.env.MONGO_DB_HOST,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME, */
    MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING
}


export default ENVIROMENT