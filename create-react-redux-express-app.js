#!/usr/bin/env node

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict'

const chalk = require('chalk')
const validateProjectName = require('validate-npm-package-name')
const commander = require('commander')
const fs = require('fs-extra')
const path = require('path')
const execSync = require('child_process').execSync
const spawn = require('cross-spawn')
const semver = require('semver')
const tmp = require('tmp')
const unpack = require('tar-pack').unpack
const hyperquest = require('hyperquest')

const currentPackageJSON = require('./package.json')

const helpLog = () => {
    console.log('help: ')
    console.log('--ts for typescript')
}

const undefinedProjectName = () => {
    console.error(chalk.red('specify the project directory:'))
    console.log( '$ ' + chalk.magenta(reactExpressTemplate.name()) + chalk.cyan(' <project-directory>'))
    console.log()
    console.log('run ' + chalk.magenta(reactExpressTemplate.name() + '--help ') + 'for options')
}

const currentNodeVersion = process.versions.node
if (currentNodeVersion.split('.')[0] < 4) {
    console.error(
        chalk.bgRed(
            'Update Node Version.'
        )
    )
    process.exit(1)
}

let projectName

const templateCreator = commander

templateCreator
    .version(currentPackageJSON.version)
    .arguments('<project-directory>')
    .usage(chalk.magenta('<project-directory>') + ' [options] ')
    .action((name) => { projectName = name})
    .option('--verbose', 'print additional logs')
    .option('--template-version <alternative-package>', 'use a different template')
    .option('--no additional-packages', 'only use dependencies from your template')
    .option('--ts', 'include typescript extras')
    .allowUnknownOption().on('--help', ()=> {
    helpLog()
}).parse(process.argv)

if (typeof projectName === 'undefined'){
    console.error(() => {undefinedProjectName()})
    process.exit(1)
}

const printValidationResults = (results) => {
    if (typeof results !== undefined) {
        results.forEach((error) => {
            console.error(chalk.red (' **** ', error))
        })
    }
}

const getTemporaryDirectory = () => {
    return new Promise((resolve, reject) => {
        tmp.dir({unsafeCleanup: true}, (err, tempDir, callback) => {
            if (err) {
                reject(err)
            } else {
                resolve({
                    tmpdir,
                    cleanup: () => {
                        try {
                            callback()
                        } catch (ignored) {

                        }
                    }
                })
            }
        })
    })
}

