const express = require('express');
const rota = express.Router();
const Login = require('../middleware/login')
const mysql = require('../conection/bd').connection;

rota.get('/:id', (req, res) => {
    mysql.getConnection((error, cnx) => {
        if(error){ res.status(500).send({ error: error})}

        cnx.query(
            'Select * from agenda Where id_user = ?',
            [req.params.id], 

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

rota.post('/local_b', Login, (req, res) => {
    mysql.getConnection((error, cnx) =>{
        if(error){ res.status(500).send({ error: error})} 

        cnx.query(
            'Insert into agenda(nome,idade,raca,tipo,concas,sexo,data,hora,id_user,id_endereco) values(?,?,?,?,?,?,?,?,?,?)',
            [req.body.nome, req.body.idade, req.body.raca, req.body.tipo, req.body.concas, req.body.sexo, req.body.data, req.body.hora, req.body.id_user, 2],

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

rota.post('/local_a', Login, (req, res) => {
    mysql.getConnection((err, cnx) => {
        if(err){res.status(500).send({error: err})}

        cnx.query(
            'Insert into agenda(nome,idade,raca,tipo,concas,sexo,data,hora,id_user,id_endereco) values(?,?,?,?,?,?,?,?,?,?)',
            [req.body.nome, req.body.idade, req.body.raca, req.body.tipo, req.body.concas, req.body.sexo, req.body.data, req.body.hora, req.body.id_user, 1],

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

rota.delete('/delete', Login, (req, res) => {
    mysql.getConnection((err, cnx) =>{
        if(err){res.status(500).send({error: err})}

        cnx.query(
            'Delete from agenda where id_agenda = ?',
            [req.body.id],

            (err, results, field) => {
                cnx.release();

                if(err){res.status(500).send({error: err})}

                res.send({mensagem: "Agendamento Deletado"})
            }
        )
    })
})


module.exports = rota;