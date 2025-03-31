from nitric.resources import api
from nitric.application import Nitric
from nitric.context import HttpContext

import debugpy

host, port = debugpy.listen(("0.0.0.0", 52509))  # Static port for consistent debugging
print(f"✅ Debugpy is listening on {host}:{port}", flush=True)

api_one = api("one")

@api_one.get("/one/:name")
async def hello_world(ctx: HttpContext):
    name = ctx.req.params['name']

    ctx.res.body = f"Hello from {name}"

Nitric.run()
