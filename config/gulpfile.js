const postcss = require('gulp-postcss');
const gulp = require('gulp');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const postcssColorMod = require('postcss-color-mod-function');
const cleaner = require('gulp-clean');

const sources = [
  '../node_modules/@innovaccer/design-system/css/src/tokens/*.css',
  '../node_modules/@innovaccer/design-system/css/src/variables/*.css',
  '../node_modules/@innovaccer/design-system/css/src/core/typography.css',
];

function clean() {
  return gulp.src('../public/*', { allowEmpty: true }).pipe(cleaner());
}

function css() {
  return gulp
    .src(sources)
    .pipe(concat('design-system.css'))
    .pipe(sourcemaps.init())
    .pipe(postcss([postcssColorMod()]))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('../public'));
}

function font() {
  return gulp.src(materialFont).pipe(gulp.dest('../public'));
}

exports.build = gulp.series(clean, gulp.parallel(css));

exports.clean = clean;

gulp.task('watch', () => {
  gulp.watch(sources, gulp.series(css));
});
