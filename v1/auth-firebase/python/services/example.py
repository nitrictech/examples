import json
import firebase_admin
import os
from firebase_admin import auth, credentials
from nitric.resources import api, ApiOptions
from nitric.application import Nitric
from nitric.context import HttpContext, HttpMiddleware

creds_json_str = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS_JSON")
creds_dict = json.loads(creds_json_str)

cred = credentials.Certificate(creds_dict)

default_app = firebase_admin.initialize_app(cred)

# CORS middleware if we want to use API from browser
async def cors(ctx: HttpContext, next: HttpMiddleware):
    ctx.res.headers["Access-Control-Allow-Origin"] = "*"
    ctx.res.headers["Access-Control-Allow-Headers"] = "Origin, Content-Type, Accept, Authorization"
    ctx.res.headers["Access-Control-Allow-Methods"] = "GET,POST,DELETE,OPTIONS"

    return await next(ctx)


async def authenticate(ctx: HttpContext, next: HttpMiddleware):
    id_token =  ctx.req.headers.get('Authorization')

    # Ignore OPTIONS requests
    if ctx.req.method == "OPTIONS":
        return ctx


    if not id_token:
        ctx.res.status = 401
        ctx.res.body = {'error': 'Unauthorized'}
        return ctx

    try:
        decoded_token = auth.verify_id_token(id_token[0].split("Bearer ")[1])
        ctx.req.user = decoded_token
        return await next(ctx)
    except Exception as error:
        print("Error verifying Firebase ID token:", error)
        ctx.res.status = 403
        ctx.res.body = {'error': 'Unauthorized'}
        return ctx

private_api = api("private", ApiOptions(middleware=[cors,authenticate]))

# options for CORS
@private_api.options("/")
def stub(ctx: HttpContext):
    ctx

@private_api.get("/")
async def protected_route(ctx: HttpContext):
    ctx.res.body = { 'message': 'This route is protected.', 'user': ctx.req.user }

Nitric.run()
