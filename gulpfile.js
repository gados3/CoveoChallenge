var gulp = require('gulp'),
    clean = require('gulp-clean'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),
    tsify = require('tsify'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    livereload = require('gulp-livereload'),
    stringify = require('stringify');

gulp.task('clean', function () {
    return gulp.src('./dist', { read: false })
        .pipe(clean());
});

gulp.task('scripts', function () {
    gulp.src('./dist/js', { read: false })
        .pipe(clean());
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/app.ts'],
        cache: {},
        packageCache: {}
    })
        .transform(stringify, {
            appliesTo: { includeExtensions: ['.html'] },
            minify: true
        })
        .plugin(tsify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("dist/js"));
});

gulp.task('copy-html', ['clean'], function () {
    return gulp.src('./src/index.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('copy-fonts', ['clean'], function () {
    return gulp.src('./lib/materialize/fonts/roboto/**/*')
        .pipe(gulp.dest('dist/fonts/roboto'));
});

gulp.task('styles', function () {
    gulp.src('./dist/css', { read: false })
        .pipe(clean());
    return gulp.src('./src/styles/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename('styles.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('assets', ['copy-html', 'copy-fonts']);
gulp.task('build', ['assets', 'scripts', 'styles']);

gulp.task('dev', ['build'], function () {
    gulp.watch(['./src/**/*.ts', './src/templates/**/*.html'], ['scripts']);
    gulp.watch(['../src/**/*.scss'], ['styles']);
});

