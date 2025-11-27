
import ENVIROMENT from "../config/enviroment.config.js"
import mailTransporter from "../config/mailTransporter.config.js"
import { ServerError } from "../error.js"
import MemberWorkspaceRepository from "../repositories/memberWorkspace.repository.js"
import UserRepository from "../repositories/user.repository.js"
import WorkspaceRepository from "../repositories/workspace.repository.js"
import jwt from 'jsonwebtoken'

class WorkspaceService {
    static async getAll(user_id) {
        const members = await MemberWorkspaceRepository.getAllByUserId(user_id)
        return members
    }
    static async create(user_id, name, url_image) {
        console.log("Creando workspace:", user_id, name, url_image);
        const workspace_created = await WorkspaceRepository.create(name, url_image);
        await MemberWorkspaceRepository.create({
            id_user: user_id,
            id_workspace: workspace_created._id,
            role: 'admin'
        });
        return workspace_created;
    }

    static async invite(member, workspace_selected, email_invited, role_invited) {
        const user_invited = await UserRepository.getByEmail(email_invited)
        if (!user_invited) {
            throw new ServerError(404, 'No existe el usuario')
        }

        const already_member = await MemberWorkspaceRepository.getByUserIdAndWorkspaceId(user_invited._id, workspace_selected._id)

        if (already_member) {
            throw new ServerError(400, 'Usuario ya es un miembro de este workspace')
        }

        const invitation_token = jwt.sign(
            {
                id_invited: user_invited._id,
                id_inviter: member._id,
                id_workspace: workspace_selected._id,
                invited_role: role_invited
            },
            ENVIROMENT.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        )

        await mailTransporter.sendMail({
            to: email_invited,
            from: ENVIROMENT.GMAIL_USER,
            subject: "Te han invitado a un espacio de trabajo",
            html: `
                        <h1>Has sido invitado al workspace: ${workspace_selected.name}</h1>
                        <a href="${ENVIROMENT.URL_BACKEND}/api/member/confirm/${invitation_token}">Aceptar</a>
                        `
        })
    }

    static async updateWorkspace(workspace_id, name, url_img) {
        try {
            if (!workspace_id) {
                const error = new Error("workspace_id requerido");
                error.status = 400;
                throw error;
            }

            if (!name && !url_img) {
                const error = new Error("Debes enviar al menos un campo para actualizar");
                error.status = 400;
                throw error;
            }

            const updateData = {};
            if (name) updateData.name = name;       // 👈 usar 'name'
            if (url_img) updateData.url_img = url_img; // 👈 usar 'url_img'

            const workspace_updated = await WorkspaceRepository.updateById(
                workspace_id,
                updateData
            );

            if (!workspace_updated) {
                const error = new Error("Workspace no encontrado");
                error.status = 404;
                throw error;
            }

            return workspace_updated;
        } catch (error) {
            console.error("[SERVICE ERROR]: no se pudo actualizar el workspace", error);
            throw error;
        }
    }

}


export default WorkspaceService