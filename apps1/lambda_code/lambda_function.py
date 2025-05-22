import pymysql
import os

# Environment variables
db_host = os.environ['DB_HOST']
db_user = os.environ['DB_USER']
db_pass = os.environ['DB_PASS']
db_name = os.environ['DB_NAME']

def lambda_handler(event, context):
    conn = pymysql.connect(
        host=db_host,
        user=db_user,
        password=db_pass,
        db=db_name,
        cursorclass=pymysql.cursors.DictCursor
    )

    create_table_if_not_exists(conn)

    # Hardcoded data to insert
    nama = ""
    kelas = ""
    sekolah = ""
    gender = ""

    insert_data(conn, nama, kelas, sekolah, gender)

    return {
        "statusCode": 200,
        "body": f"Successfully added data: {nama}"
    }

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
