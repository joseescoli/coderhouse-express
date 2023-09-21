const socket = io();

const username = document.getElementsByTagName('h1')[0].innerText

socket.on('user_logged', (user)=>{
        Toastify({
            text: `🟢 ${user} is logged in`,
            duration: 3000,
            gravity: 'top',
            position: 'right',
            stopOnFocus: true,
            // style: {
            //     background: "linear-gradient(to right, #00b09b, #96c93d)"
            // }
            // onClick: ()=>{}
        }).showToast();
    });

const message = document.getElementById('message');
const btn = document.getElementById('send');
const output = document.getElementById('output');
const actions = document.getElementById('actions');

btn.addEventListener('click', () =>{
    socket.emit('chat:message', {
        username,
        message: message.value
    });
    message.value = '';
});

socket.on('messages', (data) =>{
    actions.innerHTML = '';
    const chatRender = data.map( (msg) => {
        return `<p><strong>${msg.user}: ${msg.message}<strong></p>`
    }).join(' ')
    output.innerHTML = chatRender
});

message.addEventListener('keydown', ()=>{
    socket.emit('chat:typing', username);
});

message.addEventListener('keyup', ()=>{
    setTimeout(() => {
        socket.emit('chat:typing:stop');
    }, 500);
});

socket.on('chat:typing', (data) => {
    actions.innerHTML = `<p> ${data} is writting a message... </p>`
})

socket.on('chat:typing:stop', () => {
    setTimeout(() => {
        actions.innerHTML = '';
    }, 1000);
})