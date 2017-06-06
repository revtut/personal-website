var gulp = require('gulp');
var browserSync = require('browser-sync');
var htmlMin = require('gulp-htmlmin');
var minify = require('gulp-minify');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var del = require('del');
var concat = require('gulp-concat');

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

gulp.task('javascript', function () {
    return gulp.src('src/**/*.js')
        .pipe(concat('script.js'))
        .pipe(minify({
            ext:{
                min:'.js'
            },
            noSource: ['script.js']
        }))
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('html', function () {
    return gulp.src('src/**/*.html')
        .pipe(htmlMin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('build/'))
        .pipe(browserSync.reload({stream: true}))
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
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/js/*.js', ['javascript']);
});

gulp.task('clean', function () {
    return del('build/**/*')
});

gulp.task('build', ['sass', 'javascript', 'html']);
gulp.task('start', ['clean', 'build', 'browser-sync', 'watch']);
gulp.task('default', ['start']);
