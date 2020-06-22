const path = require('path');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const {
	players,
	joinPlayer,
	removePlayer,
	findRemainingPlayer,
} = require('./data/players');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/game', (req, res) => {
	res.sendFile(__dirname + '/public/game.html');
});

io.on('connect', (socket) => {
	// If 2 players in the room then disconnect
	if (players.length >= 2) {
		socket.emit('disconnectUser');
	} else {
		// Join Room
		socket.join('game');
		const player = joinPlayer(socket.id, players.length + 1);
		console.log(players);

		// Get Player To Enter Number
		socket.emit('getSecretNumber');
		socket.on('sendSecretNumber', function (data) {
			console.log(data.secretNumber);
			player.secretNumber = data.secretNumber;
			console.log(players);
		});
		if (player.secretNumber) {
			socket.emit('getGuessNumber');
			//		socket.emit('addToGuessList', { guess: data.guess });
		}
	}

	// Disconnect
	socket.on('disconnect', function () {
		removePlayer(socket.id);
		console.log('Player left');
		if (players.length === 1) {
			var leftPlayer = findRemainingPlayer();
			leftPlayer.playerNumber = 1;
			leftPlayer.secretNumber = null;
			console.log('Waiting for Player 2');
		}
	});
});

http.listen('5000', () => {
	console.log('Server Started at port 5000');
});
