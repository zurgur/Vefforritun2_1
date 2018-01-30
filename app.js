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
  


app.use(function error(err, req, res, next){
  console.error(err);
  res.status(500).send('Villa kom upp');
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

