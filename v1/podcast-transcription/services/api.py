from common.resources import main_api, transcript_bucket, podcast_bucket, transcribe_job
from nitric.application import Nitric
from nitric.resources import BucketNotificationContext
from nitric.context import HttpContext

readable_transcript_bucket = transcript_bucket.allow("read")
submittable_transcribe_job = transcribe_job.allow("submit")
writable_podcast_bucket = podcast_bucket.allow("write")

@main_api.get("/podcast/:name")
async def get_podcast(ctx: HttpContext):
    name = ctx.req.params['name']

    download_url = await readable_transcript_bucket.file(f"{name}-transcript.txt").download_url()

    ctx.res.headers["Location"] = download_url
    ctx.res.status = 303

    return ctx

@main_api.put("/audio/:name")
async def put_audio(ctx: HttpContext):
    name = ctx.req.params['name']

    upload_url = await writable_podcast_bucket.file(name).upload_url()

    ctx.res.headers["Location"] = upload_url
    ctx.res.status = 307

    return ctx

@podcast_bucket.on("write", "*")
async def on_add_podcast(ctx: BucketNotificationContext):
    await submittable_transcribe_job.submit({ "podcast_name": ctx.req.key })

    return ctx


Nitric.run()
