'use strict';

//---------------------------------------------------------------------------
// Dependences
//---------------------------------------------------------------------------
import paths from './gulp/config';

import gulp from 'gulp';
import rs from 'run-sequence';

import './gulp/docs';
import './gulp/compile';

//---------------------------------------------------------------------------
// Gulp Tasks
//---------------------------------------------------------------------------
gulp.task('before:compile',() => {
  rs('clean', 'export:svg');
});

gulp.task('after:compile', () => {
  rs('minify:css', 'sprite:svg');
});

gulp.task('watch', () => {
  gulp.watch([paths.srcSvg],                  ['sprite:svg']);
  gulp.watch([paths.docs     + '*.html'],     ['bs:reload']);
  gulp.watch([paths.srcJade  + '**/*.jade'],  ['jade']);
  gulp.watch([paths.srcScss  + '**/*.scss'],  ['sass']);
});

gulp.task('server', [
  'browserSync',
  'bs:reload',
  'jade',
  'sass',
  'watch'
]);
