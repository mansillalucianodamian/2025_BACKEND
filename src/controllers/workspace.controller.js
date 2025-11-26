import ENVIROMENT from "../config/enviroment.config.js"
import mailTransporter from "../config/mailTransporter.config.js"
import { ServerError } from "../error.js"
import MemberWorkspaceRepository from "../repositories/memberWorkspace.repository.js"
import UserRepository from "../repositories/user.repository.js"
import WorkspaceRepository from "../repositories/workspace.repository.js"
import ChannelService from "../services/channel.service.js"
import WorkspaceService from "../services/workspace.service.js"
import jwt from 'jsonwebtoken'

class WorkspaceController {
    static async getAll(request, response) {
        try {
            //Muestro los datos de sesion del usuario
            const user = request.user

            //Necesito saber el user_id del cliente para saber exactamente quien es y que lista debo darle
            const workspaces = await WorkspaceService.getAll(user.id)

            response.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: 'Espacios de trabajo obtenidos exitosamente',
                    data: {
                        workspaces: workspaces,
                        email: user.email
                    }
                }
            )
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
                    'ERROR AL OBTENER LOS WORKSPACES', error
                )
                return response.status(500).json({
                    ok: false,
                    message: 'Error interno del servidor',
                    status: 500
                })
            }
        }
    }

    static async create(request, response) {
        try {
            // El usuario viene del token gracias al authMiddleware
            const user_id = request.user.id;
            const { name, url_img } = request.body;

            // Crear el workspace y asociar al usuario como admin
            const workspace_created = await WorkspaceService.create(user_id, name, url_img);
            response.status(201).json(
                {
                    status: 201,
                    ok: true,
                    message: 'Workspace creado con exito',
                    data: {

                        workspace_created
                    }
                }
            )
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
                    'ERROR AL OBTENER LOS WORKSPACES', error
                )
                return response.status(500).json({
                    ok: false,
                    message: 'Error interno del servidor',
                    status: 500
                })
            }
        }
    }

    static async invite(request, response) {
        try {

            const { workspace_selected, user, member } = request
            const { invited_email } = request.body

            //Buscar al usuario y validar que exista y este activo
            const user_invited = await UserRepository.getByEmail(invited_email)
            console.log({ user_invited })
            if (!user_invited) {
                throw new ServerError(404, 'Usuario no encontrado')
            }
            //Verificar que NO es miembro actual de ese workspace 
            const member_data = await MemberWorkspaceRepository.getByUserIdAndWorkspaceId(
                user_invited._id, workspace_selected._id
            )

            if (member_data) {
                throw new ServerError(409, `Usuario con email ${invited_email} ya es miembro del workspace`)
            }

            const id_inviter = member._id
            const invite_token = jwt.sign(
                {
                    id_invited: user_invited._id,
                    email_invited: invited_email,
                    id_workspace: workspace_selected._id,
                    id_inviter: id_inviter
                },
                ENVIROMENT.JWT_SECRET,
                {
                    expiresIn: '7d'
                }

            )

            //Enviar mail de invitacion al usuario invitado


            await mailTransporter.sendMail(
                {
                    from: ENVIROMENT.GMAIL_USER,
                    to: invited_email,
                    subject: 'Invitacion al workspace',
                    html: `<h1>El usuario: ${user.email} te ha enviado una invitación
                            al workspace ${workspace_selected.name}<h1/>
                            <a href="${ENVIROMENT.URL_BACKEND}/api/member/confirm-invitation/${invite_token}">
                                Click para aceptar
                            <a/>
                            `
                }
            )

            response.status(200).json({
                ok: true,
                status: 200,
                message: 'Usuario invitado con exito',
                data: null
            })

        }
        catch (error) {
            console.log(error)
            //Evaluamos si es un error que nosotros definimos
            if (error.status) {
                return response.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                return response.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: 'Error interno del servidor'
                    }
                )
            }
        }
    }

    static async getById(request, response) {
        try {
            const { workspace_selected, member, user } = request

            const channels = await ChannelService.getAllByWorkspaceId(workspace_selected._id)

            response.json(
                {
                    ok: true,
                    status: 200,
                    message: 'Espacio de trabajo obtenido',
                    data: {
                        workspace_detail: workspace_selected,
                        channels: channels
                    }
                }
            )
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
                    'ERROR AL obtener detalles del workspace', error
                )
                return response.status(500).json({
                    ok: false,
                    message: 'Error interno del servidor',
                    status: 500
                })
            }
        }
    }
    static async delete(request, response) {
        try {
            const { workspace_selected, member, user } = request
            await WorkspaceRepository.deleteById(workspace_selected._id)
            response.json(
                {
                    ok: true,
                    status: 200,
                    message: 'Espacio de trabajo eliminado',
                    data: null
                }
            )
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
                    'ERROR AL obtener detalles del workspace', error
                )
                return response.status(500).json({
                    ok: false,
                    message: 'Error interno del servidor',
                    status: 500
                })
            }
        }
    }

    static async update(request, response) {
        try {
            const { workspace_selected, member } = request;
            const { name, url_img } = request.body;

            // Validar permisos
            if (member.role !== 'admin') {
                return response.status(403).json({
                    ok: false,
                    message: 'No tienes permisos para actualizar este workspace',
                    status: 403
                });
            }

            // Llamar al servicio
            const updated = await WorkspaceService.updateWorkspace(
                workspace_selected._id,
                name,
                url_img
            );

            return response.json({
                ok: true,
                status: 200,
                message: 'Espacio de trabajo actualizado',
                data: updated
            });
        } catch (error) {
            return response.status(error.status || 500).json({
                ok: false,
                message: error.message || 'Error interno del servidor',
                status: error.status || 500
            });
        }
    }

}

export default WorkspaceController