const socket = io();
const secretNumberForm = document.getElementById('secret-number-form');
const guessForm = document.getElementById('guess-form');
const secretNumber = document.getElementById('secretNumber');
const guessNumber = document.getElementById('guessNumber');
const guessList = document.querySelector('.guess-list');
const guessContainer = document.querySelector('.guess-container');

var overlay = document.querySelector('.overlay');
var winner = document.querySelector('.winner');
var center = document.querySelector('.center');
var playAgain = document.querySelector('.center button');
var waiting = document.querySelector('.waiting');

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

// Get Player's Secret Number
socket.on('getSecretNumber', function () {
	overlay.style.display = 'none';
	waiting.style.display = 'none';
	console.log('getSecretNumber Called');
	secretNumberForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const num = secretNumber.value;
		if(num != ''){
			console.log(`SecretNumber: ${num}`);
			// Send Move To Server
			socket.emit('sendSecretNumber', { secretNumber: num });
			secretNumber.value = '';
		}
	});
});

// Get Player's Guess
socket.on('getGuessNumber', function (data) {
	secretNumberForm.style.display = 'none';
	guessContainer.style.display = 'block';
	console.log('getGuess Called');
	guessForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const guess = guessNumber.value;
		if(guess != ''){
			console.log(`Guess: ${guess}`);
			// Send Move To Server
			socket.emit('sendGuessNumber', {
				guessNumber: guess,
				secretNumber: data.secretNumber,
			});
			guessNumber.value = '';
		}
	});
});

socket.on('displayResults', (data) => {
	const div = document.createElement('div');
	div.classList.add('guess');
	div.innerHTML = `${data.guess} ${data.answer[0]} BULL ${data.answer[1]} COW`;
	guessList.appendChild(div);
	socket.emit('getGuessNumber', { secretNumber: data.secretNumber });
});

socket.on('deleteResults', () => {
	let len = guessList.childNodes.length
	for(let i = len - 1; i >= 0 ; i--){
		guessList.removeChild(guessList.childNodes[i])
	}
})

socket.on('gameOver', (data) => {
	overlay.style.display = 'flex';
	center.style.display = 'block';
	winner.innerHTML = `Player ${data.winner} Wins`;
});

playAgain.addEventListener('click', function (e) {
	e.preventDefault();
	overlay.style.display = 'none';
	center.style.display = 'none';
	socket.emit('playAgain');
});

socket.on('displaySecret', () => {
	secretNumberForm.style.display = 'block';
	guessContainer.style.display = 'none';
})

socket.on('removePlayAgain', () => {
	overlay.style.display = 'none';
	center.style.display = 'none';
})