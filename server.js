const path = require('path');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { players, joinPlayer, removePlayer } = require('./data/players');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

io.on('connect', (socket) => {
	const player = joinPlayer(socket.id, 1);
	console.log(players);

	// Get Player To Enter Number
	socket.emit('getMove');
	socket.on('sendMove', function (data) {
		console.log(data.move);
		player.move = data.move;
		console.log(players);
	});

	// Disconnect
	socket.on('disconnect', function () {
		removePlayer(socket.id);
		console.log('Player left');
	});
});

http.listen('5000', () => {
	console.log('Server Started at port 5000');
});
