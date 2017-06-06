var gulp = require('gulp');
var browserSync = require('browser-sync');
var htmlMin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var del = require('del');

gulp.task('sass', function () {
    return gulp.src('src/scss/main.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['css'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('html', function () {
    gulp.src('src/**/*.html')
        .pipe(htmlMin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('build/'))
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'build'
        },
        notify: false
    });
});

gulp.task('watch', function () {
    gulp.watch('src/scss/**', ['sass']);
});

gulp.task('clean', function () {
    del('build/**/*')
});

gulp.task('build', ['sass', 'html']);
gulp.task('start', ['clean', 'build', 'browser-sync', 'watch']);
gulp.task('default', ['start']);
