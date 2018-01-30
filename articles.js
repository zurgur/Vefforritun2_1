const express = require('express');
const fs = require('fs');
const util = require('util');
const path = require('path');
const MarkdownIt = require('markdown-it');
const marked = require('marked');
const matter = require('gray-matter');
const articles = express.Router();
const readFileAsync = util.promisify(fs.readFile);
const readDirAsync = util.promisify(fs.readdir);

const encoding = 'utf8';
const input = path.join(__dirname,'articles');

async function getAllFilesInDir(file) {
  const data = await readDirAsync(file);
  return data;
}

async function getContentOfFiles(content) {
  data = [];
  conLength = Object.keys(content).length;
  const md = new MarkdownIt();

  for(var i = 0; i< conLength; i++){
    var pthur = path.join(__dirname,'articles/' + content[i]);
    try{
      stuff = await readFileAsync(pthur);
      data.push(matter(stuff));
    }catch(err){
      console.log(err+ '2');
    }
  }
  return data;
}
async function getMarckDown(content){
  conLength = Object.keys(content).length;
  var arr = [];
  for(var i = 0;i<conLength;i++){
    var stuff = marked(content[i].content);
    arr.push(stuff);
  }
  return arr;
}

async function main() {
  try{
    const data = await getAllFilesInDir(input);
    const stuff = await getContentOfFiles(data);
    const boi = await getMarckDown(stuff);
  }catch(err){
    console.log(err + '1');
  }
  return boi;
  
}

articles.get('/',(req,res)=> {
  var c = main();
  res.render('index', {title: "test",content: c});
});

module.exports = articles;