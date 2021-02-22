const { Socket } = require('dgram');

//Instanciando o Express
const app = require('express')();

//Criando um servidor HTTP
const httpServer = require("http").createServer(app);

//Instanciando o Socket.io e estabelecendo a conexão com servidor
const io = require('socket.io')(httpServer);

//definindo a rota principal
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/routes/index.html');
})

app.get('/variados', function (req, res) {
    res.sendFile(__dirname + '/routes/variados.html');
})

app.get('/esportes', function (req, res) {
    res.sendFile(__dirname + '/routes/esportes.html');
})

app.get('/adulto', function (req, res) {
    res.sendFile(__dirname + '/routes/adulto.html');
})

app.get('/programacao', function (req, res) {
    res.sendFile(__dirname + '/routes/programacao.html');
})

app.get('/amizades', function (req, res) {
    res.sendFile(__dirname + '/routes/amizades.html');
})

let messagesAdulto = [];
let messagesAmizades = [];
let messagesEsportes = [];
let messagesProgramacao = [];
let messagesVariados = [];


//operando as funções do socket.io
io.on('connection', socket => {

    //controlando a quantidade de usuários conectados simultaneamente
    console.log(io.sockets.server.engine.clientsCount);
    var usersOn = io.sockets.server.engine.clientsCount;
    socket.emit("users", usersOn);

    //vasculhando para tentar achar mensagens anteriores no DB
    socket.emit('messagesBeforeAdulto', messagesAdulto)
    socket.emit('messagesBeforeAmizades', messagesAmizades)
    socket.emit('messagesBeforeEsportes', messagesEsportes)
    socket.emit('messagesBeforeProgramacao', messagesProgramacao)
    socket.emit('messagesBeforeVariados', messagesVariados)


    //recebendo o nome e mensagem, colocando no DB e transmitindo para a cadeia de clientes interligada pelo mesmo servidor
    socket.on('sendAdulto', data => {
        messagesAdulto.push(data);
        socket.broadcast.emit('messagesGlobal', data)
    })

    socket.on('sendAmizades', data => {
        messagesAmizades.push(data);
        socket.broadcast.emit('messagesGlobal', data)
    })

    socket.on('sendEsportes', data => {
        messagesEsportes.push(data);
        socket.broadcast.emit('messagesGlobal', data)
    })

    socket.on('sendProgramacao', data => {
        messagesProgramacao.push(data);
        socket.broadcast.emit('messagesGlobal', data)
    })

    socket.on('sendVariados', data => {
        messagesVariados.push(data);
        socket.broadcast.emit('messagesGlobal', data)
    })
})

//abrindo a conexão padrao hehe
httpServer.listen(3000, (() => { console.log("Servidor Rodando!"); }))
