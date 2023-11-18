const gulp = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const server = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css")
const avif = require('gulp-avif')
const webp = require('gulp-webp')
const imagemin = require('gulp-imagemin')
const cached = require('gulp-cached')
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const gulpIf = require('gulp-if');

const images = () => {
    return gulp.src(['source/img/*.*', '!source/img/*.svg'])
        .pipe(gulpIf(['!source/img/*.svg', '!source/img/*.svg'], avif({ quality: 50 })))
        .pipe(gulpIf('!source/img/*.svg', webp()))
        .pipe(gulpIf('!source/img/*.svg', imagemin()))
        .pipe(gulp.dest('source/img/dist'));
}
const style = () => {
    return gulp.src("source/sass/style.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([autoprefixer()]))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("source/css"))
        .pipe(server.stream())
}

const scripts = () => {
    return gulp.src("source/js/main.js")
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest('source/js'))
        .pipe(server.stream());
}


const serve = () => {
    server.init({
        server: './source', notify: false, open: true, cors: true, ui: false
    });

    gulp.watch("source/sass/**/*.{scss,sass}", style);
    gulp.watch("source/js/main.js", scripts);
    gulp.watch("source/*.html").on("change", server.reload);
}

exports.style = style;
exports.serve = serve;
exports.images = images;
exports.scripts = scripts;

