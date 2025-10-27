import express from 'express'
import WorkspaceRepository from '../repositories/workspace.repository.js'
import WorkspaceController from '../controllers/workspace.controller.js'
import authMiddleware from '../controllers/authMiddleware.js'
import workspaceMiddleware from '../middlewares/workspaceMiddleware.js'

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
workspaceRouter.post(
    '/',
    authMiddleware,
    WorkspaceController.create
)
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

export default workspaceRouter