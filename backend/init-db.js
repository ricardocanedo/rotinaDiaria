const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function initDB() {
  // Create a connection without specifying the database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'Furuk4w4*',
    multipleStatements: true
  });

  try {
    console.log('Dropping existing database if it exists...');
    await connection.query('DROP DATABASE IF EXISTS rotina_diaria');
    
    console.log('Creating new database...');
    await connection.query('CREATE DATABASE rotina_diaria');
    
    console.log('Using rotina_diaria database...');
    await connection.query('USE rotina_diaria');
    
    console.log('Reading schema file...');
    const schema = await fs.readFile(path.join(__dirname, 'schema.sql'), 'utf8');
    
    console.log('Executing schema...');
    await connection.query(schema);
    
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await connection.end();
    process.exit();
  }
}

initDB();
