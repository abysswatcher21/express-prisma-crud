const express = require('express');
const router = express.Router();

const {
    user,
    register,
    validate,
    login
} = require('../controllers/user')


router.
    route('/')
    .get(user)

router
    .route('/login')
    .post(login)

router.
    route('/register')
    .post(validate('register'), register)

module.exports = router;    
