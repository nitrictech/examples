import whisper
from common.resources import transcribe_job, transcript_bucket, podcast_bucket
from nitric.context import JobContext
from nitric.application import Nitric

writeable_transcript_bucket = transcript_bucket.allow("write")
readable_podcast_bucket = podcast_bucket.allow("read")

@transcribe_job(cpus=1, memory=12000, gpus=0)
async def transcribe_podcast(ctx: JobContext):
  podcast_name = ctx.req.data["podcast_name"]
  print(f"Transcribing: {podcast_name}")

  podcast = await readable_podcast_bucket.file(podcast_name).read()

  with open("local-podcast", "wb") as f:
    f.write(podcast)

  model = whisper.load_model("turbo")
  result = model.transcribe("local-podcast", verbose=True, fp16=False)

  transcript = result["text"].encode()
  
  print("Finished transcoding... Writing to Bucket")
  await writeable_transcript_bucket.file(f"{podcast_name}-transcript.txt").write(transcript)

  return ctx

Nitric.run()