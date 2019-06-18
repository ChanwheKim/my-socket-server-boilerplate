const express = require('express');
const logger = require('morgan');
const index = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

require('./socket')(io);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', index);

app.use((err, req, res, next) => {
  res.status(err.state || 500);

  res.render('error', { message: err.message });
});

server.listen(process.env.PORT || 5000, () => console.log(`Hello!! Listening on port ${process.env.PORT || 5000}!`));
