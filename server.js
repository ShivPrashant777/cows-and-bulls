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
	reset,
} = require('./data/players');

const { calculateBullsAndCows } = require('./data/gameControl');

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
	}
	// Join Room
	socket.join('game');
	const player = joinPlayer(socket.id, players.length + 1);
	console.log(players);
	console.log(players.length);

	if (players.length < 2) {
		socket.emit('wait');
	}

	// Get Player To Enter SecretNumber
	if (players.length === 2) {
		socket.broadcast.to('game').emit('getSecretNumber');
		socket.emit('wait');
	}

	// Add secret nummber to player object
	socket.on('sendSecretNumber', function (data) {
		player.secretNumber = data.secretNumber;
		console.log(players);
		var opponent = players.filter((p) => p.id != player.id)[0];
		if (!opponent.secretNumber) {
			socket.broadcast.to('game').emit('getSecretNumber');
		} else {
			socket.emit('getGuessNumber', {
				secretNumber: opponent.secretNumber,
			});
			socket.broadcast.to('game').emit('getGuessNumber', {
				secretNumber: data.secretNumber,
			});
			socket.emit('displayGuess');
		}
	});

	// Calculate Reuslt and Emit Result to client
	socket.on('sendGuessNumber', (data) => {
		const x = calculateBullsAndCows(data.secretNumber, data.guessNumber);
		if (x[0] == 4) {
			io.emit('gameOver', { winner: player.playerNumber });
		} else {
			socket.emit('displayResults', {
				guess: data.guessNumber,
				answer: x,
				secretNumber: data.secretNumber,
			});
		}
	});

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
