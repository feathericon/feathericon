feathericon
===

feathericon is simple, scalable vector icon font for websites, apps.

[![npm](https://img.shields.io/npm/v/npm.svg?maxAge=2592000)](https://www.npmjs.com/package/feathericon)
[![Build Status](https://travis-ci.org/featherplain/feathericon.svg?branch=master)](https://travis-ci.org/featherplain/feathericon)

![feathericon](https://raw.githubusercontent.com/featherplain/feathericon/master/docs/ogpimage.png "title")

## Install
You can install via [npm](https://npmjs.org).

```
$ npm install feathericon --save
```

## Usage
You can simply point your Sass `include-path` at your `node_modules/` directory and import it like this.

```
@import "feathericon/build/scss/feathericon";
```

## Customize feathericon
### 1. Edit Sketch document
Open the Sketch document in `src/feathericons.sketch`. Each icon exists as an artboard within the Sketch document. If you’re adding an icon, duplicate one of the artboards and add your shapes to it. **Be sure to give your artboard a name that makes sense**.

### 2. Build icons
1. Open the feathericon directory in Terminal .
1. Run this command to install dependencies for building icons.
  
  ```
  $ npm install
  ```
1. Run this command. Running the gulp task will generate the font, css, scss and SVGs, placing them in the `build/` directory.

  ```
  $ npm run webfont
  ```

## License
[MIT](https://github.com/featherplain/feathericon/blob/master/LICENSE) (C) 2016 Megumi Hano
