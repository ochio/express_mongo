const config = require("../config");
const gulp = require("gulp");
const del = require("del");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");

gulp.task("minify-javascripts.clean", ()=>{
  return del("./javascripts/**/*", {cwd: config.path.output});
});

gulp.task("minify-javascripts", ["minify-javascripts.clean"], ()=>{
  return gulp.src("./javascripts/**/*.js", {cwd: config.path.input})
    .pipe(babel({
      "presets": ["@babel/preset-env"]
    }))
    .pipe(uglify(config.uglify))
    .pipe(gulp.dest("./javascripts", {cwd: config.path.output}));
});