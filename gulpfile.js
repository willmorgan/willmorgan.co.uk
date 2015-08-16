/* global require */
var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var autoprefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlreplace = require('gulp-html-replace');

gulp.task('styles', function() {
	gulp.src(
		[
			'./www/css/normalize.css',
			'./www/css/all.css',
			'./www/css/devicons.css',
			'./www/css/stripes.css',
			'./www/css/spinner.css'
		]
	)
	.pipe(autoprefix({
		browsers: [
			'last 3 versions',
			'last 3 android versions',
			'last 3 ios_saf versions',
			'last 3 and_chr versions',
			'last 3 and_ff versions',
		]
	}))
	.pipe(concat('css/_combined.css'))
	.pipe(minifyCSS())
	.pipe(gulp.dest('www/dist'));
});

gulp.task('scripts', function() {
	gulp.src(
		[
			'./www/js/blazy.min.js',
			'./www/js/fastclick-1.0.3.js',
			'./www/js/main.js'
		]
	)
	.pipe(concat('js/_combined.js'))
	.pipe(uglify())
	.pipe(gulp.dest('www/dist'));
});

gulp.task('html', function() {
    var git = require('git-rev');
    git.short(function(hash) {
        gulp.src(
            [
                './www/*.html'
            ]
        )
        .pipe(htmlreplace({
                css: 'css/_combined-'+hash+'.css',
                js: 'js/_combined-'+hash+'.js'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyJS: true,
            minifyCSS: true,
            removeComments: true
        }))
        .pipe(gulp.dest('www/dist'));
    });
});

gulp.task('default', ['styles', 'scripts']);

gulp.task('build', ['styles', 'scripts', 'html']);

gulp.task('watch', function() {
	gulp.watch(['./www/css/all.css', './www/css/stripes.css'], ['styles']);
	gulp.watch('./www/js/main.js', ['scripts']);
});
