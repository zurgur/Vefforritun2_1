const express = require('express');
const fs = require('fs');
const util = require('util');
const path = require('path');
const marked = require('marked');
const matter = require('gray-matter');
const articles = express.Router();
const readFileAsync = util.promisify(fs.readFile);
const readDirAsync = util.promisify(fs.readdir);
const input = path.join(__dirname,'articles');
// þetta er fyrir mesta shit mix sem ég hef
// reyndi að laga á date formatið og það hellst milli refessha
let dateLagad = false;

async function getAllFilesInDir(file) {
    let data = await readDirAsync(file);
    return data;
}

async function getContentOfFiles(content) {
    let data = [];
    const conLength = Object.keys(content).length;
    for(let i = 0; i< conLength; i++){
        let pthur = path.join(__dirname,'articles/' + content[i]);
        try{
            let stuff = await readFileAsync(pthur);
            let b = matter(stuff);
            data.push(b);
            b = null;
        }catch(err){
            console.error(err+ '2');
        }
    }
    return data;
}
async function getMarckDown(content){
    const conLength = Object.keys(content).length;
    let arr = [];
    for(let i = 0;i<conLength;i++){
        let stuff = marked(content[i].content);
        arr.push(stuff);
    }
    return arr;
}

async function main(cb) {
    try{
        let data = await getAllFilesInDir(input);
        let stuff = await getContentOfFiles(data);
        let boi = await getMarckDown(stuff);
        /**
     * hér er svo skíta mixið :( 
     * en það virkar :)
     */
        if(!dateLagad){
            for(let i = 0; i<stuff.length;i++) {
                let trueData = await formatDate(new Date(stuff[i].data.date));
                stuff[i].data.date= trueData.toString();
            }
        }
        dateLagad = true;
        cb(data,stuff,boi);        
    }catch(err){
        console.error(err + '1');
    }
}

articles.get('/',(req,res)=> {
    main((a,b) => {
    
        b.sort((a,b) => { 
            return new Date(b.data.date) - new Date(a.data.date);
        });
    
        res.render('index', {title: 'Greina Safnið',content: b});
    });
  
});


articles.use(function notfound(req, res){
    let url = req.url.substring(1);
    main((a,b,c) => {
        let stadur;
        for(let i = 0; i<b.length;i++){
            if(b[i].data.slug.toString() === url.toString()){
                stadur = i;
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
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if(day.value<10){
        day='0'+day;
    }  
    if(month.value<10){
        day='0'+day;
    } 
    let s = day + '.' + month + '.' + year;
    return s;
}
module.exports = articles;