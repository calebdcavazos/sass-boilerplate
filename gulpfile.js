// Initialize Modules
const { src, dest, watch, series, parallel} = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');


// File path Variables
const files = {
    scssPath: 'app/scss/**/*.scss',
    jsPath: 'app/js/**/*.js',
    htmlPath: '*.html'
}

// Html Task
function htmlTask(cb) {
    browserSync.reload();
    cb();
}

// Sass Task
function scssTask(cb) {
    src(files.scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist'));
    browserSync.reload();
    cb();
}

// JS Task
function jsTask(cb) {
    src(files.jsPath)
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(dest('dist'));
    browserSync.reload();
    cb();
}

// Cachebusting Task
const cbString = new Date().getTime();
function cacheBustTask(cb) {
    src(['index.html'])
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(dest('.'));
    cb();
}

// Watch Tasks
function watchHtml() {
    watch(files.htmlPath, htmlTask);
}

function watchScss() {
    watch(files.scssPath, scssTask);
}

function watchJs() {
    watch(files.jsPath, jsTask);
}

// BrowserSync
function browserSyncStart(cb) {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    cb();
}



// Default Task
exports.default = series(
    parallel(scssTask, jsTask),
    cacheBustTask,
    browserSyncStart,
    parallel(watchHtml, watchJs, watchScss)
);


