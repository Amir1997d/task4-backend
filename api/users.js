const express = require('express');
const router = express.Router();

const {
  getUsers,
  deleteUser,
  updateUserStatus,
  getUserStatus,
  deleteUsers,
  getUser
} = require('../controllers/usersController');

const { createTable } = require('../controllers/helpers');

root.get('/create-user-table', async (req, res) => {
  try {
    await createTable();
    res.status(200).send("table is created!");
  } catch(err) {
    res.send(err);
  }
}
  
router.get('/', getUsers);
router.delete('/:userId', deleteUser);
router.get('/:username', getUser);
router.put('/updatestatus/:userId', updateUserStatus);
router.get('/getstatus/:userId', getUserStatus);
router.put('/block-users', updateUserStatus);
router.put('/unblock-users', updateUserStatus);
router.put('/delete-users', deleteUsers);

module.exports = router;
