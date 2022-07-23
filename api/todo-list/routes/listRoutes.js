const express = require('express')
const {
  getLists,
  createList,
  updateList,
  deleteList,
} = require('../controllers/listController.js')
const protect = require('../middleware/authMiddleware.js')

const router = express.Router()

router.route('/').get(protect, getLists).post(protect, createList)
router.route('/:id').put(protect, updateList).delete(protect, deleteList)

module.exports = router