const getPackageName = (installPackage) => {
    if (installPackage.indexOf('.tgz') > -1){
        return getTemporaryDirectory().then( (obj) => {
            let stream
            if (/^http/.test(installPackage)) {
                stream = hyperquest(installPackage)
            } else {
                stream = fs.createReadStream(installPackage)
            }
            return extractStream(stream, obj.tmpdir).then(() => {
                return obj
            })

        }).then((obj) => {
            const packageName = require(path.join(obj.tmpdir, 'package.json')).name
            obj.cleanup()
            return packageName
        }).catch((err) => {
            console.log('could not extract package name from archive' + err.message)
            const assumedProjectName = installPackage.match(/^.+\/(.+?)(?:-\d+.+)?\.tgz$/)[1]
            console.log('based on the filename, assuming it is ' + assumedProjectName)
            return Promise.resolve(assumedProjectName)
        })
    } else if (installPackage.indexOf('git+') === 0) {
        return Promise.resolve(installPackage.match(/([^\/]+)\.git(#.*)?$/)[1])
    } else if (installPackage.indexOf('@') > 0) {
        return Promise.resolve(installPackage.charAt(0) + installPackage.substr(1).split('@')[0])
    }
    return Promise.resolve(installPackage)
}

const getInstallPackage = (version, ts) => {
    let packageToInstall = 'react-redux-express-template'
    if (ts) {
        packageToInstall = 'react-redux-express-ts-template'
    }
    const validSemVer = semver.valid(version)
    if (validSemVer) {
        packageToInstall += '@' + validSemVer
    } else if (version) {
        packageToInstall = version
    }
    return packageToInstall
}

const checkAppName = (appName) => {
    const validateResult = validateProjectName(appName)
    if (!validateResult.validForNewPackages) {
        console.log('cannot create projected called' + chalk.blue(appName) + 'b/c npm naming restrictions' )
        printValidationResults(validateResult.errors)
        printValidationResults(validateResult.warnings)
        process.exit(1)
    }

    const dependencies= ['react', 'react-dom']

    if (dependencies.indexOf(appName) >= 0) {
        console.error('please choose different project name')
        process.exit(1)
    }

}

const extractStream = (stream, dest) => {
    return new Promise((resolve, reject) => {
        stream.pipe(unpack(dest, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve(dest)
            }
        }))
    })
}

const checkNpmVersion = () => {
    let isNpm2 = false
    try {
        const npmVersion = execSync('npm --version').toString()
        isNpm2 = semver.lt(npmVersion, '3.0.0')
    } catch (err) {
        return
    }
    if (!isNpm2) {
        return
    }
    console.log('you are using npm 2, upgrade to npm 3 or yarn for faster install and less disk usage')
}

const checkNodeVersion = (packageName) => {
    const packageJsonPath = path.resolve(
        process.cwd(),
        'node_modules',
        packageName,
        'package.json'
    )
    const packageJson= require(packageJsonPath)
    if (!packageJson.engines || !packageJson.engines.node) {
        return
    }

    if (!semver.satisfies(process.version, packageJson.engines.node)) {
        console.error(
            'outdated version of node, update it.', process.version, packageJson.engines.node
        )
        process.exit(1)
    }
}

const fixDependencies = (packageName) => {
    const packagePath = path.join(process.cwd(), 'package.json')
    const packageJson = require(packagePath)

    if (typeof packageJson.dependencies === 'undefined') {
        console.log('missing dependencies in package.json')
        process.exit(1)
    }

    const  packageVersion = packageJson.dependencies[packageName]

    if (typeof packageVersion === 'undefined') {
        console.error(
            chalk.red('Unable to find ' + packageName + ' in package.json')
        )
        process.exit(1)
    }

    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
}

const isSafeToCreateProjectIn = (root) => {
    const validFiles = [
        '.DS_Store', 'Thumbs.db', '.git', '.gitignore', '.idea', 'README.md', 'LICENSE', 'web.iml'
    ]
    return fs.readdirSync(root)
        .every((file) => {
            return validFiles.indexOf(file) >= 0
        })
}


const initialize = (appPath, appName, packageName, verbose, originalDir, useAdditionalPackages, ts) => {

    console.log(chalk.magenta('initializing...'))

    const ownPath = path.join(appPath, 'node_modules', packageName)

    const types = [
        '@types/history',
        '@types/jest',
        '@types/jquery',
        '@types/node',
        '@types/react',
        '@types/react-dom',
        '@types/react-router-redux',
        '@types/redux-logger',
        '@types/redux-promise-middleware'
    ]

    const additionalPackages = [
        'axios',
        'date-input-polyfill',
        'express',
        'history',
        'jquery',
        'moment',
        'react',
        'react-dom',
        'react-draggable',
        'react-redux',
        'react-router',
        'react-router-dom',
        'react-router-redux',
        'redux',
        'redux-logger',
        'redux-promise-middleware',
        'redux-thunk'
    ]

    const tsconfig =    {
        "compilerOptions": {
            "outDir": "web/dist",
            "module": "commonjs",
            "target": "es6",
            "experimentalDecorators": true,
            "lib": ["es6", "dom"],
            "types": ["reflect-metadata", "node", "redux-thunk"],
            "sourceMap": true,
            "allowJs": true,
            "jsx": "react",
            "moduleResolution": "node",
            "pretty": true,
            "emitDecoratorMetadata": true
        },
        "exclude": [
            "node_modules",
            "build",
            "scripts",
            "acceptance-tests",
            "jest",
        ]
    }

    const tsconfigTest = {
        "extends": "./tsconfig.json",
        "compilerOptions": {
            "module": "commonjs"
        }
    }

    const tslint = {
        "extends": ["tslint-react"],
        "rules": {
            "align": [
                true,
                "parameters",
                "arguments",
                "statements"
            ],
            "ban": false,
            "class-name": true,
            "comment-format": [
                true,
                "check-space"
            ],
            "curly": true,
            "eofline": false,
            "forin": true,
            "indent": [ true, "spaces" ],
            "interface-name": [true, "never-prefix"],
            "jsdoc-format": true,
            "jsx-no-lambda": false,
            "jsx-no-multiline-js": false,
            "label-position": true,
            "max-line-length": [ true, 120 ],
            "member-ordering": [
                true,
                "public-before-private",
                "static-before-instance",
                "variables-before-functions"
            ],
            "no-any": false,
            "no-arg": true,
            "no-bitwise": true,
            "no-consecutive-blank-lines": true,
            "no-construct": true,
            "no-debugger": true,
            "no-duplicate-variable": true,
            "no-empty": true,
            "no-eval": true,
            "no-shadowed-variable": false,
            "no-string-literal": true,
            "no-switch-case-fall-through": true,
            "no-trailing-whitespace": false,
            "no-unused-expression": true,
            "no-use-before-declare": true,
            "one-line": [
                true,
                "check-catch",
                "check-else",
                "check-open-brace",
                "check-whitespace"
            ],
            "quotemark": [true, "single", "jsx-double"],
            "semicolon": [true, "never", "ignore-interfaces"],
            "switch-default": true,

            "trailing-comma": false,

            "triple-equals": [ true, "allow-null-check" ],
            "typedef": [
                true,
                "parameter",
                "property-declaration"
            ],
            "typedef-whitespace": [
                true,
                {
                    "call-signature": "nospace",
                    "index-signature": "nospace",
                    "parameter": "nospace",
                    "property-declaration": "nospace",
                    "variable-declaration": "nospace"
                }
            ],
            "variable-name": [true, "ban-keywords", "check-format", "allow-leading-underscore", "allow-pascal-case"],
            "whitespace": [
                true,
                "check-branch",
                "check-decl",
                "check-module",
                "check-operator",
                "check-separator",
                "check-type",
                "check-typecast"
            ]
        }
    }


    //command line command:
    // npm install --save [--verbose]
    const command = 'npm'
    let saveArgs = ['install', '--save', verbose && '--verbose'].filter(e => e)

    let packagesToSave = []

    if (useAdditionalPackages) {
        for (let i = 0; i < additionalPackages.length; i++){
            packagesToSave.push(additionalPackages[i])
        }
    }

    if (ts) {
        for (let i = 0; i < types.length; i++){
            packagesToSave.push(types[i])
        }

        // create tsconfig.json, tsconfig.test.json, tslint.json
        fs.writeFileSync(
            path.join(appPath, 'tsconfig.json'),
            JSON.stringify(tsconfig, null, 2)
        )
        fs.writeFileSync(
            path.join(appPath, 'tsconfig.test.json'),
            JSON.stringify(tsconfigTest, null, 2)
        )
        fs.writeFileSync(
            path.join(appPath, 'tslint.json'),
            JSON.stringify(tslint, null, 2)
        )

    }

    //runs command line commands
    const runCommand = (command, args, type) => {
        const run = spawn.sync(command, args, type)
        if (run.status !== 0) {
            console.error(`\' ${command} ${args}\' failed`)
        }
    }


    //if a readmeExits, change its name and create new one in appPath
    const readmeExists = fs.existsSync(path.join(appPath, 'README.md'))
    if (readmeExists) {
        fs.renameSync(path.join(appPath, 'README.md'), path.join(appPath, 'OLDREADME.md'))
    }

    //finds the template directory
    const templatePath = path.join(ownPath)

    const templatePackageJSON = require(path.join(templatePath, 'package.json'))

    templatePackageJSON.name = appName
    templatePackageJSON.version = '0.0.0'
    templatePackageJSON.private = true
    templatePackageJSON.description = 'some ' + appName + ' description'
    templatePackageJSON.license = templatePackageJSON.license || 'BSD'
    templatePackageJSON.dependencies = templatePackageJSON.dependencies || {}

    //copies template directory to appPath
    // the template/package.json is copied over.
    // this means that scripts, babel, etc will be copied over as well.
    if (fs.existsSync(templatePath)) {
        fs.copySync(templatePath, appPath)
    } else {
        console.error(chalk.bgRed.white(`Cannot find template`))
    }

    // overwrite the templatePackage to package.json in appPath to update the name, version, etc
    fs.writeFileSync(
        path.join(appPath, 'package.json'),
        JSON.stringify(templatePackageJSON, null, 2)
    )

    if (templatePackageJSON.dependencies !== {} ) {
        if (templatePackageJSON.dependencies !== {}) {
            packagesToSave.push.apply(Object.keys(templatePackageJSON.dependencies))
        }
    }

    //run npm install after the template has been copied over to prevent template/package.json from being overwritten
    runCommand(command, saveArgs.concat(packagesToSave), {stdio: 'inherit'})


    //rename .gitignore because npm has renamed it .npmignore
    // See: https://github.com/npm/npm/issues/1862
    fs.move(
        path.join(appPath, '.npmignore'),
        path.join(appPath, '.gitignore'),
        [],
        err => {
            if (err) {
                if (err.code === 'EEXIST') {
                    const currentgitignore = fs.readFileSync(path.join(appPath, '.gitignore'))
                    fs.appendFileSync(path.join(appPath, '.gitignore'), currentgitignore)
                    fs.unlinkSync(path.join(appPath, '.gitignore'))
                } else if (err.code === 'ENOENT') {
                    return
                } else {
                    throw err
                }

            }
        }
    )

    let cdpath
    if (originalDir && path.join(originalDir, appName) === appPath) {
        cdpath = appName
    } else {
        cdpath = appPath
    }

    /*SUCCESS FUNCTION*/
    console.log()
    console.log(chalk.bgCyan('***************************************************************'))
    console.log(chalk.cyan(`SUCCESS!`))
    console.log(chalk.cyan(`your react-express-template has been created at ${appName}`))
    console.log()
    console.log(chalk.cyan(` cd ${cdpath}`))
    if (readmeExists) {
        console.log()
        console.log(chalk.magenta('your original README.md was renamed to OLDREADME.md'))
    }
    console.log()
    console.log(chalk.bgCyan('***********************************************'))
}



const run = (root, appName, version, verbose, originalDir, noAdditionalPackages, ts) => {
    const packageToInstall = getInstallPackage(version, ts)
    const packageDependencies = [packageToInstall]

    console.log(chalk.magenta('beginning install, it may take awhile...'))

    getPackageName(packageToInstall)
        .then((packageName) => {
            console.log('installing ' + packageName + ' in ' + process.cwd() )
            return install(packageDependencies, verbose)
                .then(
                    ()=> {
                        return packageName})
        })
        .then((packageName) => {
            checkNodeVersion(packageName)
            fixDependencies(packageName)

            initialize(root, appName, packageName, verbose, originalDir, noAdditionalPackages, ts)
        })
        .catch((
            reason) => {
            console.log(chalk.bgRed('abort'))
            if (reason.command){
                console.log(reason.command + 'has failed')
            } else {
                console.log('unexpected error...', reason)
            }

            const knownGeneratedFiles = [
                'package.json', 'npm-debug.log', 'node_modules'
            ]
            const currentFiles = fs.readdirSync(path.join(root))
            currentFiles.forEach((file) => {
                knownGeneratedFiles.forEach( (fileToMatch) => {
                    if ((fileToMatch.match(/.log/g) && file.indexOf(fileToMatch) === 0) || file === fileToMatch) {
                        console.log('deleting generated file' + chalk.bgYellow(file))
                        fs.removeSync(path.join(root, file))
                    }
                })
            })
            const remainingFiles = fs.readdirSync(path.join(root))
            if (!remainingFiles.length) {
                console.log('deleting ', appName, 'from', path.resolve(root, '..'))
                process.chdir(path.resolve(root, '..'))
                fs.removeSync(path.join(root))
            }
            console.log('done')
            process.exit(1)
        })
}


const install = (dependencies, verbose) => {
    return new Promise((resolve, reject) => {
        let command
        let args

        checkNpmVersion()
        command = 'npm'
        args = ['install', '--save', '--save-exact'].concat(dependencies)


        if (verbose) {
            args.push('--verbose')
        }

        var child = spawn(command, args, {stdio: 'inherit'})
        child.on('close', (code) => {
            if (code !== 0) {
                reject({
                    command: command + ' ' + args.join(' ')
                })
                return
            }
            resolve()
        })
    })
}

const createApp = (name, verbose, version, noAdditionalPackages, ts) => {
    const root = path.resolve(name)
    const appName = path.basename(root)

    checkAppName(appName)
    fs.ensureDirSync(name)
    if (!isSafeToCreateProjectIn(root)) {
        console.log('use new directory name')
        process.exit(1)
    }

    console.log(chalk.magenta('creating new app'))

    const packageJson = {
        name: appName,
        version: '0.0.0',
        private: true,
        description: appName + 'description'
    }
    fs.writeFileSync(
        path.join(root, 'package.json'),
        JSON.stringify(packageJson, null, 2)
    )

    const originalDirectory = process.cwd()
    process.chdir(root)

    run(root, appName, version, verbose, originalDirectory, noAdditionalPackages, ts)
}




createApp(projectName, templateCreator.verbose, templateCreator.scriptsVersion, templateCreator.noAdditionalPackages, templateCreator.ts)

