const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../library/errorResponse');
const { body, validationResult } = require('express-validator');
const prismaTable = require('../library/prismatable');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



// @desc User
// @route GET /api/user
// @access Public
exports.user = asyncHandler(async (req, res, next) => {
    // If object is empty filter select would be selected
    let select = {};
    // current where combining with request filter
    let where = {};
    // Including the selected relation
    let include = {};
    // Using the prisma table to do it
    let results = await prismaTable(req, prisma.User, select, where, include);
    // If U Want To Excluding select Or Modify The Data
    results.data.forEach((element, index) => {
        results.data[index].createdAt = moment(element.createdAt).format('YYYY-MM-DD H:mm:ss');
        delete results.data[index].password
    });

    res.status(200).json({ success: true, message: 'Success.', ...results });
});

exports.exampleTable = asyncHandler(async (req, res, next) => {
    // If object is empty filter select would be selected if include was used it not working
    let select = {
        // id: true,
        // username: true
    };
    // current where combining with request filter
    let where = {
        // id: 1,
        // OR: [
        //     {
        //         email: {
        //             endsWith: 'prisma.io',
        //         },
        //     },
        //     { email: { endsWith: 'gmail.com' } },
        // ]
        // NOT: {
        //     email: {
        //         endsWith: 'gmail.com',
        //     },
        // },
        // AND: [
        //     { email: { endsWith: 'gmail.com' } },
        // ]
    };
    // Including the selected relation & relations is plural
    let include = {
        posts: true
    };
    // Using the prisma table to do it
    let results = await prismaTable(req, prisma.User, select, where, include);

    // If U Want To Excluding select Or Modify The Data
    results.data.forEach((element, index) => {
        delete results.data[index].password
    });

    res.status(200).json({ success: true, message: 'Success.', ...results });
});


exports.register = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new ErrorResponse('Failed to create the data', 422, errors.array(), 'VALIDATION_ERROR'))
    }


    let salt = await bcrypt.genSalt(10);
    let password = await bcrypt.hash(req.body.password, salt);

    let createUser = await prisma.User.create({
        data: {
            username: req.body.username,
            email: req.body.email,
            name: req.body.name,
            password,
            role: 'USER'
        }
    })

    if (!createUser) {
        return next(new ErrorResponse('Failed to create the data', 200))
    }

    res.status(200).json({ success: true, message: 'Success.', data: req.body });
});

exports.login = asyncHandler(async (req, res, next) => {
    const user = await prisma.User.findFirst({
        where: {
            OR: [
                {
                    username: req.body.username,
                },
                {
                    email: req.body.username,
                },
            ],
        },
    })

    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
        return next(new ErrorResponse('Username or password wrong!', 200));
    }

    const token = jwt.sign(
        {
            id: user.id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE
        }
    );

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }


    res.status(200)
        .cookie('token', token, options)
        .json({ success: true, token });
});


// Handling All Validation In Controller
exports.validate = (method) => {
    switch (method) {
        case 'register':
            return [
                body('name', 'Please Input Name').isLength({ min: 5 }),
                body('username', 'Please Input Email')
                    .isLength({ min: 5 })
                    .custom(async (value) => {
                        const user = await prisma.User.findUnique({
                            where: {
                                username: value,
                            },
                        })

                        if (user) {
                            throw new Error('Username is used by another user please using another username !.');
                        }

                        return true;
                    }),
                body('email')
                    .isLength({ min: 5 })
                    .isEmail()
                    .custom(async (value) => {
                        const user = await prisma.User.findUnique({
                            where: {
                                email: value,
                            },
                        })

                        if (user) {
                            throw new Error('E-mail is used by another user please using another email !.');
                        }

                        return true;
                    }),

            ]
            break;
    }
}
