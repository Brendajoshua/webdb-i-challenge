const db = require('../data/dbConfig');

function validateId (req, res, next) {
    const id = req.params.id;
    db('accounts').where({ id: req.prams.id })
    .then(account => {
        if (Object.keys(account).length === 0) {
            res.status(400).json({ message: "Invalid account id" });
        } else {
            account = req.account;
            next();
        }
    });
}

module.exports = validateId;