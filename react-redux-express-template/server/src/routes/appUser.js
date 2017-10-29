var express = require('express');
var router = express.Router();
var appUserService = require('../services/appUser')

/* GET home page. */
router.post('/authenticate', (req, res, next) => {
    return appUserService.authenticate(req.body.token)
        .then(email => res.status(200).send(email))
});

/* GET home page. */
router.post('/register', (req, res, next) => {
    return appUserService.register(req.body.token)
        .then(user => res.status(201).send(user))
        .catch(e => next(e));
});

module.exports = router;
