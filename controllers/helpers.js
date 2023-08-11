const date = require('date-and-time');
const now  =  new Date();
const { Pool } = require('pg');

//PostgreSQL database configuration
const pool = new Pool({
    host: 'dpg-cjb0l43bq8nc738pogcg-a',
    username: 'user',
    password: 'eFV3OhLhs6FNOOEWDWvlhrJ8YEhr7nvL',
    database: 'task4db_2a4w',
    port: 5432
});

pool.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
  })
  .catch(err => {
    console.error('Error connecting to PostgreSQL database:', err.message);
  });

//Helper function to create the user table in the database
async function createTable() {
    await pool.query('CREATE TABLE users ( user_id SERIAL PRIMARY KEY, username VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, user_password VARCHAR(255) NOT NULL, last_login_time VARCHAR(255) NOT NULL, register_time VARCHAR(255) NOT NULL, user_status VARCHAR(10) DEFAULT "active"');
}

// Helper function to update user status in the database
async function updateStatus(userIds, status) {
    await pool.query('UPDATE users SET user_status = $1 WHERE user_id = ANY($2::int[])', [status, userIds]);
}

// Helper function to get user by ID from the database
async function getUserById(userId) {
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
    return result.rows[0];
}

// Helper function to delete a user from the database
async function deleteUsersById(userIds) {
    await pool.query('DELETE FROM users WHERE user_id = ANY($1::int[])', [userIds]);
}

// Helper function to get user by username from the database
async function getUserByUsername(username) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
}

// Helper function to get user by username or email from the database
async function getUserByUsernameOrEmail(username, email) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    return result.rows[0];
}

// Helper function to create a new user in the database
async function createUser(username, email, password) {
    let registerTime = date.format(now,'DD/MM/YYYY HH:mm');
    let lastLoginTime = registerTime;
    let userStatus = 'active';
    await pool.query('INSERT INTO users (username, email, user_password, last_login_time, register_time, user_status) VALUES ($1, $2, $3, $4, $5, $6)', [username, email, password, lastLoginTime, registerTime, userStatus]);
}

// Helper function to update last login time in the database
async function updateLastLogin(userId) {
    let lastLoginTime = date.format(now,'DD/MM/YYYY HH:mm');
    await pool.query('UPDATE users SET last_login_time = $1 WHERE user_id = $2', [lastLoginTime, userId]);
}

// Helper function to fetch all users from the database
async function getAllUsers() {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
}

module.exports = {
    updateStatus,
    getUserById,
    deleteUsersById,
    getUserByUsername,
    getUserByUsernameOrEmail,
    createUser,
    updateLastLogin,
    getAllUsers,
    createTable
};
