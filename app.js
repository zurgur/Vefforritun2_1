const express = require('express');
const path = require('path');
const fs = require('fs');
const marked = require('marked');

const app = express();

const hostname = '127.0.0.1';
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/',(req,res)=> {
  //res.send("Express your self!");
  res.render('index',{title: 'forsíða'});
});

app.get('/batman-ipsum', (req,res) => {
  var data = path.join(__dirname, 'articles'+req.url+'.md');
  var mark = fs.readFile(data, 'utf8', function(err, data) {
    if(err) {
      console.log(err);
    }
    var texti = marked(data.toString());
    res.render('index',{title: req.baseUrl, innihald: texti});
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
