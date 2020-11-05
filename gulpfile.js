const { src, dest, series, parallel } = require('gulp');
const del = require('del');
const fs = require('fs');
const zip = require('gulp-zip');
const log = require('fancy-log');
var exec = require('child_process').exec;

const paths = {
    prod_build: 'prod-build',
    server_file_name: 'app.bundle.js',
    angular_src: 'angular-stock-app/dist/**/*',
    angular_dist: 'prod-build/angular-stock-app/dist',
    zipped_file_name: 'stock-app.zip'
};

function clean() {
    log('removing the old files in the directory')
    return del('prod-build/**', { force: true });
}

function createProdBuildFolder() {

    const dir = paths.prod_build;
    log(`Creating the folder if not exist  ${dir}`)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        log('📁  folder created:', dir);
    }

    return Promise.resolve('the value is ignored');
}

function buildAngularCodeTask(cb) {
    log('building Angular code into the directory')
    return exec('cd angular-stock-app && npm run build', function(err, stdout, stderr) {
        log(stdout);
        log(stderr);
        cb(err);
    })
}

function copyAngularCodeTask() {
    log('copying Angular code into the directory')
    return src(`${paths.angular_src}`)
        .pipe(dest(`${paths.angular_dist}`));
}

function copyNodeJSCodeTask() {
    log('building and copying server code into the directory')
    return src([
            'package.json',
            'app.js',
            'utils.js',
            'parser.js',
            '.api_tiingo',
            '.news_api'
        ], { dot: true })
        .pipe(dest(`${paths.prod_build}`))
}

exports.default = series(
    clean,
    createProdBuildFolder,
    buildAngularCodeTask,
    parallel(copyAngularCodeTask, copyNodeJSCodeTask)
);