const express = require('express');
const rota = express.Router();
const Login = require('../middleware/login')
const mysql = require('../conection/bd').connection;

rota.get('/', (req, res) => {
    mysql.getConnection((error, cnx) => {
        if(error){ res.status(500).send({ error: error})}

        cnx.query(
            'Select * from agenda Where id_user = ?',
            [req.body.id], 

            (err, results, fields) =>{
                cnx.release();

                if(err){res.status(500).send({error: err})}

                const response = {
                    mensagem: 'Agendamentos',
                    agenda: results.map(cont => {
                        return {
                            id_agenda: cont.id_agenda,
                            nome: cont.nome,
                            data: cont.data,
                            hora: cont.hora,
                            servico: cont.concas
                        }
                    })
                }

                res.status(201).send(response)
            }
        )
    })
})

rota.post('/', Login, (req, res) => {
    mysql.getConnection((error, cnx) =>{
        if(error){ res.status(500).send({ error: error})} 

        cnx.query(
            'Insert into agenda(nome,idade,raca,tipo,concas,sexo,data,hora,id_user) values(?,?,?,?,?,?,?,?,?)',
            [req.body.nome, req.body.idade, req.body.raca, req.body.tipo, req.body.concas, req.body.sexo, req.body.data, req.body.hora, req.body.id_user],

            (err, results, fields) => {
                cnx.release();

                if(err){ res.status(500).send({ error: err})} 

                res.status(201).send({
                    mensagem: 'Agendamento feito com sucesso!',
                    id_agenda: results.insertId
                })
            }
        )
    })
})


module.exports = rota;