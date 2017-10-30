var fs = require("fs");
var browserify = require("browserify");
var envify = require('envify')
var watchify = require('watchify');

require('dotenv').config()

var b = browserify("./web/src/index.js", {
        cache: {},
        packageCache: {},
        plugin: [watchify]
    })
    .transform("babelify", {
        presets: ["es2015", "react", "babel-preset-stage-0" ],
        plugins: ["babel-plugin-transform-decorators-legacy"]
    })
    .transform(envify);

b.on('update', bundle);
bundle();

function bundle() {
    b.bundle().pipe(fs.createWriteStream('./web/public/bundle.js'));
}