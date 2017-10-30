#!/bin/bash

npm install -g browserify
npm install -g watchify
npm install -g uglify
npm install -g babelify
npm install -g envify
npm install -g supervisor

npm install

brew update
brew install postgresql
mkdir -p ~/Library/LaunchAgents
ln -sfv /usr/local/opt/postgresql/*.plist ~/Library/LaunchAgents
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist
createdb postgres_db
psql postgres_db < init.sql