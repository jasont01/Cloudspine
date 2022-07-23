const express = require('express')
const {
  registerUser,
  loginUser,
  getUser,
  deleteUser,
} = require('../controllers/userController.js')
const protect = require('../middleware/authMiddleware.js')

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/', protect, getUser)
router.delete('/:id', protect, deleteUser)

module.exports = router
