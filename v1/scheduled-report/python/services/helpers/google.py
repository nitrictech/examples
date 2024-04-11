import datetime
import google.auth
from googleapiclient.discovery import build
import os


SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']

def service_login():
    creds = None
    credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

    if credentials_path:
        creds, _ = google.auth.load_credentials_from_file(credentials_path, SCOPES)
    else:
        raise Exception("Missing/Invalid credentials.")
    
    return build('sheets', 'v4', credentials=creds), build('drive', 'v3', credentials=creds)

def create_spreadsheet(title, sheets_service):
    spreadsheet = {
        'properties': {
            'title': title
        }
    }
    spreadsheet = sheets_service.spreadsheets().create(body=spreadsheet, fields='spreadsheetId').execute()    # Generate dummy data
    dummy_data = generate_dummy_data(rows=20)  # Generate 20 rows of dummy data

    # Insert the dummy data into the spreadsheet
    insert_data_into_spreadsheet(spreadsheet, dummy_data, sheets_service)

    return spreadsheet.get('spreadsheetId')

def share_spreadsheet(spreadsheet_id, email_address, drive_service):
    drive_service.permissions().create(
        fileId=spreadsheet_id,
        body={
            'type': 'user',
            'role': 'writer',
            'emailAddress': email_address
        },
        fields='id'
    ).execute()

    import datetime
import random

def create_spreadsheet(title, sheets_service):
    spreadsheet = {
        'properties': {
            'title': title
        }
    }
    spreadsheet = sheets_service.spreadsheets().create(body=spreadsheet, fields='spreadsheetId').execute()
    return spreadsheet.get('spreadsheetId')

def generate_dummy_data(rows=10):
    """Generate dummy data for spreadsheet."""
    # Define headers
    data = [['Name', 'Date', 'Value']]
    # Dummy names
    names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Evan']
    
    # Generate dummy rows
    for _ in range(rows):
        name = random.choice(names)
        date = (datetime.date.today() - datetime.timedelta(days=random.randint(0, 365))).isoformat()
        value = random.randint(100, 1000)
        data.append([name, date, value])
    
    return data

def insert_data_into_spreadsheet(spreadsheet_id, data, sheets_service):
    """Insert data into the specified spreadsheet."""
    range_name = 'A1'  # Starting cell where data will be written
    body = {
        'values': data
    }
    result = sheets_service.spreadsheets().values().update(
        spreadsheetId=spreadsheet_id, range=range_name,
        valueInputOption='RAW', body=body).execute()
    print(f"{result.get('updatedCells')} cells updated.")


