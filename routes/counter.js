var express = require('express');
var router = express.Router();
const NO_VAL_ERROR = {status: 400, message: 'Must provide val in the body!'};

/* POST val to increment. */
router.post('/increment', function (req, res, next) {
    if (req.body && req.body.val) {
        const incremented = req.body.val + 1;
        return res.status(200).send({val: incremented});
    }
    return next(NO_VAL_ERROR);
});

/* POST val to decrement. */
router.post('/decrement', function (req, res, next) {
    if (req.body && req.body.val) {
        const decremented = req.body.val - 1;
        return res.status(200).send({val: decremented});
    }
    return next(NO_VAL_ERROR);
});

/* POST val to increment or decrement. */
router.post('/change', function (req, res, next) {
    if (req.body && req.body.val) {
        let resultVal = req.body.val;
        if (req.query.decrement==='true') {
            resultVal--;
        } else {
            resultVal++;
        }
        return res.status(200).send({val: resultVal});
    }
    return next(NO_VAL_ERROR);
});

module.exports = router;
