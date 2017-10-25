// @remove-file-on-eject
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use-script'

//crash script on rejection
process.on('unhandledRejection', err => {
    throw err
})
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const spawn = require('cross-spawn');


const initialize = (appPath, appName, verbose, originalDir, template) => {
    const ownPackageName = require(path.join(__dirname, '..', 'package.json')).name
    const ownPath = path.join(appPath, 'node_modules', ownPackageName)
    const appPackage = require(path.join(appPath, 'package.json'))

    appPackage.dependencies = appPackage.dependencies || {}

    appPackage.scripts = {
        bundle: './bundle',
        build: './build'
    }

    console.log(appPackage)

    fs.writeFileSync(
        path.join(appPath, 'package.json'),
        JSON.stringify(appPackage, null, 2)
    )

    const readmeExists = fs.existsSync(path.join(appPath, 'README.md'))
    if (readmeExists) {
        fs.renameSync(path.join(appPath, 'README.md'), path.join(appPath, 'README.old.md'))
    }

    const templatePath = template ? path.resolve(originalDirectory, template) : (path.join(ownPath, 'template'))
    console.log(ownPath)

    if (fs.existsSync(templatePath)) {
        fs.copySync(templatePath, appPath)
    } else {
        console.error(`${chalk.red('Can\'t find supplied template:')} ${chalk.cyan(templatePath)}`)
        return
    }

    fs.move(
        path.join(appPath, 'gitignore'),
        path.join(appPath, 'gitignore'),
        [],
        err => {
            if (err) {
                if (err.code === 'EEXIST') {
                    const data = fs.readFilesSync(path.join(appPath, 'gitignore'))
                    fs.appendFileSync(path.join(appPath, 'gitignore'), data)
                    fs.unlinkSync(path.join(appPath, 'gitignore'))
                } else if (err.code === 'ENOENT') {
                    return
                } else {
                    throw err
                }
            }
        })

    const command = 'npm'
    let args = ['install', '--save', verbose && '--verbose'].filter(e => e)

    const templateDependenciesPath = path.join(appPath, '.template.dependencies.json')
    if (fs.existsSync(templateDependenciesPath)) {
        args = args.concat(Object.keys(templateDependenciesPath).map(key => {
            return `${key}@${templateDependenciesPath[key]}`
        }))
        fs.unlinkSync(templateDependenciesPath)
    }

    const types = [
        '@types/node',
        '@types/react',
        '@types/react-dom',
        '@types/jest',
    ]

    const necessaryPackages = [
        'react',
        'react-dom',
        'redux',
        'redux-router',
    ]

    console.log(`Installing ${types.join(', ')} ${command}... `)
    console.log()

    const proc = spawn.sync(command, args.concat(types), {stdio: 'inherit'})
    if (proc.status !== 0) {
        console.error(`\`${command} ${args.join(' ')}\` failed `)
        return
    }

    if (!isReactInstalled(appPackage) || template) {
        console.log(`installing ${necessaryPackages} using ${command}`)
        console.log()
        const proc = spawn.sync(command, args.concat(necessaryPackages), {stdio: 'inherit'})
        if (proc.status !== 0) {
            console.error(`\`${command} ${args.join(' ')}\` failed `)
            return
        }
    }
    else {

        var cdpath
        if (originalDir && path.join(originalDir, appName) === appPath) {
            cdpath = appName
        }
        cdpath = appName
    }

    console.log()
    console.log(`Success! Created, ${appName} at ${appPath}`)
    console.log(`inside, you should run these commands`)
    console.log('npm run init (if you haven\'t already)')
    console.log('npm install (if you already have the globals)')
    console.log('npm start (to get the train a-chuggin\')')
    console.log(chalk.cyan(' cd'), cdpath)
    if (readmeExists) {
        console.log();
        console.log(
            chalk.yellow(
                'You had a `README.md` file, we renamed it to `README.old.md`'
            )
        );
    }
    console.log();
    console.log('choo choo!');

}

const isReactInstalled = (appPackage) => {
    const dependencies = appPackage.dependencies || {};

    return (
        typeof dependencies['react']!== 'undefined' &&
        typeof dependencies['react-dom'] !== 'undefined'
    )
}

module.exports = initialize