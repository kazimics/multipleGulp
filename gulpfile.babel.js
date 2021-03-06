const gulp = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const connect = require('gulp-connect')
const del = require('del')

// 编写第一个任务
/* 
    第一个参数：任务名  自定义
    第二个参数： 回调函数，任务执行的功能
*/

/* 
    src() 找到源文件路径
    dest()  找到目的文件的路径
    pipe()  程序运行管道
*/

// 整理 HTML 文件 
gulp.task('html', async () => {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist/'))
    .pipe(connect.reload())
})

// pug 模板语法
gulp.task('pug', async () => {
  const pug = require('gulp-pug')
  return gulp.src('src/*.pug')
    .pipe(pug({
      // Your options in here.
      pretty: true,
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(connect.reload())
})

// 整理 CSS 文件 
gulp.task('css', async () => {
  const postcss = require('gulp-postcss')
  const precss = require('precss')
  const autoprefixer = require('autoprefixer')
  const purgecss = require('gulp-purgecss')

  return gulp.src('src/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(
      postcss([
        precss({ browsers: '> 1%' }),
        autoprefixer()
      ]))
    // 剔除未使用到的 css
    .pipe(purgecss({
      content: ['dist/*.html']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload())
})

// css 库直接移动位置
gulp.task('csslib', async () => {
  return gulp.src('src/csslib/*.css')
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload())
})


// 整理 js 文件 
gulp.task('js', async () => {

  const babel = require('gulp-babel')

  return gulp.src('src/js/*.js')
    // 编译 es6
    .pipe(babel({
      presets: ["@babel/preset-env"]
    }))
    .pipe(gulp.dest('dist/js'))
    .pipe(connect.reload())
})

gulp.task('ts', async () => {

  const babel = require('gulp-babel')
  const ts = require("gulp-typescript");
  const tsProject = ts.createProject("tsconfig.json");

  return gulp.src('src/js/*.ts')
    .pipe(tsProject())
    // 编译 es6
    .pipe(babel({
      presets: ["@babel/preset-env"]
    }))
    .pipe(gulp.dest('dist/js'))
    .pipe(connect.reload())
})

// js 库直接移动位置
gulp.task('jslib', async () => {
  return gulp.src('src/jslib/*.js')
    .pipe(gulp.dest('dist/js'))
    .pipe(connect.reload())
})

// 整理 Images
gulp.task('images', async () => {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest('dist/images/'))
    .pipe(connect.reload())
})

// 整理 Data
gulp.task('data', async () => {
  return gulp.src('src/data/**/*')
    .pipe(gulp.dest('dist/data/'))
    .pipe(connect.reload())
})

// 整理 fonts
gulp.task('fonts', async () => {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts/'))
    .pipe(connect.reload())
})

// clean dist
gulp.task('cleanDist', () => {
  return del('dist/')
})

// 监听
gulp.task('watch', async () => {
  /* 
    第一个参数： 文件监听的路径
    第二个参数： 去执行的任务
  */
  gulp.watch('src/*.html', { events: ['all'] }, gulp.series('html'))
  gulp.watch('src/css/*.css', { events: ['all'] }, gulp.series('css'))
  gulp.watch('src/js/*.js', { events: ['all'] }, gulp.series('js'))
  gulp.watch('src/js/*.ts', { events: ['all'] }, gulp.series('ts'))
  gulp.watch('src/jslib/*.js', { events: ['all'] }, gulp.series('jslib'))
  gulp.watch('src/images/**/*', { events: ['all'] }, gulp.series('images'))
  gulp.watch('src/data/**/*', { events: ['all'] }, gulp.series('data'))
  gulp.watch('src/fonts/**/*', { events: ['all'] }, gulp.series('fonts'))
  gulp.watch('src/**/*.pug', { events: ['all'] }, gulp.series('pug'))
  gulp.watch('src/csslib/*.css', { events: ['all'] }, gulp.series('csslib'))
})

// 启动服务器
gulp.task('server', async () => {
  connect.server({
    root: 'dist',
    port: 8888,
    livereload: true  //  热更新
  })
})

// 同时启动监听和服务器
gulp.task('default',
  gulp.series('cleanDist', gulp.parallel(['html', 'pug', 'css', 'csslib', 'js', 'ts', 'jslib', 'images', 'data', 'fonts', 'watch', 'server']))
)