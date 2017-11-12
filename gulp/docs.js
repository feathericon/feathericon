'use strict';

//---------------------------------------------------------------------------
// Dependences
//---------------------------------------------------------------------------
import paths from './config';

import gulp from 'gulp';
import pug from 'gulp-pug';
import data from 'gulp-data';
import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import cssGlobbing from 'gulp-css-globbing';
import autoprefixer from 'gulp-autoprefixer';

import browserSync from 'browser-sync';

//---------------------------------------------------------------------------
// BrowserSync
//---------------------------------------------------------------------------
gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: paths.docs
    }
  });
});

gulp.task('bs:reload', () => {
  browserSync.reload()
});


//---------------------------------------------------------------------------
// Jade
//---------------------------------------------------------------------------
gulp.task('pug', () => {
  return gulp.src(paths.srcPug + '*.pug')
    .pipe(data(() => require('../setting.json')))
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(paths.docs))
    .pipe(browserSync.reload({ stream: true }));
});

//---------------------------------------------------------------------------
// Sass
//---------------------------------------------------------------------------
gulp.task('sass', () => {
  return gulp.src(paths.srcScss + '**/*.scss')
    .pipe(cssGlobbing({ extensions: ['.scss'] }))
    .pipe(sass({
      loadPath     : [],
      outputStyle  : 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: 'last 2 versions',
      cascade: false
    }))
    .pipe(gulp.dest(paths.docs + 'css/'))
    .pipe(browserSync.reload({ stream: true }));
});
