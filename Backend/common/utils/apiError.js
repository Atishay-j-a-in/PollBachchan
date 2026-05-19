class ApiError extends Error{
    constructor(statusCode, message){
        super(message)
        this.statusCode= statusCode
        this.isOperational= true
        Error.captureStackTrace(this, this.constructor)
    }

    static badRequest(message="bad request"){
        return new ApiError(400,message)
    }
    static serverFailed(message="Internal server error"){
        return new ApiError(500,message)
    }
    static conflict(message="conflict"){
        return new ApiError(409,message)
    }
    static unauthorized(message="Unauthorized"){
        return new ApiError(401, message)
    }
    static notFound(message="Not Found"){
        return new ApiError(404, message)
    }
    static forbidden(message="Forbidden"){
        return new ApiError(403,message)
    }
}

export default ApiError