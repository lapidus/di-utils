var svg2png  = require('svg2png'),
  express    = require('express'),
  app        = express(),
  bodyParser = require('body-parser'),
  server, allowCrossDomain;

allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

app.use(bodyParser.json());
app.use(allowCrossDomain);

server = app.listen(3333, function () {
  console.log('Export API listening at http://%s:%s', server.address().address, server.address().port);
});


app.post('/export', function (req, res) {
    var filename = makeID(8),
      dest = __dirname + '/charts/' + filename + '.' + req.body.format;

    svg2png(req.body.content, dest, 2, function (err) {
      if (err) {
        res.status(500).send(err);
        console.error(err);
        return;
      }
      console.log("Export success");
      res.status(201).send('charts/' + filename + '.' + req.body.format);
    });
});


app.get('/charts/:file', function (req, res) {
  res.sendFile(__dirname + '/charts/' + req.params.file);
});


function makeID (length) {
    var id = '',
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for(var i=0; i < length; i++)
        id += chars.charAt(Math.floor(Math.random() * chars.length));

    return id;
}


