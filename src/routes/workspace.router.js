import express from 'express'
import WorkspaceRepository from '../repositories/workspace.repository.js'
import WorkspaceController from '../controllers/workspace.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import workspaceMiddleware from '../middlewares/workspaceMiddleware.js'
import ChannelController from '../controllers/channel.controller.js'
import channelMiddleware from '../middlewares/channelMiddleware.js'
import MessagesController from '../controllers/messages.controller.js'


const workspaceRouter = express.Router()

//Obtener espacios de trabajo
workspaceRouter.get(
    '/',
    authMiddleware,
    WorkspaceController.getAll
)

//Crear espacio de trabajo
workspaceRouter.post(
    '/',
    authMiddleware,
    WorkspaceController.create
)
//Eliminar un workspaces
workspaceRouter.delete(
    '/:workspace_id',
    authMiddleware,
    workspaceMiddleware(['admin']),
    WorkspaceController.delete
)

//Obtener canales
workspaceRouter.get(
    '/:workspace_id/channels',
    authMiddleware, 
    workspaceMiddleware(),
    ChannelController.getAllByWorkspace
)

//Crear canales
workspaceRouter.post(
    '/:workspace_id/channels',
    authMiddleware,
    workspaceMiddleware(['admin']), 
    ChannelController.create
)

//Crear mensajes
workspaceRouter.post(
    '/:workspace_id/channels/:channel_id/messages',
    authMiddleware,
    workspaceMiddleware(),
    channelMiddleware,
    MessagesController.create
)
//Obtener mensajes
workspaceRouter.get(
    '/:workspace_id/channels/:channel_id/messages',
    authMiddleware,
    workspaceMiddleware(),
    channelMiddleware,
    MessagesController.getAllByChannelId
)

//Test
workspaceRouter.get(
    '/:workspace_id/test',
    authMiddleware, 
    workspaceMiddleware(),
    (request, response) => {
        console.log(request.workspace_selected)
        console.log(request.member)
        response.json({
            ok: true,
            status: 200,
            message: 'test'
        })
    }
)

//Invitar a un usuario
workspaceRouter.post(
    '/:workspace_id/invite', 
    authMiddleware, 
    workspaceMiddleware(['admin']), 
    WorkspaceController.invite
)



export default workspaceRouter