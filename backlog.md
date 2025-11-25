/api/auth
  - POST /register
  - POST /login
  - GET  /verify-email/:verification_token

/api/workspace (Authenticated)
  - GET  /           -> Obtener todos los workspaces del usuario
  - POST /           -> Crear workspace
        body: { name, url_image }
  - PUT  /:workspace_id -> Actualizar workspace
        body: { name, url_image }
  - DELETE /:workspace_id -> Eliminar workspace
  - GET  /:workspace_id -> Obtener workspace por id
  - POST /:workspace_id/invite -> Invitar usuario por email
        body: { email }

  Channels:
    - GET  /:workspace_id/channels -> Obtener canales
    - POST /:workspace_id/channels -> Crear canal
          body: { name, description }

  Messages:
    - GET  /:workspace_id/channels/:channel_id/messages -> Obtener mensajes
    - POST /:workspace_id/channels/:channel_id/messages -> Crear mensaje
          body: { content }

  Test:
    - GET /:workspace_id/test -> Endpoint de prueba

/api/member
  - GET /confirm-invitation/:invitation_token -> Confirmar invitación y crear miembro
