import WorkspaceRepository from "../repositories/workspace.repository.js"
import WorkspaceService from "../services/workspace.service.js"

class WorkspaceController {
    static async getAll (request, response){
        try{
            //Necesito saber el user_id del cliente para saber exactamente quien es y que lista debo darle

           /*  const workspaces = await WorkspaceService.getAll() */
            console.log(request.user)
        response.status(200).json({
            ok: true,
            message: 'Espacios de trabajo obtenidos con exito',
            status: 200,
            data: {
                //workspaces: workspaces
            }
        })
        }
        catch (error) {
           if (error.status) {
                return response.status(error.status).json({
                    ok: false,
                    message: error.message,
                    status: error.status
                })
            }
            else {
                console.error(
                    'ERROR AL OBTERNER LOS WORKSPACES', error
                )
                return response.status(500).json({
                    ok: false,
                    message: 'Error interno del servidor',
                    status: 500
                })
            }
        }
        
    }
}

export default WorkspaceController