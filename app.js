const express = require('express');
const path = require('path');
const articles = require('./articles');
const app = express();

const hostname = '127.0.0.1';
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/img',express.static(path.join(__dirname,'articles/img')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/', articles);

app.use(function error(err, req, res){
    res.status(500).send('Villa kom upp');
});

app.listen(port, hostname, () => {
});

