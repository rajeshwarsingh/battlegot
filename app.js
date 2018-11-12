
const config = require('./config')
const express = require('express'),
app = express(),
port = process.env.PORT || config.PORT,
mongoose = require('mongoose');

bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect(config.MONGOURL);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var indexRouter = require('./api/routes/battleRoutes');
app.use('/', indexRouter);

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.test);
});

app.listen(port);
console.log(`listing port ${port}`)
