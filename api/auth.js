const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const {
    getUserByUsername,
    getUserByUsernameOrEmail,
    createUser,
    updateLastLogin
} = require('../controllers/helpers');

// Handle login request
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if the user exists in the database
        const user = await getUserByUsername(username);
        if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.(username)' });
        }
        // Verify the provided password against the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.user_password);
        // const isPasswordValid = password === user.password ? true : false;
        if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials.(password)' });
        }
        // Update last login time in the database
        await updateLastLogin(user.user_id);
        // Send a success response
        res.json({ userId: user.user_id, username: user.username, message: 'Login successful.' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});
  
// Handle registration request
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
      // Check if the username or email already exists in the database
      const existingUser = await getUserByUsernameOrEmail(username, email);
      if (existingUser) {
        return res.status(409).json({ message: 'Username or email already exists.' });
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Insert the new user into the database
      await createUser(username, email, hashedPassword);
      // Send a success response
      res.status(200).json({ message: 'User registered successfully.' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Server error.' });
    }
});
  
module.exports = router;