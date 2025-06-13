const express = require('express');
const AWS = require('aws-sdk');
require('dotenv').config();

const app = express();
const s3 = new AWS.S3();
const bucket = process.env.S3_BUCKET_NAME;

app.get('/app3', async (req, res) => {
  try {
    const data = await s3.listObjectsV2({ Bucket: bucket }).promise();
    const items = data.Contents.map(i => i.Key);

    res.send(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Daftar File S3</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f0f4f8;
            margin: 0; padding: 20px;
            color: #333;
          }
          h1 {
            color: #2a8bd8;
            text-align: center;
            margin-bottom: 30px;
          }
          ul {
            list-style: none;
            padding: 0;
            max-width: 600px;
            margin: 0 auto;
          }
          li {
            background: white;
            margin-bottom: 10px;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            word-break: break-word;
            transition: background-color 0.3s;
            cursor: pointer;
          }
          li:hover {
            background-color: #e1f0ff;
          }
          #empty {
            text-align: center;
            color: #777;
            font-style: italic;
            margin-top: 50px;
          }
          footer {
            text-align: center;
            margin-top: 50px;
            color: #999;
            font-size: 0.9rem;
          }
        </style>
      </head>
      <body>
        <h1>Daftar File di Bucket S3</h1>
        ${
          items.length === 0
            ? '<p id="empty">Bucket ini belum berisi file apa pun.</p>'
            : `<ul>${items.map(i => `<li title="Klik untuk salin">${i}</li>`).join('')}</ul>`
        }
        <footer>© 2025 My Awesome App</footer>

        <script>
          // Fungsi copy ke clipboard kalau user klik nama file
          document.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', () => {
              navigator.clipboard.writeText(li.textContent).then(() => {
                alert('Nama file disalin: ' + li.textContent);
              }).catch(() => {
                alert('Gagal menyalin!');
              });
            });
          });
        </script>
      </body>
      </html>
    `);
  } catch (err) {
    res.send("Error: " + err);
  }
});


app.listen(5000, () => console.log("Running on port 5000"));
