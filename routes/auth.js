const express = require('express')
const router = express.Router()

const {
    register,
    login,
    activate,
} = require('../controlers/auth')

router.route('/register').post(register)
router.route('/confirmation/:clientToken').patch(activate)
router.route('/login').post(login)

module.exports = router