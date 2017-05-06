'use strict';

//---------------------------------------------------------------------------
// Dependences
//---------------------------------------------------------------------------
import paths from './gulp/config';

import gulp from 'gulp';
import rs from 'run-sequence';

import sketch from 'gulp-sketch';
import rename from 'gulp-rename';
import svgSprite from 'gulp-svg-sprite';
import replace from 'gulp-string-replace';
import inject from 'gulp-inject';

import del from 'del';

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

//---------------------------------------------------------------------------
// Inject inline SVG
//---------------------------------------------------------------------------
gulp.task('inject',() => {
  return gulp.src('./build/index.html')
    .pipe(inject(gulp.src(['./build/svg/sprite/sprite.feathericon.svg']), {
      starttag: '<!-- inject:body:{{ext}} -->',
      transform: function (filePath, file) {
        // return file contents as string
        return file.contents.toString();
      }
    }))
    .pipe(gulp.dest('./build'));
});

//---------------------------------------------------------------------------
// Gulp Tasks
//---------------------------------------------------------------------------
gulp.task('build', () => {
  rs('export:svg', 'sprite:svg');
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
