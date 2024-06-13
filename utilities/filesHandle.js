const mime = require('./mime');
const fs = require('fs');

module.exports = {
    "staticFile": staticFile,
    "readDirPromise": readDirPromise,
    "readFilePromise": readFilePromise,
}

function staticFile(res, filePath, ext) {
    res.setHeader("Content-type", mime[ext]);
    fs.readFile('./public' + filePath, (error, data) => {
        if (error) {
            console.log(error)
            errorFunction(res);
        }

        res.end(data);
    });
}

function readDirPromise(path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });

    });
}

function readFilePromise(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}

function errorFunction(res) {
    res.statusCode = 404;
    res.end();
}