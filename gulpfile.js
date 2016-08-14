//---------------------------------------------------------------------------
// Dependences
//---------------------------------------------------------------------------
var gulp             = require('gulp'),
    $                = require('gulp-load-plugins')({ pattern: ['gulp-*', 'gulp.*'], replaceString: /\bgulp[\-.]/}),
    argv             = require('yargs').argv,
    browserSync      = require('browser-sync'),
    runTimestamp     = Math.round(Date.now()/1000),
    // runSequence      = require('run-sequence'),
    del              = require('del')
;

//---------------------------------------------------------------------------
// File Destinations
//---------------------------------------------------------------------------
var paths = {
  'sketch'      : 'src/*.sketch',
  'exports'     : 'src/svg/',
  'svg'         : 'src/svg/*.svg',
  'fonts'       : 'src/fonts/',
  'templates'   : 'src/templates/'
};

//---------------------------------------------------------------------------
// Export artboards in Sketch to svg icons
//---------------------------------------------------------------------------
gulp.task('export:sketch', function(){
  return gulp.src(paths.sketch)
    .pipe($.sketch({
      export: 'artboards',
      formats: 'svg',
      compact: true
    }))
    .pipe(gulp.dest(paths.exports));
});

//---------------------------------------------------------------------------
// Create icon fonts
//---------------------------------------------------------------------------
gulp.task('create:icons', function() {
  return gulp.src(paths.svg)
    .pipe($.iconfont({
      fontName: 'feathericon',
      formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
      timestamp: runTimestamp
    }))
    .on('glyphs', function(glyphs) {
      var options = {
        fontName: 'feathericon',
        className: 'fe',
        fontPath: '../fonts/',
        glyphs: glyphs.map(mapGlyphs)
      }
      gulp.src(paths.templates + 'feathericon.scss')
        .pipe($.consolidate('lodash', options))
        .pipe($.rename({ baseName: 'feathericon' }))
        .pipe(gulp.dest('build/'));
    })
    .pipe(gulp.dest(paths.fonts));
});

//---------------------------------------------------------------------------
// Gulp Tasks
//---------------------------------------------------------------------------
gulp.task('watch', function() {
  gulp.watch([paths.svg], ['create:icons']);
});

gulp.task('default', ['watch']);

function mapGlyphs(glyph) {
  return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) }
}
