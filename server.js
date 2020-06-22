const path = require('path');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const number = 1234

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

http.listen('5000', () => {
	console.log('Server Started at port 5000');
});

io.on('connection', socket => {
	socket.emit('msg', 'hellos')
	socket.on('send-msg', msg => {
		if(msg == number){
			console.log('correct')
		}
		else{
			console.log('wrong')
		}
	})
})