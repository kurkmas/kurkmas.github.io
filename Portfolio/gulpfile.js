const { src, dest, series, watch } = require('gulp');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoprefixes = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const image = require('gulp-imagemin');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const imageWebp = require('gulp-webp');
const notify = require('gulp-notify');
const browserSync = require('browser-sync').create();

const clean = () => {
  return del('dist');
};

const resources = () => {
  return src('src/resources/**')
    .pipe(dest('dist/resources'));
};

const styles = () => {
  return src('src/css/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(concat('style.min.css'))
    .pipe(autoprefixes({
      cascade: false,
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(sourcemaps.write())
    .pipe(dest('dist/styles'))
    .pipe(browserSync.stream());
};

const copyFonts = () => {
  return src([
    'src/css/fonts/**/*.woff2',
    'src/css/fonts/**/*.woff'
  ])

    .pipe(dest('dist/styles/fonts'));
};

const htmlMinify = () => {
  return src('src/**/*.html')
    .pipe(htmlMin({
      collapseWhitespace: true,
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
};

const scripts = () => {
  return src([
    'src/js/components/**/*.js',
    'src/js/main.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('app.js'))
    .pipe(uglify().on('error', notify.onError()))
    .pipe(sourcemaps.write())
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream());
};

const imageCompress = () => {
  return src([
    'src/img/**/*.jpg',
    'src/img/**/*.png',
    'src/img/*.svg',
    'src/img/**/*.jpeg'
  ])
    .pipe(image())
    .pipe(dest('dist/img'));
};

const imageTransform = () => {
  return src([
    'src/img/*.jpg',
    'src/img/*.jpeg'
  ])
    .pipe(imageWebp())
    .pipe(dest('dist/img'));
};

const copySvg = () => {
  return src('src/img/svg/*.svg')
    .pipe(dest('dist/img/svg'));
};

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
};

watch('src/**/*.html', htmlMinify);
watch('src/css/**/*.css', styles);
watch('src/js/**/*.js', scripts);
watch('src/resources/**', resources);


exports.scripts = scripts;
exports.clean = clean;
exports.imageTransform = imageTransform;
exports.default = series(clean, resources, htmlMinify, styles,
  copyFonts, imageCompress, imageTransform, copySvg, scripts,
  watchFiles);

const copyFontsBuild = () => {
  return src([
    'src/css/fonts/**/*.woff2',
    'src/css/fonts/**/*.woff'
  ])

    .pipe(dest('build/styles/fonts'));
};

const buildhtmlMinify = () => {
  return src('src/**/*.html')
    .pipe(htmlMin({
      collapseWhitespace: true,
    }))
    .pipe(dest('build'));
};

const stylesBuild = () => {
  return src('src/css/**/*.css')
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(dest('build/styles'));
};

const scriptsBuild = () => {
  return src([
    'src/js/components/**/*.js',
    'src/js/main.js'
  ])
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('app.js'))
    .pipe(uglify().on('error', notify.onError()))
    .pipe(dest('build/js'));
};

const resourcesBuild = () => {
  return src('src/resources/**')
    .pipe(dest('build/resources'));
};

const buildImages = () => {
  return src([
    'dist/img/**/*.jpg',
    'dist/img/**/*.png',
    'dist/img/*.svg',
    'dist/img/**/*.jpeg',
  ])
    .pipe(dest('build/img'));
};

const imageTransformBuild = () => {
  return src([
    'src/img/*.jpg',
    'src/img/*.jpeg'
  ])
    .pipe(imageWebp())
    .pipe(dest('build/img'));
};

const copySvgBuild = () => {
  return src('src/img/svg/*.svg')
    .pipe(dest('build/img/svg'));
};

exports.build = series(copyFontsBuild, buildhtmlMinify, stylesBuild,
  scriptsBuild, resourcesBuild, buildImages, imageTransformBuild, copySvgBuild);
