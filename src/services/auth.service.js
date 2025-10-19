import ENVIROMENT from "../config/enviroment.config.js";
import mailTransporter from "../config/mailTransporter.config.js";
import { ServerError } from "../error.js";
import UserRepository from "../repositories/user.repository.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


class AuthService {
    static async register(email, password, name) {

        console.log(email, password, name)
        const user = await UserRepository.getByEmail(email)
        if (user) {
            throw new ServerError(400, 'Email ya en uso')
        }

        const password_hashed = await bcrypt.hash(password, 12)
        const user_created = await UserRepository.create(name, email, password_hashed)
        const user_id_created = user_created._id
        //CREAMOS UN JSON WEB TOKEN
        //Un JSON web token es un objeto pasado a texto con una firma (SIGNATURE)
        //Vamos a enviar entre JWT por URL 

        //.sing() firmar un token
        const verification_token = jwt.sign(
            {
                user_id: user_id_created
            },
            ENVIROMENT.JWT_SECRET,
        )
        await mailTransporter.sendMail({
            from: ENVIROMENT.GMAIL_USER,
            to: email,
            subject: 'Verifica tu cuenta de mail',
            html: `
                <h1>Verifica tu cuenta de mail</h1>
                <a href="http://localhost:${ENVIROMENT.PORT}/api/auth/verify-email/${verification_token}">Verificar</a>
            `
        })
        return
    }
    static async verifyEmail(verification_token) {
        try {
            const payload = jwt.verify(verification_token, ENVIROMENT.JWT_SECRET)
            const { user_id } = payload
            if (!user_id) {
                throw new ServerError(400, 'Accion denegada, token con datos insuficientes')
            }
            const user_found = await UserRepository.getById(user_id)
            if (!user_found) {
                throw new ServerError(404, 'Usuario no encontrado')
            }
            if (user_found.verified_email) {
                throw new ServerError(400, 'Usuario ya validado')
            }
            await UserRepository.updateById(user_id, { verified_email: true })
            return
        }
        catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new ServerError(400, 'Token invalido')
            }
            throw error
        }
    }
    static async login(email, password) {
        //Buscar al usuario por mail
        const user_found = await UserRepository.getByEmail(email)
        //Validar que el usuario exista
        if (!user_found) {
            throw new ServerError(404, 'Usuario con este mail no encontrado')
        }
        //Validar usuario por mail
        if (!user_found.verified_email) {
            throw new ServerError(401, 'Usuario con mail no verificado')
        }
        //Validar contraseña
        const is_same_password = await bcrypt.compare(password, user_found.password)
        if (!is_same_password) {
            throw new ServerError(401, 'Contraseña invalida')
        }
        //Generar token con los datos de sesion (DATOS NO SENSIBLES)
        const auth_token = jwt.sign(
            {
                name: user_found.name,
                email: user_found.email,
                id: user_found._id
            },
            ENVIROMENT.JWT_SECRET,
            {
                expiresIn: '24h'
            }
        )
        return {
            auth_token: auth_token
        }
    }
}

export default AuthService