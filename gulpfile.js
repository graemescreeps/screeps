var gulp = require("gulp");
var ts = require("gulp-typescript");
var rename = require("gulp-rename");
var clean = require("gulp-clean");

var tap = require("gulp-tap");
var small = require("small").gulp;
var rsync = require('gulp-rsync');
 
var tsProject = ts.createProject('tsconfig.json',  { emitReferencedFiles: true });

gulp.task("default", ["clean", "shims", "markdown", "compile" ] );

gulp.task("clean", function () {
    var tsResult = gulp.src("dist/**/*", { read : false })
        .pipe(clean());
});

gulp.task("compile", ["shims"], function () {
    var tsResult = gulp.src("src/**/*.ts")
        .pipe(tsProject());

    return tsResult.js
        .pipe(tap(function (file, t) {
            var localPath = file.path.substring(file.base.length, file.path.length - file.basename.length);
            var segments = localPath == "" ? [] : localPath.split("/");

            file.contents = Buffer.from(file.contents.toString().replace(/(require\s*\(\s*["']\s*)(\.\/|\.\.\/)*([^'"]+)(\s*["'][^)]*\))/g, function(match, p1, p2, p3, p4, offset, all) {
                if (p2) {
                    let upDirLevels = (p2.match(/\.\.\//g) || []).length;
                    if (upDirLevels) {
                        segments = segments.splice(-1 * upDirLevels, upDirLevels)
                    }
                }
                return p1 + "./" + segments.join("_")  + p3.replace(/([^/])\//g,"$1_") + p4;

            }));
        }))
        .pipe(rename(function (path) {
            if (path.dirname == ".")
                return;
            path.basename = path.dirname.replace('/','_') + "_" + path.basename;
            path.dirname="";
        }))
        .pipe(gulp.dest("dist"));
});

gulp.task("shims", () => {
        return gulp.src(['src/shims.js'])
            .pipe(small("shims.js", {
                externalResolve: ['node_modules']
            }))
            .pipe(gulp.dest("dist"));
});

gulp.task("markdown", () => {
        return gulp.src(['src/*.md'])
            .pipe(gulp.dest("dist"));
});

gulp.task("deploy", ["compile", "markdown" ] , function() {
  return gulp.src('dist/**/*.*')
    .pipe(sync(true));
});

gulp.task("redeploy", ["compile", "markdown" ] , function() {
  return gulp.src('dist/**/*.*')
    .pipe(sync(false));
});

gulp.task('watch', ['clean', 'deploy'], function() {
    gulp.watch('src/**/*.ts', ['redeploy']);
    gulp.watch('src/**/*.md', ['redeploy']);
});


function sync(destructive) 
{
    return rsync({
      root: 'dist/',
      relative: false,
      shell : "rsh",
      recursive: destructive,
      clean: destructive,
      destination: "/Users/graemec/Library/Application Support/Screeps/scripts/13_76_143_93___21025/default",
      destinationmain: "/Users/graemec/Library/Application Support/Screeps/scripts/screeps.com/default/",
      destination1: "/Users/graemec/Library/Application\ Support/Screeps/scripts/127_0_0_1___21025/default/"
    })
}

