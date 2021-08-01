const { src, dest } = require('gulp');
const uglify = require('gulp-uglify');

exports.minify = function() {
    return src('dist/*.js')
        .pipe(uglify())
        .pipe(dest('dist'));
}