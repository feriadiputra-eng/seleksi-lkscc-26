from flask import Flask, jsonify
import boto3
import os
from dotenv import load_dotenv

load_dotenv()

dynamodb = boto3.resource(
    'dynamodb',
    region_name='us-west-2',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    aws_session_token=os.getenv('AWS_SESSION_TOKEN')
)

table = dynamodb.Table('ListTeman')

app = Flask(__name__)

@app.route('/')
def api_data():
    response = table.scan()
    return jsonify(response['Items'])

@app.route('/app2')
def web_interface():
    return '''
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <title>Daftar Teman</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, sans-serif;
                background-color: #f9f9f9;
                color: #2c3e50;
                padding: 40px;
            }
            h1 {
                color: #3498db;
                margin-bottom: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                background-color: #fff;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                margin-top: 20px;
            }
            th, td {
                padding: 12px 16px;
                border: 1px solid #ddd;
                text-align: left;
            }
            th {
                background-color: #3498db;
                color: white;
            }
            tr:nth-child(even) {
                background-color: #f2f2f2;
            }
            #loading {
                font-style: italic;
                color: gray;
            }
        </style>
    </head>
    <body>
        <h1>Daftar Teman (Responsif)</h1>
        <p id="loading">Memuat data...</p>
        <table id="dataTable" style="display:none;">
            <thead></thead>
            <tbody></tbody>
        </table>

        <script>
            fetch('/')
                .then(res => res.json())
                .then(data => {
                    const table = document.getElementById('dataTable');
                    const thead = table.querySelector('thead');
                    const tbody = table.querySelector('tbody');

                    if (data.length === 0) {
                        document.getElementById('loading').innerText = 'Tidak ada data.';
                        return;
                    }

                    // Ambil semua key unik dari data
                    const allKeys = new Set();
                    data.forEach(item => {
                        Object.keys(item).forEach(key => allKeys.add(key));
                    });
                    const headers = Array.from(allKeys);

                    // Buat header tabel
                    const headerRow = document.createElement('tr');
                    headers.forEach(key => {
                        const th = document.createElement('th');
                        th.textContent = key;
                        headerRow.appendChild(th);
                    });
                    thead.appendChild(headerRow);

                    // Buat isi tabel
                    data.forEach(item => {
                        const row = document.createElement('tr');
                        headers.forEach(key => {
                            const td = document.createElement('td');
                            td.textContent = item[key] || '-';
                            row.appendChild(td);
                        });
                        tbody.appendChild(row);
                    });

                    document.getElementById('loading').style.display = 'none';
                    table.style.display = '';
                })
                .catch(err => {
                    document.getElementById('loading').innerText = 'Gagal memuat data.';
                    console.error(err);
                });
        </script>
    </body>
    </html>
    '''


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4001)
