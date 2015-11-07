#!/usr/bin/env node

/**
 * After prepare, files are copied to the platforms/ios and platforms/android folders.
 * We are not using moment src/locale/templates so we can remove them
 */
var fs = require('fs');
var path = require('path');

var deleteFolderRecursive = function(removePath) {
  if( fs.existsSync(removePath) ) {
    fs.readdirSync(removePath).forEach(function(file,index){
      var curPath = path.join(removePath, file);
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(removePath);
  }
};

deleteFolderRecursive(path.resolve(__dirname, '../../platforms/ios/www/lib/moment/src'));
deleteFolderRecursive(path.resolve(__dirname, '../../platforms/ios/www/lib/moment/locale'));
deleteFolderRecursive(path.resolve(__dirname, '../../platforms/ios/www/lib/moment/templates'));

deleteFolderRecursive(path.resolve(__dirname, '../../platforms/android/assets/www/lib/moment/src'));
deleteFolderRecursive(path.resolve(__dirname, '../../platforms/android/assets/www/lib/moment/locale'));
deleteFolderRecursive(path.resolve(__dirname, '../../platforms/android/assets/www/lib/moment/templates'));
