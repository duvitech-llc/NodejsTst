var e = require('express');
var sio = require('socket.io');
var http = require('http');
var SerialPort = require("serialport").SerialPort



var app = e();
var server = http.createServer(app);
var path = require('path');
var io = sio.listen(server);

app.use(e.static(__dirname + '/public'));
app.use('/bower_components', e.static(__dirname + '/bower_components'));

io.sockets.on('connection', function (socket) {
    socket.on('ping', function (msg) {
        socket.emit('pong', msg);
    });
});

app.get('/', function (req, res) {
    res.sendFile('sockets.html', { root: __dirname });
});


server.listen(3000);
var port = new SerialPort("com12", {
    baudrate: 57600,
    buffersize: 256   
});

port.on("open", function () {
    console.log('open');
    port.on('data', function (data) {
        console.log(data.toString());
        io.emit('packet', data.toString());
		
	
    });

    port.on('close', function () {
        console.log('close port');
    });
    
    port.on('error', function (err) {
        console.log('error received: ' + err);
    });
    
    port.write("\n", function (err, results) {
        console.log('err ' + err);
        console.log('results ' + results);
    });
});

