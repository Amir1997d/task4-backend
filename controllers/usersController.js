const {
    updateStatus,
    getUserById,
    deleteUsersById,
    getAllUsers,
    getUserByUsername,
} = require('./helpers');

// Handle get all users response
const getUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await getAllUsers();
        // Send the list of users as the response
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Handle delete user request
const deleteUser = async (req, res) => {
    const userId = req.params.userId;
    try {
      // Check if the user exists in the database
      const user = await getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      // Delete the user from the database
      await deleteUserById(userId);
      // Send a success response
      res.json({ message: 'User deleted successfully.' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Server error.' });
    }
};

// Endpoint to update user status (blocked or active)
const updateUserStatus = async (req, res) => {
  const { selectedUserIds, status } = req.body;
  try {
    await updateStatus(selectedUserIds, status);
    res.status(200).json({ message: 'Status updated successfully.' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Endpoint to get user status by user ID
const getUserStatus = async (req, res) => {
    const userId = req.params.userId;
    try {
        // Check if the user exists in the database
        const user = await getUserById(userId);
        if (!user) {
        return res.status(404).json({ message: 'User not found.' });
        }
        // Send the user status as the response
        res.json({ status: user.user_status });
    } catch (error) {
        console.error('Error fetching user status:', error);
        res.status(500).json({ message: 'Server error.' });
    }
}

const deleteUsers = async (req, res) => {
  const { selectedUserIds } = req.body;
  try {
    await deleteUsersById(selectedUserIds);
    res.json({ message: 'Users deleted successfully.' });
  } catch (error) {
    console.error('Error deleting users:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const getUser = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await getUserByUsername(username);
    res.json(user);
  } catch (error) {
    console.error('Error deleting users:', error);
    res.status(500).json({ message: 'Server error.' });
  }
} 

module.exports = {
    getUsers,
    deleteUser,
    updateUserStatus,
    getUserStatus,
    deleteUsers,
    getUser
};