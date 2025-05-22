// Database Configuration - GANTI DENGAN DATA RDS ANDA!
const dbConfig = {
  host: 'your-rds-endpoint.rds.amazonaws.com', // Endpoint RDS Anda
  user: 'admin',                              // Username database
  password: 'password-anda',                  // Password database
  database: 'student_db',                     // Nama database
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Koneksi ke database
const mysql = require('mysql2/promise');
const pool = mysql.createPool(dbConfig);

// Fungsi utama
async function main() {
  try {
    // 1. Buat tabel jika belum ada
    await createTable();
    
    // 2. Insert data awal (didi dan dimas)
    await insertInitialData();
    
    // 3. Tampilkan semua data
    await displayAllStudents();
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

// Fungsi untuk membuat tabel
async function createTable() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INT NOT NULL
      )
    `);
    console.log('Tabel students berhasil dibuat/sudah ada');
  } finally {
    connection.release();
  }
}

// Fungsi untuk insert data awal
async function insertInitialData() {
  const connection = await pool.getConnection();
  try {
    // Cek apakah data sudah ada
    const [rows] = await connection.query('SELECT * FROM students WHERE name IN (?, ?)', ['didi', 'dimas']);
    
    if (rows.length === 0) {
      await connection.query(
        'INSERT INTO students (name, age) VALUES (?, ?), (?, ?)',
        ['didi', 17, 'dimas', 17]
      );
      console.log('Data awal berhasil ditambahkan');
    } else {
      console.log('Data awal sudah ada');
    }
  } finally {
    connection.release();
  }
}

// Fungsi untuk menampilkan semua data
async function displayAllStudents() {
  const connection = await pool.getConnection();
  try {
    const [students] = await connection.query('SELECT * FROM students');
    
    console.log('\nDaftar Siswa:');
    console.table(students);
    
    // Jika ingin menampilkan di HTML (bukan console)
    updateHTMLTable(students);
  } finally {
    connection.release();
  }
}

// Fungsi untuk update tabel HTML
function updateHTMLTable(students) {
  const tbody = document.querySelector('#studentTable tbody');
  tbody.innerHTML = '';
  
  students.forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.age}</td>
    `;
    tbody.appendChild(row);
  });
}

// Jalankan program utama
document.addEventListener('DOMContentLoaded', () => {
  // Untuk form tambah data
  document.getElementById('studentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    
    if (name && age) {
      await addNewStudent(name, age);
      document.getElementById('name').value = '';
      document.getElementById('age').value = '';
      await displayAllStudents();
    }
  });
  
  // Jalankan main function
  main();
});

// Fungsi tambah siswa baru
async function addNewStudent(name, age) {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      'INSERT INTO students (name, age) VALUES (?, ?)',
      [name, age]
    );
    console.log(`Siswa ${name} berhasil ditambahkan`);
  } finally {
    connection.release();
  }
}