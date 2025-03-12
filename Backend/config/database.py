import pyodbc
from os import getenv

server = '10.10.100.26'
database = 'InvoiceBookStaging'
username = 'Invoicer'
password = 'Inv@321++'
driver = 'ODBC Driver 17 for SQL Server'

def get_db_connection():
    connection_string = f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}'
    return pyodbc.connect(connection_string)
