const socket = io();

let username = null;

if( !username ) {
        Swal.fire({
            title: '¡Welcome to chat!',
            text: 'Insert your username here',
            input: 'text',
            inputValidator: (value)=>{
                if(!value){
                    return 'Your username is required'
                }
            }
        }).then((input)=>{
            username = input.value;
        });
        socket.emit('newUser', username)
}

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

socket.on('newUser', (username)=>{
    Toastify({
        text: `🟢 ${username} is logged in`,
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