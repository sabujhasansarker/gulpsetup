const { src, dest, series, watch } = require("gulp"),
  fileinclude = require("gulp-file-include"),
  sass = require("gulp-sass"),
  minify = require("gulp-minifier"),
  imagemin = require("gulp-imagemin"),
  browserSync = require("browser-sync");

// dist
const htmlDist = () => {
  return src("./src/html/*.html")
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(dest("./dist/"));
};
const scssDist = () => {
  return src("./src/scss/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("./dist/css"));
};
const jsDist = () => {
  return src("./src/**/*.js").pipe(dest("./dist/"));
};
const vendorDist = () => {
  return src("./src/vendor/**").pipe(dest("./dist/vendor"));
};
const iconsDist = () => {
  return src("./src/icons/**").pipe(dest("./dist/icons"));
};
const imageDist = () => {
  return src("./src/images/**").pipe(dest("./dist/images"));
};
exports.dist = series(
  htmlDist,
  scssDist,
  jsDist,
  imageDist,
  vendorDist,
  iconsDist
);

// minify
exports.minify = () => {
  return src("./dist/**/*")
    .pipe(
      minify({
        minify: true,
        minifyHTML: {
          collapseWhitespace: true,
          conservativeCollapse: true,
        },
        minifyJS: {
          sourceMap: true,
        },
        minifyCSS: true,
      })
    )
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 50, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest("./build"));
  // src("./dist/images/*").pipe(imagemin()).pipe(dest("bulid/images"));
};

// watch
exports.watchfile = () => {
  browserSync.init({
    server: {
      baseDir: "dist/",
      index: "/index.html",
    },
  });
  watch("src/scss/**/*.scss", scssDist);
  watch("src/**/*.html").on("change", htmlDist);
  watch("dist/js/**/*.js").on("change", browserSync.reload);
};
