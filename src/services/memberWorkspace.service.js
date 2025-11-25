import jwt from 'jsonwebtoken'
import MemberWorkspaceRepository from '../repositories/memberWorkspace.repository.js'
import { ServerError } from '../error.js'
import ENVIROMENT from '../config/enviroment.config.js'
class MemberWorkspaceService {
    static async confirmInvitation(invitation_token) {
        const invitation_token_decoded = jwt.verify(invitation_token, ENVIROMENT.JWT_SECRET)
        console.log("Ver token", invitation_token_decoded)
        const {
            id_invited,
            id_workspace,
            invited_role
        } = invitation_token_decoded
        const is_already_member = await MemberWorkspaceRepository.getByUserIdAndWorkspaceId(id_invited, id_workspace)
        if (is_already_member) {
            throw new ServerError(400, 'Usuario ya es miembro del espacio de trabajo')
        }
        await MemberWorkspaceRepository.create({
            id_user: id_invited,
            id_workspace: id_workspace,
            role: invited_role || "member"
        });
         return { id_workspace }
    }
}

export default MemberWorkspaceService