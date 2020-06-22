const socket = io();
const secretNumberForm = document.getElementById('secret-number-form');
const guessesForm = document.getElementById('guesses-form');
const secretNumber = document.getElementById('secretNumber');
const guessNumber = document.getElementById('guessNumber');
const guessList = document.querySelector('.guess-list');

// Force Disconnect User
socket.on('disconnectUser', function () {
	socket.disconnect();
	window.location.href = '/index.html';
	alert('2 Players Already Connected');
});

// Get Player's Secret Number
socket.on('getSecretNumber', function () {
	console.log('getSecretNumber Called');
	secretNumberform.addEventListener('submit', (event) => {
		event.preventDefault();
		const num = secretNumber.value;
		console.log(`SecretNumber: ${num}`);

		// Send Move To Server
		socket.emit('sendsecretNumber', { secretNumber: num });
		secretNumber.value = '';
	});
});

// Get Player's Guess
socket.on('getGuessNumber', function () {
	console.log('getGuess Called');
	guessesForm.addEventListener('submit', (event) => {
		event.preventDefault();
		var num = guessNumber.value;
		console.log(`Guess: ${num}`);

		const div = document.createElement('div');
		div.classList.add('guess');
		div.innerHTML = `${num}`;

		// Send Move To Server
		socket.emit('sendguessNumber', { guessNumber: num });
		guessNumber.value = '';
	});
});
