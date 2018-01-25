const express = require('express');
const path = require('path');
const fs = require('fs');
const marked = require('marked');
const matter = require('gray-matter');

const app = express();

const hostname = '127.0.0.1';
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/',(req,res)=> {
  //res.send("Express your self!");

  fs.readdir(path.join(__dirname ,"/articles"), (function(err, filenames) {
    if (err) {
      console.log(err);
      return;
    }
    var test = [];
    for(var i = 0; i<filenames.length;i++){
      if(filenames[i].endsWith('.md')){
        test.push(matter(filenames[i]));
      }
    } 
    res.render('index',{title: "homebace", content: test});
    
  }));
  //var test = readFiles(path.join(__dirname/articles','));
  
});

app.get('/content*.md', (req,res) => {
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
});

app.use(function notfound(req, res, next){
  res.status(404).send('síða fanst ekki');
});

app.use(function error(err, req, res, next){
  console.error(err);
  res.status(500).send('Villa kom upp');
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
