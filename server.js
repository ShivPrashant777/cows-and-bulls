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
	opponent,
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
	// Create New Player
	const player = joinPlayer(socket.id, players.length + 1);
	console.log(players);
	console.log(players.length);

	//Get Room Name
	socket.emit('getRoomName');

	// Get Player To Enter SecretNumber
	// if (players.length === 2) {
	// 	socket.broadcast.to('game').emit('getSecretNumber');
	// 	socket.emit('wait');
	// }

	// Add secret nummber to player object
	socket.on('sendSecretNumber', function (data) {
		player.secretNumber = data.secretNumber;
		var opp = opponent(player)
		if (!opp.secretNumber) {
			socket.emit('waitMsg');
			socket.broadcast.to(data.room).emit('getSecretNumber', {room : data.room});
		} else {
			socket.broadcast.to(data.room).emit('dltWaitMsg');
			socket.emit('getGuessNumber', {
				secretNumber: opp.secretNumber,
				room : data.room,
			});
			socket.broadcast.to(data.room).emit('getGuessNumber', {
				secretNumber: data.secretNumber,
				room : data.room,
			});
		}
	});

	// Calculate Reuslt and Emit Result to client
	socket.on('sendGuessNumber', (data) => {
		const x = calculateBullsAndCows(data.secretNumber, data.guessNumber);
		if (x[0] == 4) {
			socket.emit('gameOver', { winner: 'You', room : data.room });
			socket.broadcast.to(data.room).emit('gameOver', { winner: 'Opponent', room : data.room });
			io.in(data.room).emit('removeGuess');
			io.in(data.room).emit('removeSecret');
		} else {
			socket.emit('displayResults', {
				guess: data.guessNumber,
				answer: x,
				secretNumber: data.secretNumber,
				room : data.room
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

	socket.on('playAgain', (data) => {
		socket.emit('removeAgainEvent')
		socket.to(data.room).emit('removeAgainEvent')
		player.secretNumber = null;
		var opp = opponent(player)
		opp.secretNumber = null;
		io.in(data.room).emit('displaySecret');
		socket.emit('wait');
		socket.broadcast.to(data.room).emit('removePlayAgain');
		io.in(data.room).emit('deleteResults');
		socket.broadcast.to(data.room).emit('getSecretNumber', {room : data.room});
	});

	socket.on('sendRoomName', (data) => {
		player.room = data.room
		let c = 0;
		for(let i = 0; i < players.length; i++){
			if(players[i].room == data.room){
				c++;
			}
		}
		if(c > 2){
			player.room = null;
			console.log('room full');
			socket.emit('roomAgain');
			socket.emit('getRoomName');
		}
		else if(c == 2){
			socket.join(data.room);
			socket.emit('dltRoomForm');
			socket.emit('wait')
			socket.broadcast.to(data.room).emit('getSecretNumber', {room : data.room});
		}
		else{
			socket.join(data.room);
			socket.emit('dltRoomForm');
			socket.emit('wait');
		}
	})
});

http.listen('5000', () => {
	console.log('Server Started at port 5000');
});
