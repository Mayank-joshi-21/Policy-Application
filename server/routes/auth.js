const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = []; // In-memory "DB"

const SECRET_KEY = 'secret123'; // In real apps, use process.env.SECRET_KEY

// Register Route
router.post('/register', async (req, res) => {
  const { name, dob, mobile, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ name, dob, mobile, password: hashedPassword });

  res.status(201).json({ message: 'User registered successfully' });
});

// Login Route
router.post('/login', async (req, res) => {
  const { mobile, password } = req.body;

  const user = users.find(u => u.mobile === mobile);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Incorrect password' });

  const token = jwt.sign({ mobile }, SECRET_KEY, { expiresIn: '1h' });

  // Mask sensitive data
  const maskedMobile = mobile.replace(/^(\d{2})\d{6}(\d{2})$/, '$1xxxxxx$2');
  const maskedDob = user.dob.split('-').map((v, i) => (i === 0 ? 'XXXX' : v)).join('-');

  res.json({
    token,
    user: {
      name: user.name,
      dob: maskedDob,
      mobile: maskedMobile
    }
  });
});

module.exports = router;
