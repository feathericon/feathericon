import test from 'ava';
import fs from 'fs';

const svg = fs.readdirSync("./build/svg/");
const data = JSON.parse(fs.readFileSync("./build/data.json"))

test('svg are loaded', t => {
  t.truthy(svg, "Didn't find any feathericon.");
  t.not(Object.keys(svg).length, 0, "Didn't find any feathericon.")
});

test('Every svg is in ./build/data.json', t => {
  svg.forEach( point => {
    point = point.replace('.svg', '')
    t.truthy(data[point], './build/data.json doesn\'t include the feathericon "' + point + '"')
  })
})

test('No deprecated svg are in ./build/data.json', t => {
  Object.keys(data).forEach( point => {
    t.truthy(svg.indexOf(point+'.svg') >= 0, './build/data.json contains the deleted feathericon `' + point + '`, please remove it.' );
  })
})

test('svg-sprite is in ./build/svg-sprite', t => {
  t.truthy(fs.existsSync("./build/svg-sprite/sprite.feathericon.svg"), "sprite.feathericon.svg does not exist!");
});

test('css is in ./build/css', t => {
  t.truthy(fs.existsSync("./build/css/feathericon.css"), "feathericon.css does not exist!");
});

test('Minified css is in ./build/css', t => {
  t.truthy(fs.existsSync("./build/css/feathericon.min.css"), "feathericon.min.css does not exist!");
});

test('scss is in ./build/scss', t => {
  t.truthy(fs.existsSync("./build/scss/_feathericon.scss"), "_feathericon.scss does not exist!");
});

test('eot is in ./build/fonts', t => {
  t.truthy(fs.existsSync("./build/fonts/feathericon.eot"), "feathericon.eot does not exsist!");
});

test('svg font is in ./build/fonts', t => {
  t.truthy(fs.existsSync("./build/fonts/feathericon.svg"), "feathericon.svg does not exsist!");
});

test('ttf is in ./build/fonts', t => {
  t.truthy(fs.existsSync("./build/fonts/feathericon.ttf"), "feathericon.ttf does not exsist!");
});

test('woff is in ./build/fonts', t => {
  t.truthy(fs.existsSync("./build/fonts/feathericon.woff"), "feathericon.woff does not exsist!");
});

test('woff2 is in ./build/fonts', t => {
  t.truthy(fs.existsSync("./build/fonts/feathericon.woff2"), "feathericon.woff2 does not exsist!");
});
