// Database Configuration - REPLACE WITH YOUR RDS DATA!
const dbConfig = {
  host: '', // Your RDS endpoint
  user: '',                              // Database username
  password: '',                  // Database password
  database: '',                     // Database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Connect to the database
const mysql = require('mysql2/promise');
const pool = mysql.createPool(dbConfig);

// Main function
async function main() {
  try {
    // 1. Create the table if it doesn't exist
    await createTable();
    
    // 2. Insert initial data (didi and dimas)
    await insertInitialData();
    
    // 3. Display all student data
    await displayAllStudents();
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

// Function to create the table
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
    console.log('Table "students" successfully created or already exists');
  } finally {
    connection.release();
  }
}

// Function to insert initial data
async function insertInitialData() {
  const connection = await pool.getConnection();
  try {
    // Check if the data already exists
    const [rows] = await connection.query('SELECT * FROM students WHERE name IN (?, ?)', ['didi', 'dimas']);
    
    if (rows.length === 0) {
      await connection.query(
        'INSERT INTO students (name, age) VALUES (?, ?), (?, ?)',
        ['didi', 17, 'dimas', 17]
      );
      console.log('Initial data successfully added');
    } else {
      console.log('Initial data already exists');
    }
  } finally {
    connection.release();
  }
}

// Function to display all student data
async function displayAllStudents() {
  const connection = await pool.getConnection();
  try {
    const [students] = await connection.query('SELECT * FROM students');
    
    console.log('\nStudent List:');
    console.table(students);
    
    // If you want to display in HTML (not in console)
    updateHTMLTable(students);
  } finally {
    connection.release();
  }
}

// Function to update the HTML table
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

// Run the main program
document.addEventListener('DOMContentLoaded', () => {
  // For adding new student through form
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
  
  // Run the main function
  main();
});

// Function to add a new student
async function addNewStudent(name, age) {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      'INSERT INTO students (name, age) VALUES (?, ?)',
      [name, age]
    );
    console.log(`Student ${name} successfully added`);
  } finally {
    connection.release();
  }
}