const socket = io('http://localhost:5000')
const form = document.getElementById('form')
const message = document.getElementById("msg")

socket.on('msg', data => {
    console.log(data)
})

form.addEventListener('submit', () => {
    const msg = message.value
    socket.emit('send-msg', msg)
    msg.value = ''
})

