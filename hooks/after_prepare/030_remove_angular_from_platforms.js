#!/usr/bin/env node

/**
 * After prepare, files are copied to the platforms/ios and platforms/android folders.
 * Since ionic already bundles angular we can remove angular files
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

deleteFolderRecursive(path.resolve(__dirname, '../../platforms/ios/www/lib/angular'));
deleteFolderRecursive(path.resolve(__dirname, '../../platforms/ios/www/lib/angular-animate'));
deleteFolderRecursive(path.resolve(__dirname, '../../platforms/ios/www/lib/angular-sanitize'));
deleteFolderRecursive(path.resolve(__dirname, '../../platforms/ios/www/lib/angular-ui-router'));

deleteFolderRecursive(path.resolve(__dirname, '../../platforms/android/assets/www/lib/angular'));
deleteFolderRecursive(path.resolve(__dirname, '../../platforms/android/assets/www/lib/angular-animate'));
deleteFolderRecursive(path.resolve(__dirname, '../../platforms/android/assets/www/lib/angular-sanitize'));
deleteFolderRecursive(path.resolve(__dirname, '../../platforms/android/assets/www/lib/angular-ui-router'));
