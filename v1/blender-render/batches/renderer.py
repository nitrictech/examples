from nitric.resources import job, bucket
from nitric.context import JobContext
from nitric.application import Nitric
import os.path

import bpy

renderer = job("render-image")

blend_bucket = bucket("blend_files").allow("read")
image_bucket = bucket("image_bucket").allow("write")


@renderer(cpus=1, memory=1024, gpus=0)
async def render_image(ctx: JobContext):
  print(f"Starting render for image {ctx.req.data['key']}")

  # Register the blender binary
  blender_bin = "/usr/local/blender/blender"

  if os.path.isfile(blender_bin):
    print("Found:", blender_bin)
    
    bpy.app.binary_path = blender_bin
  else:
    print("Unable to find blender at: ", blender_bin)

    ctx.res.success = False
    return ctx

  input_path = "input.blend"
  output_path = "output.png"

  # load the file from a bucket to a local file
  print("Loading scene from bucket")
  blend_file = await blend_bucket.file(ctx.req.data["key"]).read()

  with open(input_path, "wb") as f:
    f.write(blend_file)

  bpy.ops.wm.open_mainfile(filepath=input_path)

  # Set render options
  bpy.context.scene.render.image_settings.file_format = 'PNG'
  bpy.context.scene.render.engine = 'CYCLES'
  bpy.context.scene.render.filepath = output_path

  print("Rendering scene")
  bpy.ops.render.render(write_still=True)

  # Write the outputted file to the rendered image bucket
  print("Writing rendered image to bucket")
  with open(output_path, "rb") as f:
    image_bytes = f.read()

    # swap the `.blend` extension for a `.png`
    key = ctx.req.data["key"].split(".")[0]

    await image_bucket.file(key + ".png").write(image_bytes)
  
  return ctx


Nitric.run()