const gulp = require("gulp");
const browserSync = require("browser-sync");
const htmlMin = require("gulp-htmlmin");
const minify = require("gulp-minify");
const sass = require("gulp-sass");
const prefix = require("gulp-autoprefixer");
const del = require("del");
const concat = require("gulp-concat");
const data = require("gulp-data");
const nunjucks = require("gulp-nunjucks-render");

const distPath = "dist/";

// De-caching for Data files
function requireUncached($module) {
    delete require.cache[require.resolve($module)];
    return require($module);
}

function clean() {
    return del([distPath + "**/*"])
}

function copyStaticFiles() {
    return gulp.src([
        "src/robots.txt",
        "src/sitemap.xml",
        "src/_redirects",
        "src/vendor/**"],
        {
            base: "src"
        })
        .pipe(gulp.dest(distPath))
}

/**
 * Development
 */
function compileSass() {
    return gulp.src("src/sass/*", { base: "src/sass" })
        .pipe(sass({
            includePaths: ["css"],
            onError: browserSync.notify
        }))
        .pipe(prefix(["last 15 versions", "> 1%", "ie 8", "ie 7"], { cascade: true }))
        .pipe(gulp.dest(distPath + "css"))
        .pipe(browserSync.reload({ stream: true }))
}

function compileJS() {
    return gulp.src("src/js/**/*.js", { base: "src" })
        .pipe(concat("script.js"))
        .pipe(gulp.dest(distPath + "js"))
        .pipe(browserSync.reload({ stream: true }))
}

function compileHTML() {
    return gulp.src("src/pages/**/*.nj", { base: "src/pages" })
        .pipe(data(function () {
            const result = {
                settings: requireUncached("./src/settings.json"),
                about: requireUncached("./src/data/about.json"),
                timeline: requireUncached("./src/data/timeline.json"),
                skills: requireUncached("./src/data/skills.json"),
                portfolio: requireUncached("./src/data/portfolio.json"),
                worldMap: requireUncached("./src/data/worldMap.json")
            };

            return result
        }))
        .pipe(nunjucks({
            path: ["src/html"]
        }))
        .pipe(gulp.dest(distPath))
        .pipe(browserSync.reload({ stream: true }))
}

function liveReload(done) {
    browserSync({
        server: {
            baseDir: distPath
        },
        notify: false
    });
    done()
}

function watchChanges() {
    gulp.watch(["src/**/*.html", "src/**/*.nj", "src/**/*.json"], gulp.series(compileHTML));
    gulp.watch("src/**/*.scss", gulp.series(compileSass));
    gulp.watch("src/**/*.js", gulp.series(compileJS));
}

/**
 * Production
 */
function compileSassProd() {
    return gulp.src("src/sass/*", { base: "src/sass" })
        .pipe(sass({
            outputStyle: "compressed",
            includePaths: ["css"],
            onError: browserSync.notify
        }))
        .pipe(prefix(["last 15 versions", "> 1%", "ie 8", "ie 7"], { cascade: true }))
        .pipe(gulp.dest(distPath + "css"))
}

function compileJSProd() {    
    return gulp.src("src/js/**/*.js", { base: "src" })
        .pipe(concat("script.js"))
        .pipe(minify({
            ext: {
                min: ".js"
            },
            noSource: ["script.js"]
        }))
        .pipe(gulp.dest(distPath + "js"))
}

function compileHTMLProd() {
    return gulp.src("src/pages/**/*.nj", { base: "src/pages" })
        .pipe(data(function () {
            const result = {
                settings: requireUncached("./src/settings.json"),
                about: requireUncached("./src/data/about.json"),
                timeline: requireUncached("./src/data/timeline.json"),
                skills: requireUncached("./src/data/skills.json"),
                portfolio: requireUncached("./src/data/portfolio.json"),
                worldMap: requireUncached("./src/data/worldMap.json")
            };

            return result
        }))
        .pipe(nunjucks({
            path: ["src/html"]
        }))
        .pipe(htmlMin({
            collapseWhitespace: true,
            collapseInlineTagWhitespace: true,
            minifyJS: true,
            removeComments: true,
            sortClassName: true,
            sortAttributes: true
        }))
        .pipe(gulp.dest(distPath))
}

const build = gulp.series(clean, gulp.parallel(compileSass, compileJS, compileHTML, copyStaticFiles))
const buildProd = gulp.series(clean, gulp.parallel(compileSassProd, compileJSProd, compileHTMLProd, copyStaticFiles))
const start = gulp.series(build, liveReload, watchChanges)

exports.clean = clean
exports.build = build
exports.buildProd = buildProd
exports.start = start
exports.default = start;
