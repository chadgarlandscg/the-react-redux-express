const AppUser = require('../domains/AppUser')

/* Get app user by id. */
module.exports.getAppUser = user => new AppUser(user).fetch()

/* Create or update app user. */
module.exports.createOrUpdateAppUser = user => user.save()