import os.path
import json
import glob

from nitric.context import JobContext
from nitric.application import Nitric
from common.resources import rendered_bucket, renderer_job, blend_bucket

readable_blend_bucket = blend_bucket.allow("read")
writeable_rendered_bucket = rendered_bucket.allow("write")


@renderer_job(cpus=1, memory=1024, gpus=0)
async def render_image(ctx: JobContext):
  import bpy

  blend_key = ctx.req.data["key"]

  print(blend_key)

  # Register the blender binary
  blender_bin = "blender"

  if os.path.isfile(blender_bin):    
    bpy.app.binary_path = blender_bin
  else:
    print("unable to find blender path")
    ctx.res.success = False
    return ctx

  # load the file from a bucket to a local file
  blend_file = await readable_blend_bucket.file(f"blend-{blend_key}.blend").read()

  with open("input.blend", "wb") as f:
    f.write(blend_file)

  bpy.ops.wm.open_mainfile(filepath="input.blend")

  try:
    raw_metadata = await readable_blend_bucket.file(f"metadata-{blend_key}.json").read()
  except:
    raw_metadata = {}

  metadata = json.loads(raw_metadata)

  bpy.context.scene.render.filepath = blend_key
  bpy.context.scene.render.engine = metadata.get('engine', 'CYCLES')
  bpy.context.scene.cycles.device = metadata.get('device', 'GPU')
  bpy.context.scene.render.image_settings.file_format = metadata.get('file_format', 'PNG')
  bpy.context.scene.render.fps = metadata.get('fps', '0')

  if metadata.get('animate', False):
    bpy.ops.render.render(animation=True)
  else:
    bpy.ops.render.render(write_still=True)

  file_name = glob.glob(f"{blend_key}*")[0]
  with open(file_name, "rb") as f:
    image_bytes = f.read()    

    await writeable_rendered_bucket.file(file_name).write(image_bytes)
    
  return ctx


Nitric.run()