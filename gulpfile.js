var gulp = require('gulp');
var util = require('gulp-util');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-clean-css');
//var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var cache = require('gulp-cache');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var cp = require('child_process');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var size = require('gulp-size');


// ...
gulp.task('clean', function () {
    log('Deleting dist folder');
    return del([
        'dist'
    ]);
});



// ...
gulp.task('styles', function () {
    gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(rename({
            suffix: '.min'
        }))
        //.pipe(minifycss())
        .pipe(gulp.dest('dist/styles'))
        .pipe(browserSync.reload({
            stream: true
        }));
});


// ...
gulp.task('scripts', function () {
    return gulp.src(['./src/scripts/**/*.js'])
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(plumber())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(browserSync.reload({
            stream: true
        }));
});


// ...
// Optimizes the images that exists
gulp.task('images', function () {
    return gulp.src('src/images/**')
        .pipe(changed('dist/images'))
        .pipe(imagemin({
            // Lossless conversion to progressive JPGs
            progressive: true,
            // Interlace GIFs for progressive rendering
            interlaced: true
        }))
        .pipe(gulp.dest('dist/images'))
        .pipe(size({
            title: 'images'
        }));
});


// ...
gulp.task('html', function () {
    gulp.src('./src/**/*.html')
        .pipe(gulp.dest('dist/'));
});


// ...
gulp.task('browser-sync', ['styles', 'scripts'], function () {
    browserSync({
        server: {
            baseDir: './dist/',
            injectChanges: true // this is new
        }
    });
});


// ...
//gulp.task('deploy', function() {
//  return gulp.src('./dist/**/*')
//    .pipe(ghPages());
//});


// ...
gulp.task('watch', function () {
    // Watch .html files
    gulp.watch('src/**/*.html', ['html', browserSync.reload]);
    gulp.watch('dist/*.html').on('change', browserSync.reload);
    // Watch .sass files
    gulp.watch('src/sass/**/*.scss', ['styles', browserSync.reload]);
    // Watch .js files
    gulp.watch('src/scripts/*.js', ['scripts', browserSync.reload]);
    // Watch image files
    gulp.watch('src/images/**/*', ['images', browserSync.reload]);
});


// ...
gulp.task('default', function () {
    gulp.start('styles', 'scripts', 'images', 'html', 'browser-sync', 'watch');
});



///////////////////////
// General functions //
///////////////////////

function log(msg) {
    if (typeof msg === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                util.log(util.colors.yellow(msg[item]));
            }
        }
    } else {
        util.log(util.colors.yellow(msg));
    }
}
