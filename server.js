var express = require('express')
  , app = express.createServer()
  , io = require('socket.io').listen(app);

app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});

app.listen(8080);

var article = {
  'id':1,
  'name':'Hot news from server',
  'meta':{
    'lastUpdate':(new Date()).toString()
  }
};

io.sockets.on('connection', function (socket) {
  /*socket.emit('news', { hello:'world' });
   socket.on('my other event', function (data) {
   console.log(data);
   });*/

  setInterval(function () {
    socket.emit('articleUpdate', [{ "replace": "/meta/lastUpdate", "value": (new Date()).toString() }]);
  }, 1000);

  socket.emit('article', article);
});

