//---------------------------------------------------------------------------
// Dependences
//---------------------------------------------------------------------------
var gulp             = require('gulp'),
    $                = require('gulp-load-plugins')({ pattern: ['gulp-*', 'gulp.*'], replaceString: /\bgulp[\-.]/}),
    browserSync      = require('browser-sync'),
    rs               = require('run-sequence'),
    runTimestamp     = Math.round(Date.now()/1000),
    del              = require('del')
;

//---------------------------------------------------------------------------
// File Destinations
//---------------------------------------------------------------------------
var paths = {
  'sketch'      : 'src/*.sketch',
  'destSvg'     : 'src/svg/',
  'srcSvg'      : 'src/svg/*.svg',
  'templates'   : 'src/templates/',
  'destFonts'   : 'build/fonts/',
  'build'       : 'build/',
  'srcScss'     : 'src/scss/',
  'srcCss'      : 'src/css/',
  'srcHtml'     : './',
  'srcJade'     : 'src/jade/'
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
    .pipe(gulp.dest(paths.destSvg));
});

//---------------------------------------------------------------------------
// BrowserSync
//---------------------------------------------------------------------------
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: paths.srcHtml
    }
  });
});

gulp.task('bs:reload', function() {
  browserSync.reload()
});

//---------------------------------------------------------------------------
// Create icon fonts and stylesheets
//---------------------------------------------------------------------------
gulp.task('create:icons', function() {
  return gulp.src(paths.srcSvg)
    .pipe($.iconfont({
      fontName: 'feathericon',
      formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
      normalize: true,
      fontHeight: 1001,
      startUnicode: 0xf101,
      timestamp: runTimestamp
    }))
    .on('glyphs', function(glyphs) {
      var options = {
        fontName: 'feathericon',
        className: 'fe',
        fontPath: '../fonts/',
        glyphs: glyphs.map(mapGlyphs)
      }
      gulp.src(paths.templates + '*.css')
        .pipe($.consolidate('lodash', options))
        .pipe(gulp.dest(paths.build))
      gulp.src(paths.templates + '*.scss')
        .pipe($.consolidate('lodash', options))
        .pipe(gulp.dest(paths.build))
    })
    .pipe(gulp.dest(paths.destFonts))
});

function mapGlyphs(glyph) {
  return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) }
}

gulp.task('minify:css', function() {
  return gulp.src(paths.build + '*.css')
    .pipe($.cleanCss())
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.build));
});

//---------------------------------------------------------------------------
// Generate sprite svg file
//---------------------------------------------------------------------------
gulp.task('sprite:svg', function() {
  return gulp.src(paths.srcSvg)
    .pipe($.svgSprite({
      dest: './',
      mode: { symbol: { dest: './' } }
    }))
    .pipe($.rename({
      basename: 'feathericon',
      dirname: './',
      prefix: 'sprite' + '.'
    }))
    .pipe(gulp.dest(paths.build));
});

//---------------------------------------------------------------------------
// Jade Tasks
//---------------------------------------------------------------------------

gulp.task('jade', function() {
  return gulp.src(paths.srcJade + '*.jade')
    .pipe($.data(function(file) {
      return require(paths.srcJade + 'setting.json');
    }))
    .pipe($.plumber())
    .pipe($.jade({ pretty: true }))
    .pipe(gulp.dest(paths.srcHtml))
    .pipe(browserSync.reload({ stream: true }));
});

//---------------------------------------------------------------------------
// Sass Tasks
//---------------------------------------------------------------------------

gulp.task('sass', function () {
  return gulp.src(paths.srcScss + '**/*.scss')
    .pipe($.cssGlobbing({ extensions: ['.scss'] }))
    .pipe($.sass({
      loadPath     : [],
      outputStyle  : 'compressed'
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: 'last 2 versions',
      cascade: false
    }))
    .pipe(gulp.dest(paths.srcCss))
    .pipe(browserSync.reload({ stream: true }));
});


//---------------------------------------------------------------------------
// Gulp Tasks
//---------------------------------------------------------------------------

gulp.task('watch', function() {
  gulp.watch([paths.srcSvg],                  ['create:icons', 'bs:reload']);
  gulp.watch([paths.srcSvg],                  ['sprite:svg']);
  gulp.watch([paths.srcHtml  + '*.html'],     ['bs:reload']);
  gulp.watch([paths.srcJade  + '**/*.jade'],  ['jade']);
  gulp.watch([paths.srcScss  + '**/*.scss'],  ['sass']);
});

gulp.task('webfont',function() {
  rs('create:icons', 'minify:css', 'sprite:svg');
});

gulp.task('server', [
  'browserSync',
  'bs:reload',
  'jade',
  'sass',
  'watch'
]);


