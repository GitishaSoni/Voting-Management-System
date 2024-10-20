const express = require('express');
const { createPool } = require('mysql');
const bodyParser = require('body-parser');

// Create a MySQL connection pool
const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: 'root123', // Change to your MySQL root password
  database: 'voting', // Change to your database name
  connectionLimit: 10,
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Function to generate voter ID based on the first 3 characters of the name and the last 3 digits of the mobile number
function generateVoterId(name, mobile) {
  const namePart = name.substring(0, 3).toUpperCase(); // First 3 characters of the name in uppercase
  const mobilePart = mobile.slice(-3); // Last 3 digits of the mobile number
  return `${namePart}${mobilePart}`;
}

// Default route
app.get('/', (req, res) => {
  res.status(200).send('Welcome Voters');
});

// Register a voter with a custom ID
app.post('/register', (req, res) => {
  const { name, age, address, mobile, dob } = req.body;

  if (!name || !age || !address || !mobile || !dob) {
    res.status(400).send('Missing required fields');
    return;
  }

  const voterId = generateVoterId(name, mobile); // Generate the voter ID
  const query = 'INSERT INTO voters (voter_id, name, age, address, mobile, dob) VALUES (?, ?, ?, ?, ?, ?)';
  pool.query(query, [voterId, name, age, address, mobile, dob], (err, result) => {
    if (err) {
      res.status(500).send('Error inserting into database');
      console.error('Database insertion error:', err);
      return;
    }

    res.status(201).send(`Voter registered successfully with ID: ${voterId}`);
  });
});

// View a voter by their custom voter ID
app.get('/view', (req, res) => {
  const { voter_id } = req.query;

  if (!voter_id) {
    res.status(400).send('Missing voter ID');
    return;
  }

  const query = 'SELECT * FROM voters WHERE voter_id = ?';
  pool.query(query, [voter_id], (err, result) => {
    if (err) {
      res.status(500).send('Error retrieving data from database');
      console.error('Database query error:', err);
      return;
    }

    if (result.length === 0) {
      res.status(404).send('Voter not found');
      return;
    }

    res.status(200).json(result[0]); // Return the voter data
  });
});

// Delete a voter by their custom voter ID
app.post('/delete', (req, res) => {
  const { delete_id } = req.body;

  if (!delete_id) {
    res.status(400).send('Missing voter ID');
    return;
  }

  const query = 'DELETE FROM voters WHERE voter_id = ?';
  pool.query(query, [delete_id], (err, result) => {
    if (err) {
      res.status(500).send('Error deleting voter');
      console.error('Database deletion error:', err);
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send('Voter not found');
      return;
    }

    res.status(200).send(`Voter with ID ${delete_id} deleted successfully`);
  });
});

// Start the server
const port = 8080;
app.listen(port, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});
