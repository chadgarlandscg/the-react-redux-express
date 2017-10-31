const AppUser = require('../domains/AppUser')

/* Get app user by id. */
module.exports.getAppUser = user => {
    const appUser = new AppUser(user)
    return appUser.fetch()
}

/* Create or update app user. */
module.exports.createOrUpdateAppUser = user => user.save()