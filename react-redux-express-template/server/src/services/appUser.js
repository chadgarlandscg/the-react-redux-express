const appUserDao = require('../daos/appUserDao');
const AppUser = require('../domains/AppUser')
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var client = new auth.OAuth2(process.env.CLIENT_ID, '', '');

module.exports.authenticate = token => verifyIdToken(token)

module.exports.register = token => {
    let appUser;
    return this.authenticate(token)
        .then(authorizedUser => {
            appUser = authorizedUser;
            return appUserDao.getAppUser(authorizedUser)
        })
        .then(existingUser => {
            if (existingUser) throw 'Already registered!';
            return appUserDao.createOrUpdateAppUser(new AppUser(appUser));
        })

}

function verifyIdToken(token) {
    // 1 - Create a new Promise
    return new Promise(function (resolve, reject) {
        // 2 - Copy-paste your code inside this function
        client.verifyIdToken(
            token,
            process.env.CLIENT_ID,
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
            function(e, login) {
                if (e) {
                    reject(e)
                } else {
                    var payload = login.getPayload();
                    var userid = payload['sub'];
                    var email = payload['email'];
                    // If request specified a G Suite domain:
                    //var domain = payload['hd'];
                    resolve({email});
                }
            }
        );
    });
}