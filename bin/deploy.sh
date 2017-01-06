#!/bin/ bash

set -e

rm -rf .git
rm -r .gitignore

echo "bin
docs/
gulp/
node_modules/
src/
.editorconfig
*.json
*.yml
gulpfile.babel.js
.DS_store
.npmignore" > .gitignore

git init
git config user.name "featherplain"
git config user.email "info@featherplain.com"
git add .
git commit --quiet -m "Deploy from travis"
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:release > /dev/null 2>&1
