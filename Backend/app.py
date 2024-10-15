from flask import Flask, request,jsonify
from flask_cors import CORS
from sqlalchemy import create_engine,column,Integer,String,Float,Boolean,Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import pyodbc


app = Flask(__name__)
CORS(app)

server = '10.10.100.26'
database = 'InvoiceBook'
username = 'sa'
password = 'Cyber+Code'
driver = 'ODBC Driver 17 for SQL Server'


def get_db_connection():
    connection_string = f'DRIVER={driver};SERVER:{server};DATEBASE={database};UID={username};PWD={password}'
    return pyodbc.connect(connection_string)

@app.route('/api/suppliers', methods=['GET'])
def get_suppliers():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT ID, name FROM Suppliers")
        rows = cursor.fetchall()
        suppliers = [{"id":row[0],"name":row[1]} for row in rows]
        return jsonify(suppliers)
    except Exception as e:
        return jsonify({"error":str(e)}), 500
    finally:
        cursor.close()
        conn.close()
        
        
@app.route('/api/users', methods=['GET'])
def get_suppliers():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT ID, name FROM Suppliers WHERE isActive ='1'")
        rows = cursor.fetchall()
        users = [{"id":row[0],"name":row[1]} for row in rows]
        return jsonify(users)
    except Exception as e:
        return jsonify({"error":str(e)}), 500
    finally:
        cursor.close()
        conn.close()
        
@app.route('/api/users', methods=['POST'])
def create_invoice(args):
    data = request.json
    try:
        conn =get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Invoices (id, invoiceNo,date, GRN, Remark, Amount, currency,
                                  payment_terms, handover_date, handover_to, 
                                  created_user, created_at, is_advance_payment, UserMaste_ID, isComplete, payment_type, upload_img, status, approval_date, approver_id, modified_id, modified_by, remarks)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?)
        """, (data['supplier_id'], data['invoiceNo'], data.get('GRN', None),
              data['amount'], data['currency'], data['payment_terms'],
              data['handover_date'], data['handover_to_id'],
              data['created_by'], data['is_advance_payment'],
              data['is_complete'], data.get('remarks', None)))
        conn.commit()
        return jsonify({"message": "Invoice created successfully"}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
        
@app.route('/invoices', methods=['GET'])
def get_invoices():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, supplier_id, invoice_no, grn_number, amount, currency, 
                   payment_terms, handover_date, handover_to_id, 
                   created_by, is_advance_payment, is_complete, remarks 
            FROM Invoices
        """)
        rows = cursor.fetchall()
        invoices = [{
            "id": row[0],
            "supplier_id": row[1],
            "invoice_no": row[2],
            "grn_number": row[3],
            "amount": row[4],
            "currency": row[5],
            "payment_terms": row[6],
            "handover_date": str(row[7]),
            "handover_to_id": row[8],
            "created_by": row[9],
            "is_advance_payment": row[10],
            "is_complete": row[11],
            "remarks": row[12]
        } for row in rows]
        return jsonify(invoices)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)