const socket = io();
const secretNumberForm = document.getElementById('secret-number-form');
const guessForm = document.getElementById('guess-form');
const secretNumber = document.getElementById('secretNumber');
const guessNumber = document.getElementById('guessNumber');
const guessList = document.querySelector('.guess-list');

var overlay = document.querySelector('.overlay');
var winner = document.querySelector('.winner');
var center = document.querySelector('.center');
var playAgain = document.querySelector('.center button');
var waiting = document.querySelector('.waiting');
var headingNumber = document.querySelector('.heading-number');
var waitMsg = document.querySelector('.waitMsg');

// Force Disconnect User
socket.on('disconnectUser', function () {
	socket.disconnect();
	window.location.href = '/index.html';
	alert('2 Players Already Connected');
});

// Waiting Overlay
socket.on('wait', function () {
	overlay.style.display = 'flex';
	waiting.style.display = 'block';
});

var trial = function (event) {
	event.preventDefault();
	const num = secretNumber.value;
	if (num != '') {
		console.log(`SecretNumber: ${num}`);
		// Send Move To Server
		socket.emit('sendSecretNumber', { secretNumber: num });
		secretNumber.value = '';
		headingNumber.innerHTML = `Your number is ${num}`;
	}
};

// Get Player's Secret Number
socket.on('getSecretNumber', function () {
	overlay.style.display = 'none';
	waiting.style.display = 'none';
	console.log('getSecretNumber Called');
	secretNumberForm.addEventListener('submit', trial);
});

// Get Player's Guess
socket.on('getGuessNumber', function (data) {
	socket.on('gameOver', (data) => {
		overlay.style.display = 'flex';
		center.style.display = 'block';
		winner.innerHTML = `Player ${data.winner} Wins`;
		secretNumberForm.removeEventListener('submit', trial);
		guessForm.removeEventListener('submit', trial1);
	});
	secretNumberForm.style.display = 'none';
	guessForm.style.display = 'flex';
	headingNumber.style.display = 'flex';
	console.log('getGuess Called');
	var trial1 = function (event) {
		event.preventDefault();
		const guess = guessNumber.value;
		if (guess != '') {
			console.log(`Guess: ${guess}`);
			// Send Move To Server
			socket.emit('sendGuessNumber', {
				guessNumber: guess,
				secretNumber: data.secretNumber,
			});
			guessNumber.value = '';
		}
	};
	guessForm.addEventListener('submit', trial1);
});

socket.on('displayResults', (data) => {
	const div = document.createElement('div');
	div.classList.add('guess');
	div.innerHTML = `${data.guess} ${data.answer[0]} BULL ${data.answer[1]} COW`;
	guessList.appendChild(div);
	socket.emit('getGuessNumber', { secretNumber: data.secretNumber });
});

socket.on('deleteResults', () => {
	let len = guessList.childNodes.length;
	for (let i = len - 1; i >= 0; i--) {
		guessList.removeChild(guessList.childNodes[i]);
	}
});

playAgain.addEventListener('click', function (e) {
	e.preventDefault();
	overlay.style.display = 'none';
	center.style.display = 'none';
	socket.emit('playAgain');
});

socket.on('displaySecret', () => {
	secretNumberForm.style.display = 'flex';
	headingNumber.style.display = 'none';
	guessForm.style.display = 'none';
});

socket.on('removePlayAgain', () => {
	overlay.style.display = 'none';
	center.style.display = 'none';
});

socket.on('waitMsg', () => {
	secretNumberForm.style.display = 'none';
	waitMsg.style.display = 'flex';
	waitMsg.innerHTML = 'Waiting for player 2 to enter secret code';
});

socket.on('dltWaitMsg', () => {
	waitMsg.style.display = 'none';
});
