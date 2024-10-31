import json
import requests

from nitric.application import Nitric
from nitric.context import HttpContext
from nitric.resources import BucketNotificationContext

from src.resources import rendered_bucket, main_api, blend_bucket, renderer_job

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
    
@main_api.post("/:blend")
async def write_render(ctx: HttpContext):
    blend_scene_key = ctx.req.params["blend"]
    
    # Use upload url to get around write limit
    upload_url = await readable_writeable_blend_bucket.file(f"{blend_scene_key}.blend").upload_url()
    
    resp = requests.post(upload_url, data=ctx.req.data)
    if resp.status_code >= 200 and resp.status_code < 300:
        ctx.res.status = resp.status_code
        ctx.res.body = resp.text
        return ctx
    
    raw_metadata = {
        "file_format": str(ctx.req.query.get('file_format', ['PNG'])[0]),
        "fps": int(ctx.req.query.get('fps', [0])[0]),
        "device": str(ctx.req.query.get('device', ['GPU'])[0]),
        "engine": str(ctx.req.query.get('engine', ['CYCLES'])[0]),
        "animate": bool(ctx.req.query.get('animate', [False])[0]),
    }

    metadata = bytes(json.dumps(raw_metadata), encoding="utf-8")

    await readable_writeable_blend_bucket.file(f"{blend_scene_key}.metadata.json").write(metadata)

    return ctx


@blend_bucket.on("write", "*")
async def on_written_image(ctx: BucketNotificationContext):
    key_without_extension = ctx.req.key.split(".")[0]

    # Ensure {scene}.metadata.json exists and {scene}.blend
    blend_exists = await readable_writeable_blend_bucket.exists(f"{key_without_extension}.blend")
    metadata_exists = await readable_writeable_blend_bucket.exists(f"{key_without_extension}.metadata.json")

    if not blend_exists or not metadata_exists:
        ctx.res.success = False
        return ctx
        
    await submittable_renderer_job.submit(
        {
            "key": key_without_extension,
        }
    )

    return ctx

Nitric.run()

