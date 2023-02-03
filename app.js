const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
let playedPower = false
let id = 0

const defaultMsg = {
    id: 0,
    username: 'Bot',
    message: 'Say hi'
}

let allChats = [
    defaultMsg
];


function freeChat(chat) {
    let len = chat.length
    if (len >= 13) {
        let excess = len - 12
        allChats = chat.slice(excess)
    }
}

function powerCommand(command) {
    let code = command.slice(0, 4)
    let task = command.slice(4)
    if (code === '#pc=' || code === '#PC=') {
        if (task === 'ac' || task === 'AC') { //#pc=ac means power command to all clear chats
            allChats = [defaultMsg]
            id = 0
            playedPower = true
        }
    }
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.get('/', (req, res) => {
    res.render('chat', { allChats })
})
app.get('/get-msg', (req, res) => {
    res.send({ allChats })
})
app.post('/', (req, res) => {
    const cmd = req.body.message
    powerCommand(cmd)
    if (playedPower === true) {
        playedPower = false
        res.send({ powerPlay: true })
    } else {
        const { username, message } = req.body;
        id++
        allChats.push({ id, username, message })
        freeChat(allChats)
        res.send({ msg: 'isSent' })
    }
})
app.listen(port, () => {
    console.log('LISTENING ON PORT:', port);
})
