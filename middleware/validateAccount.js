function validateAccount(req, res, next) {
    const body = req.body;
    if (Object.keys(body).length === 0) {
        res.status(400).json({ message: "missing account data" });
    } else if (!body.name || !body.budget) {
        res.status(400).json({ message: "missing required name and budget field" });
    } else {
        next();
    }
}

module.exports = validateAccount;