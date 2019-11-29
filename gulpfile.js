// Gulpfile

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    watch = require('gulp-watch'),
    cssnano = require('gulp-cssnano');
    uglify = require('gulp-uglify');
    mergestreams = require('merge-stream');
    gutil = require('gulp-util');

var jsSources = ['scripts/*.js'],
    sassSources = ['styles/*.scss'],
    htmlSources = ['**/*.html'],
    outputDir = 'assets';

    /*
gulp.task('copy', async function() {
    gulp.src('index.php').pipe(gulp.dest('assets'));
});*/

gulp.task('log', async function() {
    gutil.log('== My Log Task ==')
});

// Autoprefixer browser support options
var autoprefixerOptions = {
    browsers: ['last 8 versions', '> 1%', 'IE 10'],
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

gulp.task('sass', async function() {
    gulp.src(sassSources)
        .pipe(plumber({errorHandler: onError}))
        .pipe(sass({style: 'expanded'}))
        .pipe(sass({errLogToConsole:true}).on('error', sass.logError)) // Transpile Sass into Css
       /* .pipe(concat('theme.css')) */// merge files
        .pipe(autoprefixer()) //vendors autoprefix
       /* .pipe(cssnano())*/ //minify
        .pipe(gulp.dest(outputDir))
    /*
        .pipe(plumber({errorHandler: onError})) // fix issue with Node Streams piping.
        .pipe(development(sourcemaps.init())) //init maps
        //.pipe(development(scsslint())) //css linting
        .pipe(sass({errLogToConsole:true}).on('error', sass.logError)) // Transpile Sass into Css
        .pipe(concat('theme.css')) // merge files
        .pipe(autoprefixer(autoprefixerOptions)) //vendors autoprefix
        .pipe(production(cssnano())) //minify
        .pipe(development(sourcemaps.write('.'))) // Create sourcemaps
        .pipe(gulp.dest(pathDestCSS)); // Place generated file into the right directory
 */


});

gulp.task('js', async function() {
    gulp.src(jsSources)
        .pipe(uglify())
        .pipe(concat('script.js'))
        .pipe(gulp.dest(outputDir))

    /*
        	// Bundle all specified files into a merged an uglified one.
	var bundledScripts = gulp.src(files.scripts.bundled) // gather sources
		.pipe(plumber({errorHandler: onError})) // fix issue with Node Streams piping.
		.pipe(development(sourcemaps.init())) //init maps
		.pipe(concat('theme.js')) // merge files
		.pipe(production(uglify())) //Minify javascript
		.pipe(development(sourcemaps.write('.'))) // Create sourcemaps
		.pipe(gulp.dest(pathDestJS)); // Place generated file into the right directory

	// Move all javascripts libs specified into project files to be used by requirejs
	var looseScripts = gulp.src(files.scripts.loose)
		.pipe(plumber({errorHandler: onError}))
		.pipe(gulp.dest(pathDestLibsJS));

	return mergestreams(bundledScripts,looseScripts);
   */
});

gulp.task('watch', function() {
   // gulp.watch(sassSources, ['sass']);
    gulp.watch(['styles/*','scripts/*'], gulp.series('sass',"js"));
});