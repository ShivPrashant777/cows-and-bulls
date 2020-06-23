const socket = io();
const secretNumberForm = document.getElementById('secret-number-form');
const guessForm = document.getElementById('guess-form');
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
	secretNumberForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const num = secretNumber.value;
		console.log(`SecretNumber: ${num}`);
		// Send Move To Server
		socket.emit('sendSecretNumber', { secretNumber: num });
		secretNumber.value = '';
	});
});

// Get Player's Guess
socket.on('getGuessNumber', function (data) {
	console.log('getGuess Called');
	guessForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const guess = guessNumber.value;
		console.log(`Guess: ${guess}`);
		// Send Move To Server
		socket.emit('sendGuessNumber', { guessNumber: guess, secretNumber: data.secretNumber});
		guessNumber.value = '';

	});
});

socket.on('firstGuess', (data) => {
	console.log("firstGuess Called")
	guessForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const guess = guessNumber.value;
		console.log(`Guess: ${guess}`);
		// Send Move To Server
		socket.emit('sendGuessNumber', { guessNumber: guess, secretNumber: data.secretNumber});
		guessNumber.value = '';
	});
})

socket.on('displayResults', (data) => {
	const div = document.createElement('div');
	div.classList.add('guess');
	div.innerHTML = `${data.guess} ${data.answer[0]} BULL ${data.answer[1]} COW`;
	guessList.appendChild(div);
	socket.emit('getGuessNumber', {secretNumber: data.secretNumber});
})
