const Joi = require('joi')

module.exports.storedCounterCreate = {
    body: {
        please: Joi.boolean().valid(true).required(),
        init: Joi.number().integer().default(0),
        appUserId: Joi.number().integer()
    }
}

module.exports.storedCounterUpdate = {
    params: {
        id: Joi.number().integer().positive().required()
    },
    body: {
        val: Joi.number().integer(),
        appUserId: Joi.number().integer()
    }
}