import connectToMongoDB from "./config/configMongoDB.config.js";
import express from 'express'
import authRouter from "./routes/auth.router.js";
import workspaceRouter from "./routes/workspace.router.js";
import randomMiddleware from "./middlewares/random.middleware.js";
import mailTransporter from "./config/mailTransporter.config.js";
import ENVIROMENT from "./config/enviroment.config.js";
import cors from 'cors'
import memberRouter from "./routes/member.router.js";
import MessagesChannelRepository from "./repositories/messageChannel.repository.js";

connectToMongoDB()

const app = express()

//configuro a mi Api como publica, cualquier dominio puede hacer peticiones
app.use(cors())

app.use(express.json())

//Todas las consultas que empiezen con /api/auth va a ser gestionadas por el authRouter
app.use('/api/auth', authRouter)
app.use('/api/workspace', workspaceRouter)
app.use('/api/member', memberRouter)

/* mailTransporter.sendMail({
    from: ENVIROMENT.GMAIL_USER, //desde quien-
    to: "lucho878@gmail.com", //a quien
    subject: 'Prueba', //asunto
    html: '<h1>Hola desde Node JS</h1>', //cuerpo

}) */






app.listen(
    ENVIROMENT.PORT || 8080,
    () => {
        console.log(`Tu servidor se esta ejecutando correctamente en el puerto ${ENVIROMENT.PORT}`)
    }
)

/* MessagesChannelRepository.create(
    "69021f8d1f59e8d52c3e60f8",
    "68f8d8cc6968605f86bc6c90",
    'hola'
) */
/* MessagesChannelRepository.getAllByChannelId("69021f8d1f59e8d52c3e60f8").then(
    (messages) => console.log(messages[0])
) */