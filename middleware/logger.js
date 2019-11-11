function logger(req, res, next) {
    console.log(req.method, req.url, date.now())
    next();
}

module.exports = logger;