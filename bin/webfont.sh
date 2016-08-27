#!/scripts/bash

npm run before:compile
fontcustom compile
npm run after:compile
rm -rf docs/font/*.*
cp -r build/fonts/ docs/fonts
