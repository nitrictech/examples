from nitric.resources import job, bucket, api

main_api = api("main")

transcribe_job = job("transcribe")

podcast_bucket = bucket("podcasts")
transcript_bucket = bucket("transcripts")