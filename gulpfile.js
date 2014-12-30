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
			'./www/css/devicons.css'
		]
	)
	.pipe(autoprefix({
		browsers: ['last 3 versions']
	}))
	.pipe(concat('./www/css/_combined.css'))
	.pipe(minifyCSS())
	.pipe(gulp.dest('.'));
});

gulp.task('scripts', function() {
	gulp.src('./www/js/main.js')
	.pipe(concat('./www/js/_combined.js'))
	.pipe(uglify())
	.pipe(gulp.dest('.'));
});

gulp.task('default', ['styles', 'scripts']);

gulp.task('watch', function() {
	gulp.watch('./www/css/all.css', ['combine']);
	gulp.watch('./www/js/main.js', ['scripts']);
});
