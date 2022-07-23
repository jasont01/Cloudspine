const express = require('express')

const router = express.Router()

router.use('/notes', require('./notes/routes/index'))
//app.use('/api/todo-list', require('./apps/todo-list/routes/index'))

module.exports = router
