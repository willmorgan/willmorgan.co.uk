var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var autoprefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('styles', function() {
	gulp.src(
		[
			'./www/css/normalize.css',
			'./www/css/all.css',
			'./www/css/devicons.css',
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
	.pipe(concat('./www/css/_combined.css'))
	.pipe(minifyCSS())
	.pipe(gulp.dest('.'));
});

gulp.task('scripts', function() {
	gulp.src(
		[
			'./www/js/blazy.min.js',
			'./www/js/fastclick-1.0.3.js',
			'./www/js/main.js'
		]
	)
	.pipe(concat('./www/js/_combined.js'))
	.pipe(uglify())
	.pipe(gulp.dest('.'));
});

gulp.task('default', ['styles', 'scripts']);

gulp.task('watch', function() {
	gulp.watch('./www/css/all.css', ['styles']);
	gulp.watch('./www/js/main.js', ['scripts']);
});
