exports.my = asyncHandler(async (req, res, next) => {
    let select = {};
    let where = {
        authorId: req.user.id
    };

    let include = {};
    let results = await prismaTable(req, prisma.Post, select, where, include);

    results.data.forEach((element, index) => {
        results.data[index].createdAt = moment(element.createdAt).format('YYYY-MM-DD H:mm:ss');
        results.data[index].updatedAt = moment(element.updatedAt).format('YYYY-MM-DD H:mm:ss');
    });

    res.status(200).json({ success: true, message: 'Success.', data: results });
});

exports.post = asyncHandler(async (req, res, next) => {
    let select = {};
    let where = {
        published: true
    };

    let include = {};
    let results = await prismaTable(req, prisma.Post, select, where, include);

    results.data.forEach((element, index) => {
        results.data[index].createdAt = moment(element.createdAt).format('YYYY-MM-DD H:mm:ss');
        results.data[index].updatedAt = moment(element.updatedAt).format('YYYY-MM-DD H:mm:ss');
    });

    res.status(200).json({ success: true, message: 'Success.', data: results });
});