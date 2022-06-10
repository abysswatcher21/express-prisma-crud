class ErrorResponse extends Error {
    constructor(message, statusCode, data = {}, errorCode = '') {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.data = data
    }
}

module.exports = ErrorResponse;