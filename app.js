const express = require('express'),
app = express(),
port = process.env.PORT || 4000,
mongoose = require('mongoose');

bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/test1');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var indexRouter = require('./api/routes/battleRoutes');
app.use('/', indexRouter);

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.test);
});

app.listen(port);
console.log(`listing port ${port}`)
