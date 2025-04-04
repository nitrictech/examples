from nitric.resources import api
from nitric.application import Nitric
from nitric.context import HttpContext

import debugpy

host, port = debugpy.listen(("0.0.0.0", 52510))  # Static port for consistent debugging
print(f"✅ Debugpy is listening on {host}:{port}", flush=True)

api_two = api("two")

@api_two.get("/two/:name")
async def hello_world(ctx: HttpContext):
    name = ctx.req.params['name']

    ctx.res.body = f"Hello {name}"

Nitric.run()
