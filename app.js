const express = require('express')
const app = express()

const user = require('./route/user.route')

app.use("/api/v1", user)

module.exports = app;
