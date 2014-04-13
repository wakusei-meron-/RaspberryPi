var net = require('net');
var readline = require('readline');

//自作モジュール
var child = require('./exec.js');

var server = net.createServer();
//TCPクライアント接続の最大数
server.maxConnections = 3;

function Client(socket){
    this.socket = socket;
}

Client.prototype.writeData = function(d){

    var socket = this.socket;
    if(socket.writable){
	var key = socket.remoteAddress + ':' + socket.remotePort;
	process.stdout.write('[' + key + '] - ' + d);
	socket.write('[R] ' + d);
    }
};

var clients = {};

//クライアント接続時のイベント
//接続開始のログ
server.on('connection', function(socket) {
    var status = server.connections + '/' + server.maxConnections;
    var key    = socket.remoteAddress + ':' + socket.remotePort;
    console.log('Connection Start(' + status + ') - ' + key);
    clients[key] = new Client(socket);
})

//クライアント接続時のイベント(2)
// socketに対して,dataイベントリスナを登録する
server.on('connection', function(socket){
    var data = '';
    var newline = /\n/;//macの改行コード
    socket.on('data', function(chunk){
	//改行コードが送られてくるまで貯めておく(windows telnet))
	data += chunk.toString();
	var key = socket.remoteAddress + ':' + socket.remotePort;
	if(newline.test(data)){
	    clients[key].writeData(data);

	    data = data.replace(/[\s]/g,"");//空白除去
	    switch(data){
	    case "son":
		child.switchOn(data);
		break;
	    case "soff":
		child.switchOff(data);
		break;		
	    };
	    data = '';
	    
	}
    });
});

//クライアント接続時のイベント(3)
server.on('connection', function(socket){
    var key = socket.remoteAddress + ':' + socket.remotePort;
    //socketが切断(FIN))を要求してきた時
    socket.on('end', function(){
	var status = server.connections + '/' + server.maxConnections;
	console.log('Connection End(' + status + ') - ' + key);
	delete clients[key];
    });
});

//サーバソケットクローズ時のイベント
//server.close()後、全ての接続が終了した時にイベントが発生する
server.on('close', function(){
    console.log('Server Closed');
})

//サーバの開始と終了処理
server.listen(11111, '127.0.0.1', function(){
    var addr = server.address();
    console.log('Listening Start on Server - ' + addr.address + ':' + addr.port);
});

//Contorol-cでサーバソケットをクローズする
var rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', function(){
    //全てのソケットを終了する
    for(var i in clients){
	var socket = clients[i].socket;
	socket.end();
    }
    server.close();
    rl.close();
});
