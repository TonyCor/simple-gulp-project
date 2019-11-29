/***
 * Author : Anthony Corriveau
 * Version : 1.0
 * Gulp Version : 4.0
 * Note :
 *  ...
 *
 * Usage :
 * 		cmd    		< optional >
 * 		----------------------------------
 * 		gulp 		< --env production/development >
 * 		gulp watch  < --env production/development >
 * 		gulp sass 	< --env production/development >
 * 		gulp js 	< --env production/development >
 * 		gulp clean
 *
 * @type {Gulp}
 */

// Depedencies instances
var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer'),
    csslint = require('gulp-csslint'),
    cssnano = require('cssnano'),
    uglify = require('gulp-uglify'),
    environments = require('gulp-environments'),
    postcss = require('gulp-postcss'),
    del = require('del');

// Paths vars
var pathBowerLibs = './bower_components',
    pathNodeLibs =  './node_modules',
    pathAssets  =   './assets',
    pathSrcBase =   './src',
    pathSrcSASS =   './src/sass',
    pathSrcJS =     './src/js',
    pathDestBase =  './assets/generated',
    pathDestCSS =   './assets/generated/css',
    pathDestLibsJS = './assets/libs/js',
    pathDestJS =    './assets/generated/js';

// Gulpfile
var jsSources = ['scripts/*.js'],
    sassSources = ['styles/*.scss'],
    htmlSources = ['**/*.html'],
    outputDir = 'assets';


// Environment vars
var development = environments.development;
var production = environments.production;

if(!environments.current()){ environments.current(production); }

// Files to concat
var files = {
    scripts: {
        loose: [
            /*pathBowerLibs + '/slick-carousel/slick/slick.js',
            pathBowerLibs + '/matchHeight/jquery.matchHeight.js',
            pathBowerLibs+'/aos/dist/aos.js'*/
        ],
        bundled: [
            pathSrcJS + '/main.js'
        ]
    },
    sass: [
        pathBowerLibs+'/slick-carousel/slick/slick-theme.css',
        pathBowerLibs+'/slick-carousel/slick/slick.css',
        pathNodeLibs+'/bootstrap-4-grid/css/grid.css',
        pathSrcSASS+'/main.scss',
    ]
};

// Autoprefixer browser support options
var autoprefixerOptions = {
    grid: true
};

// Trigger OS error toast. (Windows + OSx)
var onError = function (err) {
    notify.onError({
        title   : 'Gulp',
        subtitle: 'Failure!',
        message : 'Error: <%= error.message %>',
        sound   : 'Beep'
    })(err);

    this.emit('end');
};

// Build Sass files and autoprefix theme
function sassFiles(cb) {
    return gulp.src(files.sass)
        .pipe(plumber({errorHandler: onError})) // fix issue with Node Streams piping.
        .pipe(development(sourcemaps.init())) //init maps
        .pipe(sass({errLogToConsole:true}).on('error', sass.logError)) // Transpile Sass into Css
        .pipe(csslint()) //css linting
        .pipe(concat('theme.css')) // merge files
        .pipe(development(postcss([autoprefixer(autoprefixerOptions)])))
        .pipe(production(postcss([autoprefixer(autoprefixerOptions), cssnano()])))
        .pipe(development(sourcemaps.write('.'))) // Create sourcemaps
        .pipe(gulp.dest(pathDestCSS))
    cb();
}

// Concat and uglify scripts
function scriptsFiles(cb) {
    return gulp.src(files.scripts.bundled)
        .pipe(plumber({errorHandler: onError})) // fix issue with Node Streams piping.
        .pipe(development(sourcemaps.init())) //init maps
        .pipe(concat('theme.js')) // merge files
        .pipe(production(uglify())) //Minify javascript
        .pipe(development(sourcemaps.write('.'))) // Create sourcemaps
        .pipe(gulp.dest(pathDestJS)) // Place generated file into the right directory
    cb();
}

// Move all javascripts libs specified into project files to be used by requirejs
function scriptsFilesLoose(cb) {
    return gulp.src(files.scripts.loose)
        .pipe(plumber({errorHandler: onError}))
        .pipe(gulp.dest(pathDestLibsJS))
    cb();
}


//Clean generated folder
function clean() {
    return del([pathDestBase]);
}
//Files to watch
function watchFiles() {
    gulp.watch(['src/*'], gulp.parallel(sassFiles,scriptsFiles,/*scriptsFilesLoose*/));
}

// define complex tasks
const build = gulp.series(clean, gulp.parallel(sassFiles,scriptsFiles,/*scriptsFilesLoose*/));
const watch = gulp.parallel(watchFiles);

// export tasks
exports.sass = sassFiles;
exports.js = scriptsFiles;
exports.jsloose = scriptsFilesLoose;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;