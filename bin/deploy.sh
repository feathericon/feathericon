#!/bin/ bash

set -e

rm -rf .git
rm -r .gitignore
cp -r build/css/ css
cp -r build/fonts/ fonts
cp -r build/scss/ scss
cp -r build/svg/ svg

if [[ "false" != "$TRAVIS_PULL_REQUEST" ]]; then
	echo "Not deploying pull requests."
	exit
fi

if [[ "master" != "$TRAVIS_BRANCH" ]]; then
	echo "Not on the 'master' branch."
	exit
fi

echo "bin
build/
docs/
gulp/
node_modules/
src/jade/
src/scss/
src/templates/
.editorconfig
*.json
*.yml
gulpfile.babel.js
.DS_store
*.log
.npmignore" > .gitignore

git init
git config user.name "featherplain"
git config user.email "info@featherplain.com"
git add .
git commit --quiet -m "Deploy from travis"
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:release > /dev/null 2>&1
