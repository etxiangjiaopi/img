var gulp = require('gulp');
var cmdPack = require('gulp-cmd-pack');
var uglify = require('gulp-uglify');

gulp.task('default', function () {
    gulp.src('js/main.js') //main文件
        .pipe(cmdPack({
            mainId: "js/main", //初始化模块的id
            base: "./" //base路径
        }))
        //.pipe(uglify())
        .pipe(gulp.dest('dest/'));//输出到目录
});