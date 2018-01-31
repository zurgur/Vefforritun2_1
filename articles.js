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
      var b = matter(stuff);
      data.push(b);
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

async function main(cb) {
  try{
    const data = await getAllFilesInDir(input);
    const stuff = await getContentOfFiles(data);
    const boi = await getMarckDown(stuff);
    cb(data,stuff,boi);        
  }catch(err){
    console.log(err + '1');
  }
}

articles.get('/',(req,res)=> {
  main((a,b,c) => {
    
    b.sort((a,b) => { 
      return new Date(b.data.date) - new Date(a.data.date);
    });
    res.render('index', {title: "Greina Safnið",content: b});
  });
  
});


articles.use(function notfound(req, res, next){
  var url = req.url.substring(1);
  main((a,b,c) => {
    
    for(var i = 0; i<b.length;i++){
      if(b[i].data.slug.toString() === url.toString()){
        var stadur = i;
      } 
    }
    if(stadur != null){
      res.render('content', {title: b[stadur].data.title, innihald: c[stadur]});
    }
    else{
      res.status(404).render('error',{title: 'Fanst ekki', error: 'Ó nei efnið fanst ekki'});
    }
  });
});


module.exports = articles;