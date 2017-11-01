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
    stringify = require('stringify'),
    htmlReplace = require('gulp-html-replace');

gulp.task('clean', function () {
    return gulp.src('./dist', { read: false })
        .pipe(clean());
});

gulp.task('scripts', function () {
    gulp.src('./dist/js', { read: false })
        .pipe(clean());
    return browserify({
        basedir: './',
        debug: true,
        entries: ['./src/app.ts'],
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
    return gulp.src('./lib/materialize-src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('copy-libs', ['clean'], function () {
    return gulp.src(['./lib/jquery.min.js', './lib/materialize-src/js/bin/materialize.min.js'])
        .pipe(gulp.dest('dist/lib/js'));
})

gulp.task('copy-images', ['clean'], function () {
    return gulp.src(['./assets/img/**/*.png', './assets/img/**/*.jpg'])
        .pipe(gulp.dest('dist/img'));
});

gulp.task('styles', function () {
    gulp.src('./dist/css', { read: false })
        .pipe(clean());
    return gulp.src('./src/styles/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename('styles.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('assets', ['copy-html', 'copy-fonts', 'copy-libs', 'copy-images']);
gulp.task('build-dev', ['assets', 'scripts', 'styles']);

gulp.task('dev', ['scripts', 'styles'], function () {
    gulp.watch(['./src/**/*.ts', './src/templates/**/*.html'], ['scripts']);
    gulp.watch(['./src/**/*.scss'], ['styles']);
});

gulp.task('build-prod', function () {
    gulp.src('./src/templates/**/*.html')
        .pipe(htmlReplace({
            'keepInDev': {
                src: '',
                tpl: '%s'
            }
        }, {
                keepUnassigned: true,
                keepBlockTags: false,
                resolvePaths: false
            }))
        .pipe(gulp.dest('release/test'));
});

