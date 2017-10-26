var express = require('express');
var router = express.Router();
const counterService = require('../services/counter')
const NO_VAL_ERROR = {status: 400, message: 'Must provide val in the body!'};

/* POST val to increment. */
router.post('/increment', (req, res, next) => {
    if (req.body && req.body.val) {
        return res.status(200).send({
            val: counterService.increment(req.body.val)
        });
    }
    return next(NO_VAL_ERROR);
});

/* POST val to decrement. */
router.post('/decrement', (req, res, next) => {
    if (req.body && req.body.val) {
        return res.status(200).send({
            val: counterService.decrement(req.body.val)
        });
    }
    return next(NO_VAL_ERROR);
});

/* POST val to increment or decrement. */
router.post('/change', (req, res, next) => {
    if (req.body && req.body.val) {
        const toBeDecremented = req.query.decrement === 'true'
        return res.status(200).send({
            val: counterService.change(toBeDecremented, req.body.value)
        });
    }
    return next(NO_VAL_ERROR);
});

module.exports = router;
