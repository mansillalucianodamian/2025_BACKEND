import jwt from 'jsonwebtoken'

import MemberWorkspaceService from '../services/memberWorkspace.service.js'
import ENVIROMENT from '../config/enviroment.config.js'

class MemberController {
    static async confirmInvitation(request, response) {
        try {
            const { invitation_token } = request.params
            await MemberWorkspaceService.confirmInvitation(invitation_token)

            // éxito → redirigimos con flag
            return response.redirect(`${ENVIROMENT.URL_FRONTEND}/login?verified=true`)
        } catch (error) {
            // token inválido
            if (error instanceof jwt.JsonWebTokenError) {
                return response.redirect(`${ENVIROMENT.URL_FRONTEND}/login?invite_error=invalid_token`)
            }

            // token expirado
            if (error instanceof jwt.TokenExpiredError) {
                return response.redirect(`${ENVIROMENT.URL_FRONTEND}/login?invite_error=expired_token`)
            }

            // errores controlados desde el service
            if (error.status) {
                if (error.message.includes('ya es miembro')) {
                    return response.redirect(`${ENVIROMENT.URL_FRONTEND}/login?invite_error=already_member`)
                }
                if (error.message.includes('Usuario no encontrado')) {
                    return response.redirect(`${ENVIROMENT.URL_FRONTEND}/login?invite_error=user_not_registered`)
                }
                return response.redirect(`${ENVIROMENT.URL_FRONTEND}/login?invite_error=unknown`)
            }

            // error inesperado
            console.error('ERROR al confirmar invitación', error)
            return response.redirect(`${ENVIROMENT.URL_FRONTEND}/login?invite_error=server_error`)
        }
    }
}

export default MemberController
