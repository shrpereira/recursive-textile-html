var textile = require('textile-js');
var fs = require('fs');
var path = require('path');

if (process.argv.length == 2) {
    console.log('You must enter a directory or file path to continue');
    return;
}

if (process.argv.length > 3) {
    console.log('Enter just one argument to procced');
    return;
}

convertFile(process.argv[2]);

function convertFile(filePath) {

    fs.readdir(filePath, (err, files) => {

        if (err) {
            console.log('This is not a directory or a file path');
            return;
        }

        files.forEach((file, index) => {
            var localFilePath = path.join(filePath, file);

            fs.stat(localFilePath, (error, stat) => {
                if (err) {
                    console.log('The stats of this file or directory could not be retrieved. Path:' +
                        localFilePath + ' Error: ' + err);
                    return;
                }

                if (stat.isDirectory()) {
                    convertFile(localFilePath);
                } else if (stat.isFile()) {
                    fs.readFile(localFilePath, 'utf-8', (err, data) => {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        try {
                            var htmlData = textile(data);
                        } catch (err) {
                            console.log('Error converting the file content to HTML. Error: ' + err);
                            return;
                        }

                        htmlData = '<html><head><meta charset="utf-8"></head><body>' + htmlData + '</body></html>';

                        fs.writeFile(localFilePath, htmlData, 'utf-8', (err) => {
                            if (err) {
                                console.log('Error writting converted file to disk. Error: ' + err);
                            }
                            console.log("File converted successfully! Path: " + localFilePath);
                        });
                    });
                }
            });
        });
    });
}