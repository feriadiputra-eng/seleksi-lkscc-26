import pymysql
import os
import json

# Environment variables
db_host = os.environ['DB_HOST']
db_user = os.environ['DB_USER']
db_pass = os.environ['DB_PASS']
db_name = os.environ['DB_NAME']

def lambda_handler(event, context):
    try:
        conn = pymysql.connect(
            host=db_host,
            user=db_user,
            password=db_pass,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )

        create_table_if_not_exists(conn)

        # Ambil data dari event
        body = event.get("body")
        if body:
            body = json.loads(body)
        else:
            body = event  # fallback jika dipanggil langsung dari test Lambda console

        nama = body.get("nama")
        kelas = body.get("kelas")
        sekolah = body.get("sekolah")
        gender = body.get("gender")

        if not all([nama, kelas, sekolah, gender]):
            raise ValueError("Missing required fields in input.")

        insert_data(conn, nama, kelas, sekolah, gender)

        response = {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            "body": json.dumps({"message": f"Successfully added data: {nama}"})
        }

    except Exception as e:
        response = {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

    finally:
        if 'conn' in locals() and conn:
            conn.close()

    return response

def create_table_if_not_exists(conn):
    with conn.cursor() as cursor:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nama VARCHAR(100),
                kelas VARCHAR(50),
                sekolah VARCHAR(100),
                gender VARCHAR(20)
            );
        """)
    conn.commit()

def insert_data(conn, nama, kelas, sekolah, gender):
    with conn.cursor() as cursor:
        cursor.execute("""
            INSERT INTO users (nama, kelas, sekolah, gender)
            VALUES (%s, %s, %s, %s)
        """, (nama, kelas, sekolah, gender))
    conn.commit()
