var gulp = require('gulp');
var cmdPack = require('gulp-cmd-pack');
var uglify = require('gulp-uglify');

gulp.task('default', function () {
    gulp.src('js/main.js') //main�ļ�
        .pipe(cmdPack({
            mainId: "js/main", //��ʼ��ģ���id
            base: "./" //base·��
        }))
        //.pipe(uglify())
        .pipe(gulp.dest('dest/'));//�����Ŀ¼
});