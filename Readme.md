📘 API Workspaces – README

🚀 Introducción
API REST para la gestión de workspaces estilo Slack. Permite a los usuarios registrarse, iniciar sesión, crear y administrar espacios de trabajo, canales y mensajes. Incluye autenticación JWT, sistema de invitaciones por email y confirmación de miembros.

🗂️ Estructura del proyecto:
src/
 ├─ config/
 │   └─ db.js
 ├─ models/          
 ├─ repositories/    
 ├─ services/        
 ├─ controllers/    
 ├─ routes/          
 ├─ middleware/      
 └─ schemas/           


🔑 Credenciales de prueba (Admin)
Email: profelucianomansilla@gmail.com
Password: Profesor_2025

📌 Endpoints
Método	      Endpoint	          Body	            Descripción
-------------------------------------------------------------------
🔑 Autenticación – /api/auth
POST	/api/auth/register	{ email, password }	Registrar un nuevo usuario
GET	    /api/auth/verify-email/:verification_token	–	Verificar email del usuario
POST	/api/auth/login	{ email, password }	Iniciar sesión y obtener JWT

🏢 Workspaces – /api/workspace (requiere Auth)
GET	    /api/workspace/	–	Obtener todos los espacios de trabajo del usuario autenticado
POST	/api/workspace/	{ name, url_image }	Crear un nuevo espacio de trabajo
DELETE	/api/workspace/:workspace_id	–	Eliminar un espacio de trabajo (solo admin)
GET	    /api/workspace/:workspace_id/channels	–	Obtener todos los canales de un workspace
POST	/api/workspace/:workspace_id/channels	{ name, description }	Crear un canal en un workspace (solo admin)
POST	/api/workspace/:workspace_id/channels/:channel_id/messages	{ content }	Crear un mensaje en un canal
GET	    /api/workspace/:workspace_id/channels/:channel_id/messages	–	Obtener todos los mensajes de un canal
GET	    /api/workspace/:workspace_id/test	–	Endpoint de prueba (devuelve info del workspace y miembro)
POST	/api/workspace/:workspace_id/invite	{ email }	Invitar a un usuario por email (solo admin)	

👥 Member Router – /api/member
GET	    /api/member/confirm-invitation/:invitation_token	–	Confirmar una invitación a un workspace y crear el miembro correspondiente

📂 Postman Collection
Este repositorio incluye la colección de Postman API_1.postman_collection.json con todos los endpoints documentados. Puedes importarla en Postman para:
 * Probar rápidamente las rutas de autenticación, workspaces, canales y miembros.
 * Usar las credenciales de prueba (profelucianomansilla@gmail.com / Profesor_2025) para obtener un token JWT y acceder a las rutas protegidas.
 * Validar los flujos completos: registro → login → creación de workspace → invitaciones → confirmación de miembros.

👉 Para importar la colección en Postman:
* Abrí Postman.
* Seleccioná Import.
* Elegí el archivo API_1.postman_collection.json.

Ya tendrás todos los endpoints listos para ejecutar.

🌐 Repositorios y despliegues
Frontend 
📦 Código fuente: https://github.com/mansillalucianodamian/2025_FRONTEND
🚀 Deploy: https://2025-frontend-1w2nbqtm6-mansillalucianodamians-projects.vercel.app/

Backend 
📦 Código fuente: https://github.com/mansillalucianodamian/2025_BACKEND
🚀 Deploy: https://2025-backend-adod1oock-mansillalucianodamians-projects.vercel.app/