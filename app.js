const express = require('express');
const fs = require('fs');
const path = require('path');
const util = require('util');
const articles = require('./articles');
const app = express();
const input = path.join(__dirname,'articles');

const hostname = '127.0.0.1';
const port = 3000;
var greinar = [];

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/', articles);
  
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
