const express = require('express');
const fs = require('fs');
const util = require('util');
const path = require('path');
const marked = require('marked');
const matter = require('gray-matter');
const articles = express.Router();
const readFileAsync = util.promisify(fs.readFile);
const readDirAsync = util.promisify(fs.readdir);
const encoding = 'utf8';
const input = path.join(__dirname,'articles');
// þetta er fyrir mesta shit mix sem ég hef
// reyndi að laga á date formatið og það hellst milli refessha
var dateLagad = false;

async function getAllFilesInDir(file) {
  let data = await readDirAsync(file);
  return data;
}

async function getContentOfFiles(content) {
  let data = [];
  conLength = Object.keys(content).length;
  for(var i = 0; i< conLength; i++){
    var pthur = path.join(__dirname,'articles/' + content[i]);
    try{
      let stuff = await readFileAsync(pthur);
      let b = matter(stuff);
      console.log(b);
      data.push(b);
      b = null;
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
    var data = await getAllFilesInDir(input);
    var stuff = await getContentOfFiles(data);
    var boi = await getMarckDown(stuff);
    /**
     * hér er svo skíta mixið :( 
     * en það virkar :)
     */
    if(!dateLagad){
        for(var i = 0; i<stuff.length;i++) {
        var trueData = await formatDate(new Date(stuff[i].data.date));
        stuff[i].data.date= trueData.toString();
      }
    }
    dateLagad = true;
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

async function formatDate(date) {
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  if(day.value<10){
    day='0'+day;
  } 
  if(month.value<10){
    day='0'+day;
  } 
  var s = day + '.' + month + '.' + year
  return s;
}
module.exports = articles;