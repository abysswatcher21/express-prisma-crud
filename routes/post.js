const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/protect')

const {
    my,
} = require('../controllers/post')


router.
    route('/my')
    .get(protect, my)

router.
    route('/register')
// .post(validate('register'), register)

module.exports = router;    
