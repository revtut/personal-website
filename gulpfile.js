var gulp = require('gulp');
var browserSync = require('browser-sync');
var htmlMin = require('gulp-htmlmin');
var minify = require('gulp-minify');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var del = require('del');
var concat = require('gulp-concat');
var streamQueue = require('streamqueue');

var buildPath = "build/";

gulp.task('clean', function () {
    return del('build/**/*')
});

gulp.task('default', ['start']);

/**
 * Development
 */
gulp.task('sass', function () {
    return gulp.src('src/scss/main.scss')
        .pipe(sass({
            includePaths: ['css'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(gulp.dest(buildPath + 'css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('js', function () {
    return streamQueue({objectMode: true},
        gulp.src('src/vendor/js/jquery-3.2.1.js'),
        gulp.src('src/vendor/js/bootstrap-3.3.7.js'),
        gulp.src('src/vendor/js/recaptcha.js'),
        gulp.src('src/js/**/*.js'))
        .pipe(concat('script.js'))
        .pipe(gulp.dest(buildPath + 'js'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('html', function () {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest(buildPath))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: buildPath
        },
        notify: false
    });
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/js/*.js', ['javascript']);
});

gulp.task('build', ['clean', 'sass', 'js', 'html']);
gulp.task('start', ['build', 'browser-sync', 'watch']);

/**
 * Production
 */
gulp.task('sass-prod', function () {
    return gulp.src('src/scss/main.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['css'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(gulp.dest(buildPath + 'css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('js-prod', function () {
    return streamQueue({objectMode: true},
        gulp.src('src/vendor/js/jquery-3.2.1.js'),
        gulp.src('src/vendor/js/bootstrap-3.3.7.js'),
        gulp.src('src/vendor/js/recaptcha.js'),
        gulp.src('src/js/**/*.js'))
        .pipe(concat('script.js'))
        .pipe(minify({
            ext: {
                min: '.js'
            },
            noSource: ['script.js']
        }))
        .pipe(gulp.dest(buildPath + 'js'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('html-prod', function () {
    return gulp.src('src/**/*.html')
        .pipe(htmlMin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(buildPath))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('build-prod', ['clean', 'sass-prod', 'js-prod', 'html-prod']);