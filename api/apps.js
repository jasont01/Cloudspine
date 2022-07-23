const express = require('express')

const router = express.Router()

router.use('/notes', require('./notes/routes/index'))
router.use('/todo-list', require('./todo-list/routes/index'))

module.exports = router
