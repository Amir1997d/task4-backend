const date = require('date-and-time');
const now  =  new Date();
const mysql = require('mysql2/promise');

//MySQL database configuration
const pool = mysql.createPool({
    host: 'localhost',
    user: 'never_amir',
    password: 'amiremir@1376',
    database: 'never_amir',
    connectionLimit: 10
});
  
// Helper function to update user status in the database
async function updateStatus(userIds, status) {
    // await pool.query('UPDATE users SET user_status = ? WHERE user_id = ANY(?::int[])', [status, userIds]);
    const userIdsStr = userIds.join(',');
    await pool.query(`UPDATE users SET user_status = ? WHERE user_id IN (${userIdsStr})`, [status]);
}

// Helper function to get user by ID from the database
async function getUserById(userId) {
    const result = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    return result.rows[0];
}

// Helper function to delete a user from the database
async function deleteUsersById(userIds) {
    // await pool.query('DELETE FROM users WHERE user_id = ANY(?::int[])', [userIds]);
    const userIdsStr = userIds.join(',');
    await pool.query(`DELETE FROM users WHERE user_id IN (${userIdsStr})`);
}

// Helper function to get user by username from the database
async function getUserByUsername(username) {
    const result = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return result.rows[0];
}

// Helper function to get user by username or email from the database
async function getUserByUsernameOrEmail(username, email) {
    const result = await pool.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
    return result.rows[0];
}

// Helper function to create a new user in the database
async function createUser(username, email, password) {
    let registerTime = date.format(now,'DD/MM/YYYY HH:mm');
    let lastLoginTime = registerTime;
    let userStatus = 'active';
    await pool.query('INSERT INTO users (username, email, user_password, last_login_time, register_time, user_status) VALUES (?, ?, ?, ?, ?, ?)', [username, email, password, lastLoginTime, registerTime, userStatus]);
}

// Helper function to update last login time in the database
async function updateLastLogin(userId) {
    let lastLoginTime = date.format(now,'DD/MM/YYYY HH:mm');
    await pool.query('UPDATE users SET last_login_time = ? WHERE user_id = ?', [lastLoginTime, userId]);
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
};