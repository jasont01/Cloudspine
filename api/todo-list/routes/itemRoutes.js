const express = require('express')
const protect = require('../middleware/authMiddleware')
const {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/itemController.js')

const router = express.Router()

router.route('/').get(protect, getItems).post(protect, createItem)
router.route('/:id').put(protect, updateItem).delete(protect, deleteItem)

module.exports = router
