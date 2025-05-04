const errorHandler = (err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Something went wrong',
            status: err.status || 500,
            stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
        }
    });
}

module.exports = errorHandler;
