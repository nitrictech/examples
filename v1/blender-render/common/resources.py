from nitric.resources import api, job, bucket

main_api = api("main")

renderer_job = job("render-image")

blend_bucket = bucket("blend-files")
rendered_bucket = bucket("rendered-bucket")