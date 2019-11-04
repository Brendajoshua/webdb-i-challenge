const express = require('express');

const db = require('../data/dbConfig');

//import middleware
const validateId = require('../middleware/validateId');
const validateAccount = require('../middleware/validateAccount');

const router = express.Router();

//get all the accounts
router.get('/', (req, res) => {
    db('accounts')
    .then(accounts => {
        res.status(200).json(accounts);
    })
    .catch(errror => {
        res.status(500).json({ message: 'could not retrieve accounts list' });
    });
});

// get one account by id
router.get('/:id', (req, res) => {
    db('accounts')
      .where({ id: req.params.id })
      .first()
      .then(account => {
        if (account) {
          res.status(200).json(account);
        } else {
          res.status(404).json({ message: 'Account not found' });
        }
      });
  });

  // post an account
  router.post('/', validateAccount, (req, res) => {
    if (accountIsValid(req.body)) {
      db('accounts')
        .insert(req.body, 'id')
        .then(([id]) => id)
        .then(id => {
          db('accounts')
            .where({ id })
            .first()
            .then(account => {
              res.status(201).json(account);
            });
        })
        .catch(() => {
          res.status(500).json({ message: 'Could not add the account' });
        });
    } else {
      res.status(400).json({
        message: 'Please provide name and budget of zero or more for the account',
      });
    }
  });
  

  // update account by id
  router.put('/:id', validateId, validateAccount, (req, res) => {
    db('accounts')
      .where({ id: req.params.id })
      .update(req.body)
      .then(count => {
        if (count) {
          res.status(200).json({ message: `${count} record(s) updated` });
        } else {
          res.status(404).json({ message: 'Account not found' });
        }
      })
      .catch(() => {
        res.status(500).json({ message: 'Could not update the account' });
      });
  });
  
  // delete account by id
  router.delete('/:id', validateId, (req, res) => {
    db('accounts')
      .where({ id: req.params.id })
      .del()
      .then(count => {
        res.status(200).json({ message: `${count} record(s) deleted` });
      })
      .catch(() => {
        res.status(500).json({ message: 'Could not remove the account' });
      });
  });
  
  function accountIsValid({ name, budget }) {
    return name && typeof budget === 'number' && budget >= 0;
  }
  
  module.exports = router;