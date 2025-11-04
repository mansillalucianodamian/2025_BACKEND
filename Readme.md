POST /api/auth/login Te permite loguearte en la aplicacion. body: { email, password }

response: { status: 200, ok: true, data: { auth_token } }