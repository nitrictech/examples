import json

from nitric.application import Nitric
from nitric.context import HttpContext
from nitric.resources import BucketNotificationContext

from common.resources import rendered_bucket, main_api, blend_bucket, renderer_job

readable_rendered_bucket = rendered_bucket.allow("read")
readable_writeable_blend_bucket = blend_bucket.allow("write", "read")
submittable_renderer_job = renderer_job.allow("submit")

@main_api.get("/render/:file")
async def get_render(ctx: HttpContext):
    file_name = ctx.req.params['file']

    download_url = await readable_writeable_blend_bucket.file(file_name).download_url(3600)

    ctx.res.headers["Location"] = download_url
    ctx.res.status = 303

    return ctx
    
@main_api.put("/:blend")
async def write_render(ctx: HttpContext):
    blend_scene_key = ctx.req.params["blend"]
    
    # Write the blend scene rendering settings
    raw_metadata = {
        "file_format": str(ctx.req.query.get('file_format', ['PNG'])[0]),
        "fps": int(ctx.req.query.get('fps', [0])[0]),
        "device": str(ctx.req.query.get('device', ['GPU'])[0]),
        "engine": str(ctx.req.query.get('engine', ['CYCLES'])[0]),
        "animate": bool(ctx.req.query.get('animate', [False])[0]),
    }
    metadata = bytes(json.dumps(raw_metadata), encoding="utf-8")

    await readable_writeable_blend_bucket.file(f"metadata-{blend_scene_key}.json").write(metadata)

    # Write the blend scene to the bucket using an upload URL
    blend_upload_url = await readable_writeable_blend_bucket.file(f"blend-{blend_scene_key}.blend").upload_url()

    ctx.res.headers["Location"] = blend_upload_url
    ctx.res.status = 307

    return ctx


@blend_bucket.on("write", "blend-")
async def on_written_image(ctx: BucketNotificationContext):
    key_without_extension = ctx.req.key.split(".")[0][6:]

    await submittable_renderer_job.submit(
        {
            "key": key_without_extension,
        }
    )

    return ctx

Nitric.run()

