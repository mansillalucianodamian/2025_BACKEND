import express from 'express'
import WorkspaceRepository from '../repositories/workspace.repository.js'
import WorkspaceController from '../controllers/workspace.controller.js'
import authMiddleware from '../controllers/authMiddleware.js'

const workspaceRouter = express.Router()


/* workspaceRouter.get(
    '/all',
    WorkspaceController.getAll
) */

    //Obtener la lista de espacios de trabajos de EL cliente que este consultando.
workspaceRouter.get(
    '/',
    authMiddleware,
    WorkspaceController.getAll
)


export default workspaceRouter