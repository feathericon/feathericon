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
  // dir
  'root'        : './',
  'build'       : 'build/',
  'docs'        : 'docs/',
  // sketch
  'sketch'      : 'src/*.sketch',
  //svg
  'srcSvg'      : 'src/svg/',
  'destSvg'     : 'build/svg/',
  // templates
  'templates'   : 'src/templates/',
  // fonts
  'destFonts'   : 'build/fonts/',
  // scss
  'destScss'    : 'build/scss/',
  'srcScss'     : 'src/scss/',
  // css
  'destCss'     : 'build/css/',
  // jade
  'srcJade'     : 'src/jade/'
};

//---------------------------------------------------------------------------
// Delete
//---------------------------------------------------------------------------
gulp.task('clean', del.bind(null, [
  paths.srcSvg     + '*.svg',
  paths.destSvg    + '*.svg',
  paths.destFonts  + '*.*',
  paths.destScss   + '*.scss',
  paths.destCss    + '*.css',
  paths.srcJade    + 'imc/modules/*.jade',
  paths.docs       + 'fonts/*.*',
]));

//---------------------------------------------------------------------------
// Export artboards in Sketch to svg icons
//---------------------------------------------------------------------------
gulp.task('export:svg', function(){
  return gulp.src(paths.sketch)
    .pipe($.sketch({
      export: 'artboards',
      formats: 'svg',
      compact: true
    }))
    .pipe(gulp.dest(paths.srcSvg));
});

//---------------------------------------------------------------------------
// Create icon fonts and stylesheets
//---------------------------------------------------------------------------

//create icons
gulp.task('create:icons', function() {
  return gulp.src(paths.srcSvg + '*.svg')
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
        .pipe(gulp.dest(paths.destCss))
      gulp.src(paths.templates + '*.scss')
        .pipe($.consolidate('lodash', options))
        .pipe(gulp.dest(paths.destScss))
      gulp.src(paths.templates + '*.jade')
        .pipe($.consolidate('lodash', options))
        .pipe(gulp.dest(paths.srcJade + 'inc/modules/'))
    })
    .pipe(gulp.dest(paths.docs + 'fonts/'))
    .pipe(gulp.dest(paths.destFonts));
});

function mapGlyphs(glyph) {
  return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) }
}

// minify css file
gulp.task('minify:css', function() {
  gulp.src(paths.destCss + '*.css')
    .pipe($.cleanCss())
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.destCss))
    .pipe(gulp.dest(paths.docs + 'css/'));
});

//---------------------------------------------------------------------------
// Generate sprite svg file
//---------------------------------------------------------------------------
gulp.task('sprite:svg', function() {
  return gulp.src(paths.srcSvg + '*.svg')
    .pipe($.svgSprite({
      dest: './',
      mode: { symbol: { dest: './' } }
    }))
    .pipe($.rename({
      basename: 'feathericon',
      dirname: './',
      prefix: 'sprite' + '.'
    }))
    .pipe(gulp.dest(paths.destSvg));
});

//---------------------------------------------------------------------------
// BrowserSync
//---------------------------------------------------------------------------
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: paths.docs
    }
  });
});

gulp.task('bs:reload', function() {
  browserSync.reload()
});

//---------------------------------------------------------------------------
// Jade Tasks
//---------------------------------------------------------------------------
gulp.task('jade', function() {
  return gulp.src(paths.srcJade + '*.jade')
    .pipe($.data(function(file) {
      return require('./setting.json');
    }))
    .pipe($.plumber())
    .pipe($.jade({ pretty: true }))
    .pipe(gulp.dest(paths.docs))
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
    .pipe(gulp.dest(paths.docs + 'css/'))
    .pipe(browserSync.reload({ stream: true }));
});


//---------------------------------------------------------------------------
// Gulp Tasks
//---------------------------------------------------------------------------
gulp.task('watch', function() {
  gulp.watch([paths.srcSvg],                  ['sprite:svg']);
  gulp.watch([paths.docs     + '*.html'],     ['bs:reload']);
  gulp.watch([paths.srcJade  + '**/*.jade'],  ['jade']);
  gulp.watch([paths.srcScss  + '**/*.scss'],  ['sass']);
});

gulp.task('webfont',function() {
  rs(
    'clean',
    'export:svg',
    'create:icons',
    'minify:css',
    'sprite:svg'
  );
});

gulp.task('server', [
  'browserSync',
  'bs:reload',
  'jade',
  'sass',
  'watch'
]);


