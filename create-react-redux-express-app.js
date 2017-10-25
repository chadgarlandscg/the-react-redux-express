#!/usr/bin/env node

'use strict'

const chalk = require('chalk')
const validateProjectName = require('validate-npm-package-name')
const commander = require('commander')
const fs = require('fs-extra')
const path = require('path')
const execSync = require('child_process').execSync
const spawn = require('cross-spawn')
const semver = require('semver')
const dns = require('dns')
const tmp = require('tmp')
const unpack = require('tar-pack').unpack
const hyperquest = require('hyperquest')
const packJson = require('./package.json')


const currentNodeVersion = process.versions.node
if (currentNodeVersion.split('.')[0] < 4) {
    console.error(
        chalk.bgRed(
            'Update Node Version.'
        )
    )
    process.exit(1)  //exit with failure code.
}

let projectName

const program = commander

program
    .version(packJson.version)
    .arguments('<project-directory>')
    .usage(chalk.magenta('<project-directory>') + ' [options] ')
    .action((name) => {
        projectName = name
    })
    .option('--verbose', 'print additional logs')
    .option('--scripts-version <alternative-package>', 'use a non-standard react-scripts version')
    .allowUnknownOption()
    .on('--help', () => {
        console.log('some help....')
    })
    .parse(process.argv)

if (typeof projectName === 'undefined') {
    console.error('specificy project directory')
    process.exit(1)
}

const printValidationResults = (results) => {
    if (typeof results !== undefined) {
        results.forEach((error) => {
            console.error(chalk.red (' **** ', error))
        })
    }
}

const hiddenProgram = new commander.Command()
    .option('--internal-testing-template <path-to-template>', 'use a non-standard application template (internal use)')



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

const getInstallPackage = (version) => {
    let packageToInstall = 'react-redux-express-scripts'
    const validSemVer = semver.valid(version)
    if (validSemVer) {
        packageToInstall += '@' + validSemVer
    } else if (version) {
        packageToInstall = version
    }
    return packageToInstall
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
    console.log('you are using npm 2, upgrate to npm 3 or yarn for faster install and less disk usage')
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

const checkAppName = (appName) => {
    const validateResult = validateProjectName(appName)
    if (!validateResult.validForNewPackages) {
        console.log('cannot create projected called' + chalk.blue(appName) + 'b/c npm naming restrictions' )
        printValidationResults(validateResult.errors)
        printValidationResults(validateResult.warnings)
        process.exit(1)
    }

    const dependencies= ['react', 'react-dom']
    const devDependencies = ['react-scripts']
    const allDependencies = dependencies.concat(devDependencies).sort()

    if (allDependencies.indexOf(appName) >= 0) {
        console.error('please choose different project name')
        process.exit(1)
    }

}

const makeCaretRange = (dependencies, name) => {
    const version = dependencies[name]
    if (typeof version === 'undefined') {
        console.error('missing' + name + 'in package.json')
        process.exit(1)
    }
    let patchedVersion = '^' + version
    if (!semver.validRange(patchedVersion)) {
        console.error(
            'unable to patch', name, 'dependency version invalid'
        )
        patchedVersion = version
    }

    dependencies[name] = patchedVersion

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

    packageJson.devDependencies = packageJson.devDependencies || {}
    packageJson.devDependencies[packageName] = packageVersion
    delete packageJson.dependencies[packageName]

    makeCaretRange(packageJson.dependencies, 'react')
    makeCaretRange(packageJson.dependencies, 'react-dom')

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



const run = (root, appName, version, verbose, originalDirectory, template) => {
    const packageToInstall = getInstallPackage(version)
    const allDependencies = ['react', 'react-dom', packageToInstall]

    console.log(chalk.bgMagenta('installing, may take awhile...'))

    getPackageName(packageToInstall).then((packageName) => {
        console.log('installing react, react-dom && ' + packageName)

        return install(allDependencies, verbose).then(
            ()=> {
                return packageName})
    }).then((packageName) => {
        checkNodeVersion(packageName)
        fixDependencies(packageName)

        const scriptsPath = path.resolve(
            process.cwd(),
            'node_modules',
            packageName,
            'scripts',
            'initialize.js'
            // cwd/node_modules/create-express-react-template/scripts/init.js
        )

        const init = require(scriptsPath)
        init(root, appName, verbose, originalDirectory, template)
    })
        .catch((reason) => {
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

const createApp = (name, verbose, version, template) => {
    const root = path.resolve(name)
    const appName = path.basename(root)

    checkAppName(appName)
    fs.ensureDirSync(name)
    if (!isSafeToCreateProjectIn(root)) {
        console.log('use new directory name')
        process.exit(1)
    }

    console.log(chalk.bgMagenta('creating new app'))

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

    run(root, appName, version, verbose, originalDirectory, template)
}




createApp(projectName, program.verbose, program.scriptsVersion, hiddenProgram.internalTestingTemplate)