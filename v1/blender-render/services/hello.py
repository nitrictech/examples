from nitric.resources import api, bucket, job
from nitric.application import Nitric
from nitric.context import HttpContext

main = api("main")

renderer = job("render-image").allow("submit")

blend_bucket = bucket("blend_files").allow("write", "read")

@main.get("/:image")
async def get_image(ctx: HttpContext):
    image = ctx.req.params['image']

    download_url = await blend_bucket.file(image).download_url(3600)

    ctx.res.headers["Location"] = download_url
    ctx.res.status = 303

    return ctx
    
@main.post("/:image")
async def write_image(ctx: HttpContext):
    image = ctx.req.params['image']

    await blend_bucket.file(image).write(ctx.req.data)

    return ctx


@blend_bucket.on("write", "*.blend")
async def submit_image_renderer(ctx):
    print(f"Received ${ctx.req.key}... submitting request to renderer")

    await renderer.submit(
        {
            "key": ctx.req.key 
        }
    )

    return ctx


Nitric.run()
