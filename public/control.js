let userName
const xxnamexx = localStorage.getItem('XXnameXX')
if (xxnamexx) {
    userName = xxnamexx;
} else {
    userName = prompt('Create Your Chat name: ') || 'Guest'
    localStorage.setItem('XXnameXX', userName)
}
let user = document.querySelector('#user')
let sendBtn = document.querySelector('#send-btn')
let message = document.querySelector('#message')
let chatUl = document.querySelector('#chat-ul')
let data = {}
let allChats = [{id:0}]
let terminate = false;
user.textContent = userName

getMsg(true)

function renderChat(nC,initialGetReq) {
    let changes = nC[nC.length - 1].id - allChats[allChats.length - 1].id
    if(changes !== 0){
        chatUl.innerHTML = ''
        allChats = nC
        for (let chat of allChats) {
            let replacement = `<li class="chat-li"><b>${chat.username}: </b>${chat.message}</li><br>`
            chatUl.innerHTML += replacement
        }
    }else if(initialGetReq===true){
        allChats = nC
        for (let chat of allChats) {
            let replacement = `<li class="chat-li"><b>${chat.username}: </b>${chat.message}</li><br>`
            chatUl.innerHTML += replacement
        }
    }
}

function sendMsg() {
    changeName(message.value)
    if (terminate === true) {
        message.value = ''
        terminate = false
        return
    }
    data = {
        username: userName,
        message: message.value
    }
    message.value = ""
    if (data.message) {
        let xhr = new XMLHttpRequest()
        xhr.open('post', '/', true)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
            }
        }
    }
}

function getMsg(initialGetReq) {
    let xhr = new XMLHttpRequest()
    xhr.open('get', '/get-msg', true)
    xhr.send()
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let newChats = JSON.parse(xhr.response).allChats
            if(initialGetReq===true){
                renderChat(newChats, true)
            }else{
                renderChat(newChats)
            }   
        }
    }
}

function refresh() {
    setInterval(() => {
        getMsg()
    }, 100);
}

function changeName(command) {
    let code = command.slice(0, 4)
    if (code === '#cn=' || code === '#CN=') {
        let newName = command.slice(4)
        localStorage.setItem('XXnameXX', newName)
        userName = newName
        user.textContent = userName
        terminate = true
    }
}

message.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault()
        sendMsg()
    }
})

sendBtn.addEventListener('click', ()=>{
    message.focus()
    sendMsg()
})

refresh()






