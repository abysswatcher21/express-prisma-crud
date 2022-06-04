const asyncHandler = require('../middleware/async');
const prismaTable = require('../library/prismatable');

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
    log: ['query'],
});

const { User } = prisma;

prisma.$on("query", async (e) => {
    console.log(`${e.query} ${e.params}`)
});

// @desc Produk Variant
// @route POST /api/product/variant
// @access Private
exports.user = asyncHandler(async (req, res, next) => {
    let data = await prismaTable(req, User, {
        // AND: [
        //     {
        //         username: {
        //             contains: '23'
        //         }
        //     },
        //     {
        //         name: {
        //             contains: 'ah'
        //         }
        //     },
        // ]
        // OR: [
        //     {
        //         username: {
        //             contains: '23'
        //         }
        //     },
        //     {
        //         name: {
        //             contains: 'ah'
        //         }
        //     },
        // ]
    }, {
        posts: true
    });

    res.status(200).json({ success: true, message: 'Success.', ...data });
});
