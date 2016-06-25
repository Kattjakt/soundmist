var gulp = require('gulp')
var livereload = require('gulp-livereload')
var jade = require('gulp-jade')
var sass = require('gulp-sass')

let out = '.tmp'
let structured = {
  base: '.'
}

gulp.task('vital', () => {
  gulp.src('package.json').pipe(gulp.dest(out))
})

gulp.task('jade', () => {
  gulp.src(['index.jade', 'app/**/*.jade'], structured)
    .pipe(jade())
    .pipe(gulp.dest(out))
    .pipe(livereload())
})

gulp.task('scripts', () => {
  gulp.src(['main.js', 'app/**/*.js'], structured)
    .pipe(gulp.dest(out))
    .pipe(livereload())
})

gulp.task('sass', () => {
  gulp.src(['app/**/*.sass', 'app/**/*.scss'], structured)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(out))
    .pipe(livereload())
})

gulp.task('watch', () => {
  livereload.listen()

  gulp.watch('package.json', ['vital'])
  gulp.watch(['index.jade', 'app/**/*.jade'], ['jade'])
  gulp.watch(['main.js', 'app/**/*.js'], ['scripts'])
  gulp.watch(['app/**/*.sass', 'app/**/*.scss'], ['sass'])
});

gulp.task('start', () => {
  gulp.start('vital', 'jade', 'sass', 'scripts')
})
