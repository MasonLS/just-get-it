#! /usr/bin/env node
require('babel-register');

var shell = require('shelljs');
var fs = require('fs');
var path = require('path');

var rootDir = shell.pwd().toString();


var moduleDirectory = {
  // named func or obj: path relative to rootDir
};

/*
1. Recursively collect all .js filePaths relative to rootDir
2. For each, require in, and map keys to their filePaths
*/

// Problem: imported modules import their own modules

var jsFilePaths = getAllJsFilePaths(rootDir);

jsFilePaths.forEach(filePath => {

  var exportsObj = require(filePath);
  console.log(exportsObj);

});


function getAllJsFilePaths(dirPath) {

  var dirContents = fs.readdirSync(dirPath);
  var jsFilePaths = [];
  var childDirPaths = [];

  dirContents.forEach(childName => {

    var childPath = path.join(dirPath, childName);
    var parsed = path.parse(childPath);

    if (parsed.ext === '.js') {
      jsFilePaths.push(childPath);
      return
    }

    var lstatObj = fs.lstatSync(childPath);

    if (lstatObj.isDirectory()) {
      childDirPaths.push(childPath);
    }

  });

  return childDirPaths.reduce((jsFilePaths, dirPath) => {
    return jsFilePaths.concat(getAllJsFilePaths(dirPath));
  }, jsFilePaths);

}
