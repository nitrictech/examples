import os
from nitric.resources import api, schedule
from nitric.application import Nitric
from nitric.context import HttpContext, IntervalContext, HttpMiddleware

from helpers.google import create_spreadsheet, generate_dummy_data, insert_data_into_spreadsheet, service_login, share_spreadsheet

report_schedule = schedule('run-a-report')

@report_schedule.every('1 days')
async def process_transactions(ctx: IntervalContext):
    sheets_service, drive_service = service_login()

    spreadsheet_id = create_spreadsheet("Daily Report", sheets_service)

    dummy_data = generate_dummy_data(rows=20)
    insert_data_into_spreadsheet(spreadsheet_id, dummy_data, sheets_service)

    share_spreadsheet(spreadsheet_id, os.getenv('ADMIN_EMAIL'), drive_service)

main = api("main")


Nitric.run()