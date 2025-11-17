import ChannelRepository from "../repositories/channel.repository.js";
import ChannelService from "../services/channel.service.js";

class ChannelController {
    static async create(request, response) {
        try {
            const { workspace_selected } = request;
            const { name } = request.body;
            // Validar nombre de canal ok
            if (!name) {
                return response.status(400).json({
                    ok: false,
                    message: 'El nombre del canal es requerido',
                });
            }
            // Crear el canal usando .createChannel
            const channel_list = await ChannelService.create(workspace_selected._id, name);
            response.status(201).json({
                ok: true,
                message: 'Canal creado',
                status: 201,
                data: {
                    channels: channel_list
                }
            });
        } catch (error) {
            console.error('Error al crear:', error);
            response.status(500).json({
                ok: false,
                message: 'Error interno del servidor',
            });
        }
    }
    static async getAllByWorkspace(request, response) {
        try {
            //Obtener la lista de canales de un espacio de trabajo
            const { workspace_id } = request.params
            const channels = await ChannelRepository.getAllByWorkspaceId(
                workspace_id
            );

            return response.json({
                ok: true,
                status: 200,
                message: "Lista de canales obtenida",
                data: {
                    channels: channels
                }
            })


        }
        catch (error) {
            console.error("Error al listar channels:", error);
            return response.status(500).json({
                ok: false,
                status: 500,
                message: "Error interno del servidor al listar los canales",
            });
        }
    }

}


export default ChannelController