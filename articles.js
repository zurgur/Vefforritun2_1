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
    res.render('index', {title: "test",content: b});
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
      res.render('content', {title: req.baseUrl, innihald: c[stadur]});
    }
    else{
      res.status(404).send('síða fanst ekki');
    }
  });
});

/*app.get('/content*.md', (req,res) => {
  var url = req.url.substring(8);
  console.log(url);
  var data = path.join(__dirname, 'articles'+url);
  var mark = fs.readFile(data, 'utf8', function(err, data) {
    if(err) {
      console.log(err);
    }
    var texti = matter(data);
    var texti = marked(texti.content.toString());
    res.render('content',{title: req.baseUrl, innihald: texti});
});
});*/

module.exports = articles;