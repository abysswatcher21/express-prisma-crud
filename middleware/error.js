const { invalid } = require("moment");

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    if (err.errorCode == 'VALIDATION_ERROR') {
        let error_validation = {};

        error.data.forEach((element) => {
            error_validation[element.param] = element.msg;
        });

        error.data = error_validation;
    }

    console.log(error);
    if (error.message.search("Invalid")) {
        error.message = 'Invalid filter on request'
    }
    res.status(error.statusCode || 200).json({
        success: false,
        error_code: error.errorCode || 'PROCESS_ERROR',
        message: error.message || 'Server Error',
        data: error.data
    });
}

module.exports = errorHandler;