var gulp = require('gulp');
var browserSync = require('browser-sync');
var htmlMin = require('gulp-htmlmin');
var minify = require('gulp-minify');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var del = require('del');
var concat = require('gulp-concat');
var data = require('gulp-data');
var nunjucks = require('gulp-nunjucks-render');

var distPath = "dist/";

gulp.task('clean', function () {
    return del(distPath + '**')
});

gulp.task('other-files', function () {
    gulp.src([
            'src/robots.txt',
            'src/sitemap.xml',
            'src/vendor/**'],
        {
            base: 'src'
        }).pipe(gulp.dest(distPath));

    return gulp.src(['assets/**'], {
        base: 'assets'
    }).pipe(gulp.dest(distPath + 'assets'))
});

gulp.task('default', ['start']);

/**
 * Development
 */
gulp.task('sass', function () {
    return gulp.src('src/scss/main.scss', {base: 'src/scss'})
        .pipe(sass({
            includePaths: ['css'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(gulp.dest(distPath + 'css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('js', function () {
    return gulp.src('src/js/**/*.js', {base: 'src'})
        .pipe(concat('script.js'))
        .pipe(gulp.dest(distPath + 'js'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('html', function () {
    return gulp.src('src/pages/**/*.nj', {base: 'src/pages'})
        .pipe(data(function () {
            const result = {
                settings: require('./src/settings.json'),
                about: require('./src/data/about.json'),
                timeline: require('./src/data/timeline.json'),
                skills: require('./src/data/skills.json'),
                portfolio: require('./src/data/portfolio.json')
            };

            return result
        }))
        .pipe(nunjucks({
            path: ['src/templates']
        }))
        .pipe(gulp.dest(distPath))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: distPath
        },
        notify: false
    });
});

gulp.task('watch', function () {
    gulp.watch(['src/**/*.html', 'src/**/*.nj', 'src/**/*.json'], ['html']);
    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/js/*.js', ['javascript']);
});

gulp.task('build', ['clean', 'sass', 'js', 'html', 'other-files']);
gulp.task('start', ['build', 'browser-sync', 'watch']);

/**
 * Production
 */
gulp.task('sass-prod', function () {
    return gulp.src('src/scss/main.scss', {base: 'src/scss'})
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['css'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(gulp.dest(distPath + 'css'))
});

gulp.task('js-prod', function () {
    return gulp.src('src/js/**/*.js', {base: 'src'})
        .pipe(concat('script.js'))
        .pipe(minify({
            ext: {
                min: '.js'
            },
            noSource: ['script.js']
        }))
        .pipe(gulp.dest(distPath + 'js'))
});

gulp.task('html-prod', function () {
    return gulp.src('src/pages/**/*.nj', {base: 'src/pages'})
        .pipe(nunjucks({
            path: ['src/templates']
        }))
        .pipe(htmlMin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(distPath))
});

gulp.task('build-prod', ['clean', 'sass-prod', 'js-prod', 'html-prod', 'other-files']);
