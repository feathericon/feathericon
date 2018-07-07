'use strict';

//---------------------------------------------------------------------------
// Dependences
//---------------------------------------------------------------------------
import paths from './config';

import gulp from 'gulp';
import sketch from 'gulp-sketch';
import cleanCss from 'gulp-clean-css';
import rename from 'gulp-rename';
import svgSprite from 'gulp-svg-sprite';
import replace from 'gulp-string-replace';

import del from 'del';

//---------------------------------------------------------------------------
// Delete
//---------------------------------------------------------------------------
gulp.task('clean', del.bind(null, [
  paths.srcSvg     + '*.svg',
  paths.destSvg    + '*.svg',
  paths.destFonts  + '*.*',
  paths.destScss   + '*.scss',
  paths.destCss    + '*.css',
  paths.srcPug    + 'inc/modules/_icons.pug'
]));

//---------------------------------------------------------------------------
// Export artboards in Sketch to svg icons
//---------------------------------------------------------------------------
gulp.task('export:svg', () => {
  return gulp.src(paths.sketch)
    .pipe(sketch({
      export: 'artboards',
      formats: 'svg',
      compact: true
    }))
    .pipe(gulp.dest(paths.srcSvg))
    .pipe(gulp.dest(paths.destSvg));
});

//---------------------------------------------------------------------------
// minify css file
//---------------------------------------------------------------------------
gulp.task('minify:css', () => {
  gulp.src(paths.destCss + '*.css')
    .pipe(cleanCss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.destCss))
    .pipe(gulp.dest(paths.docs + 'css/'));
});

//---------------------------------------------------------------------------
// Generate sprite svg file
//---------------------------------------------------------------------------
gulp.task('sprite:svg', () => {
  return gulp.src(paths.srcSvg + '*.svg')
    .pipe(svgSprite({
      dest: './',
      mode: { symbol: { dest: './' } }
    }))
    .pipe(rename({
      basename: 'feathericon',
      dirname: './',
      prefix: 'sprite' + '.'
    }))
    .pipe(gulp.dest(paths.srcSprite))
    .pipe(replace(new RegExp(' fill="#000"', 'g'), ''))
    .pipe(gulp.dest(paths.destSprite))
});
