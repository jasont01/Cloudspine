const express = require('express')

const router = express.Router()

router.use('/items', require('./itemRoutes'))
router.use('/lists', require('./listRoutes'))
router.use('/user', require('./userRoutes'))

module.exports = router
