const express = require('express');
const app = express();


const rota_user =  require('./routes/user');
const rota_agenda = require('./routes/consultas');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use('/user', rota_user);
app.use('/agendar', rota_agenda);


//Tratamento quando não encontra a rota, retorna mensagem de erro
app.use((req, res, next) => {
    const erro = new Error('Rota não encontrada');
    erro.status = 404
    next(erro)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
})

module.exports = app