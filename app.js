'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;;

// In-memory database
let data = [
];

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Get all users
app.get('/api/users', (req, res) => {
  res.json(data);
});

// Get an user by userId
app.get('/api/users/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId)) {
    res.status(400).json({ message: 'User is invalid' });
  } else {
    const result = data.find(user => user.id === userId);

    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  }
});

// Add a new user
app.post('/api/users', (req, res) => {
  const newUser = req.body;
  if (!newUser?.username) {
    res.status(400).json({ message: 'Missing username' });
  } else if (!newUser?.age) {
    res.status(400).json({ message: 'Missing age' });
  } else if (!newUser?.hobbies || newUser?.hobbies?.length < 0) {
    res.status(400).json({ message: 'Missing hobbies' });
  } else {
    newUser.id = data.length + 1;
    data.push(newUser);
    res.status(201).json(newUser);
  }
});

// Update an user by userId
app.put('/api/users/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId)) {
    res.status(400).json({ message: 'User is invalid' });
  } else {
    const updatedUser = req.body;
    if (!updatedUser?.username) {
      res.status(400).json({ message: 'Missing username' });
    } else if (!updatedUser?.age) {
      res.status(400).json({ message: 'Missing age' });
    } else if (!updatedUser?.hobbies || updatedUser?.hobbies?.length < 0) {
      res.status(400).json({ message: 'Missing hobbies' });
    } else {
      let userNotFound = false;
      data = data.map(user => {
        if (user.id === userId) {
          userNotFound = true
          updatedUser.id = user.id
          return updatedUser
        } else {
          return user
        }
      });
      if (!userNotFound) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.json(updatedUser);
      }
    }
  }
});

// Delete an user by userId
app.delete('/api/users/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId)) {
    res.status(400).json({ message: 'User is invalid' });
  } else {
    let oldData = [...data]
    data = data.filter(user => user.id !== userId);

    if (oldData.length == data.length) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(204).json({ message: 'User deleted successfully' });
    }
  }
});

// 404 error handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'URL end point not found' });
});

// 500 error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
