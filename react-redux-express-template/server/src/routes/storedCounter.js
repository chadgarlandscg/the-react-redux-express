var express = require('express');
var router = express.Router();
// const storedCounterService = require('../services/storedCounter');
const storedCounterService = require('../services/storedCounter_bookshelf');
const validation = require('../validation/storedCounter');
var validate = require('express-validation');

/* POST to create a counter */
router.post('/', validate(validation.storedCounterCreate), (req, res, next) => {
    storedCounterService.createStoredCounter(req.body)
        .then(id => res.status(200).send(id))
        .catch(error => next(error))
});

/* PUT to update a counter. */
router.put('/:id', validate(validation.storedCounterUpdate), (req, res, next) => {
    storedCounterService.updateStoredCounter(req.params.id, req.body.val)
        .then(counter => res.status(200).send(counter))
        .catch(error => next(error))
});

/* GET to read a counter. */
router.get('/:id', (req, res, next) => {
    storedCounterService.getStoredCounter(req.params.id)
        .then(counter => res.status(200).send(counter))
        .catch(error => next(error))
});

module.exports = router;
