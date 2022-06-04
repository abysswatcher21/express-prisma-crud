module.exports = async (req, model, where = {}, include = {}) => {
    const reqQuery = { ...req.query };

    //fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    //loop over removeFields and delete them from request query
    removeFields.forEach((param) => delete reqQuery[param]);

    // query string
    let queryStr = JSON.stringify(reqQuery);

    let querying = new Object;
    querying.where = JSON.parse(queryStr);
    querying.where = { ...querying.where, ...where };

    // select field
    if (req.query.select) {
        let select = req.query.select.split(',');

        const select_obj = {};

        select.forEach((element, index) => {
            select_obj[element] = true;
        });

        querying.select = select_obj;
    }

    // Sort Field
    if (req.query.sort) {
        let orderProperty = Object.keys(req.query.sort);

        querying.orderBy = orderProperty.map((element, index) => {
            return {
                [element]: Object.values(req.query.sort)[index]
            }
        });

    }

    // Pagination 
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    querying.skip = startIndex;
    querying.take = limit;

    if (Object.keys(include).length !== 0) {
        querying.include = include;
    }

    let data = await model.findMany({ ...querying });
    let count = await model.count({ where: querying.where });

    const totalPage = Math.ceil(count / limit);

    let pagination = {};

    pagination.prev = page - 1;

    if (pagination.prev < 1) {
        delete pagination.prev
    }

    pagination.next = page + 1;

    if (pagination.next > totalPage) {
        delete pagination.next
    }

    pagination.totalData = count;
    pagination.totalPage = totalPage;

    let totalDisplay = limit;

    if (pagination.next == 0) {
        totalDisplay = count % limit;
    }


    pagination.totalDisplay = totalDisplay;

    pagination.start = startIndex;
    pagination.end = endIndex;

    pagination.page = [];

    let from = 1;
    let to = totalPage;

    let toPage = page - 2;

    if (toPage > 0) {
        from = toPage;
    }

    if (totalPage <= 1) {
        pagination.page = [];
    } else {
        for (let i = from; i <= to; i++) {
            pagination.page.push(i);
        }
    }

    return {
        data,
        pagination
    }

};
