#!/bin/ bash

npm install
brew tap bramstein/webfonttools
brew update
brew install woff2
brew install fontforge --with-python
brew install eot-utils
gem install fontcustom
