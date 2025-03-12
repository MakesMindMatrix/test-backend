const express = require('express')
const { testRoute } = require('../controller/user.controller')
const router = express.Router()

console.log("called")
router.route('/test').get(testRoute)

module.exports = router