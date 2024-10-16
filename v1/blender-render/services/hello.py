from nitric.resources import api, bucket, job
from nitric.application import Nitric
from nitric.context import HttpContext

main = api("main")

renderer = job("render-image").allow("submit")

blend_bucket = bucket("blend_files").allow("write")
image_bucket = bucket("image_bucket").allow("read")

@main.get("/:image")
async def get_image(ctx: HttpContext):
    image = ctx.req.params['image']

    download_url = await image_bucket.file(f"{image}.png").download_url(3600)

    ctx.res.headers["Location"] = download_url
    ctx.res.status = 303

    return ctx
    
@main.post("/:blend")
async def write_image(ctx: HttpContext):
    image = f"{ctx.req.params['blend']}.blend"

    await blend_bucket.file(image).write(ctx.req.data)

    await renderer.submit(
        {
            "key": image,
        }
    )

    return ctx


Nitric.run()
