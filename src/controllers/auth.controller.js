import ENVIROMENT from "../config/enviroment.config.js";
import { ServerError } from "../error.js";
import AuthService from "../services/auth.service.js";

class AuthController {
    static async register(request, response) {
        try {
            //console.log("Datos recibidos", request.body)
            const { email, password, name } = request.body

            await AuthService.register(email, password, name)
            response.status(200).json({
                ok: true,
                message: 'Usuario registrado con exito',
                status: 201
            })

        }
        catch (error) {
            if (error.status) {
                
                response.status(error.status).send({
                    ok: false,
                    message: error.message,
                    status: error.status
                })
            }
            else {
                console.error(
                    'ERROR AL REGISTRAR', error
                )
                response.status(500).send({
                    ok: false,
                    message: 'Error interno del servidor',
                    status: 500
                })
            }
        }
    }
    static async verifyEmail(request, response) {
        try {
            const { verification_token } = request.params

            await AuthService.verifyEmail(verification_token)
            response.redirect(
                ENVIROMENT.URL_FRONTEND + '/login?from=verified_email'
            )

        }
        catch (error) {
            //TODO: Si hay algun fallo reeviar mail de validacion 

            if(error.status){
                response.send(
                    `<h1>${error.message}</h1>`
                )
            }
            else {
                console.error(
                    'ERROR AL VERIFICAR CORREO', error
                )
                response.status(500).json(
                    '<h1>Error en el servidor, intentelo mas tarde</h1>'
                )
            }
        }
    }
    static async login (request, response) {
        try {
            const { email, password } = request.body

            const { auth_token } = await AuthService.login(email, password)
            return response.json({
                ok: true,
                message: 'Usuario logueado con exito',
                status: 200,
                body: {
                    auth_token
                }
            })
        }
        catch (error) {
            if (error.status) {
                response.send({
                    ok: false,
                    message: error.message,
                    status: error.status
                })
            }
            else {
                console.error(
                    'ERROR AL REGISTRAR', error
                )
                response.send({
                    ok: false,
                    message: 'Error interno del servidor',
                    status: 500
                })
            }
        }
    }
}


export default AuthController
