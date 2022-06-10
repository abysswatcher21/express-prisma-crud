
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token
    }


    // Make Sure The Token Exist
    if (!token) {
        return next(new ErrorResponse('Not Authorized', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await prisma.User.findUnique({
        where: {
            id: decoded.id
        }
    })

    next();
});