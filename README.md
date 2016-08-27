feathericon
===

feathericon is simple, scalable vector icon font for websites, apps.

[![Build Status](https://travis-ci.org/featherplain/feathericon.svg?branch=master)](https://travis-ci.org/featherplain/feathericon)
[![npm version](https://badge.fury.io/js/feathericon.svg)](https://badge.fury.io/js/feathericon)

![feathericon](https://raw.githubusercontent.com/featherplain/feathericon/master/docs/ogpimage.png "title")

Website: [http://feathericon.com](http://feathericon.com)

## Install
You can install via [npm](https://npmjs.org).

```bash
$ npm install feathericon --save
```

## Usage
You can simply point your Sass(SCSS) `include-path` at your `node_modules/` directory and import it like this in your scss file.

```scss
@import "feathericon/build/scss/feathericon";
```

## Customize feathericon
### 1. Edit Sketch document

![Sketch document](docs/images/sketch.png)

Open the Sketch document in `src/feathericons.sketch`. Each icon exists as an artboard within the Sketch document. If you’re adding an icon, duplicate one of the artboards and add your shapes to it. **Be sure to give your artboard a name that makes sense**.

### 2. Build icons
#### Requires
- Node.js
- npm

You can download from the [Node.js download page](https://nodejs.org/en/download/), or [install via package managers](https://nodejs.org/en/download/package-manager/).
Node.js comes with npm ([See more](https://docs.npmjs.com/getting-started/installing-node)).

1. Open the `feathericon/` directory in Terminal.
1. Run this command to install dependencies for building icons.

  ```bash
  $ npm run setup
  ```
1. Run this command. Running the gulp task will generate the font, css, scss and SVGs, placing them in the `build/` directory.

  ```bash
  $ npm run webfont
  ```

## FontCustom
feathericon is using [FontCustom](https://github.com/FontCustom/fontcustom) to build fonts, stylesheets such as `feathericon.css` and `_feathericon.scss`. If you need more information for FontCustom, Visit their GitHub Repository.

## Bugs, Ideas, Pull Requests
If you have any ideas or find bugs, please send me Pull Requests or let me know with GitHub Issues :)

## License
[MIT](https://github.com/featherplain/feathericon/blob/master/LICENSE) (C) 2016 Megumi Hano
