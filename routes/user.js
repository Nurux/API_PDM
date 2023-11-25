const express = require('express');
const rota = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('../conection/bd').connection;

rota.post('/cadastro', (req, res) => {
    mysql.getConnection((err, cnx) => {
        if(err){
            return res.status(500).send({
                error: err
            })
        }

        cnx.query('Select * from usuario Where email = ?', req.body.email, (err, result) => {
            if(err){ return res.status(500).send({ erro: err})}

            if(result.lenght > 0){
                res.status(409).send({ mensagem: 'Usuário já cadastrado'})
            }else {
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                    if(errBcrypt){ return res.status(500).send({ erro: errBcrypt })}

                    cnx.query(
                        'Insert into usuario(email, senha, nome, tell) values(?, ?, ?, ?)',
                        [req.body.email, hash, req.body.nome, req.body.tell],

                        (error, resultado, field) => {
                            cnx.release()

                            if(error){ return res.status(500).send({ error: error, response: null})}

                            const response = {
                                mensagem: 'Usuário cadastrado com sucesso!',
                                id_usuario: resultado.insertId,
                                nome: req.body.nome,
                                email: req.body.email
                            }

                            res.status(201).send(response)
                        }
                    )
                })
            }
        })
    })
})


rota.post('/login', (req, res) =>{
    mysql.getConnection((err, cnx) => {
        if(err){ return res.status(500).send({ error: err }) }

        const query = 'Select * From usuario Where email = ?';

        cnx.query(query,[req.body.email], (err, results) => {
            cnx.release();

            if(err){
                return res.status(500).send({ error: err})
            }

            if(results.length < 1){
                return res.status(401).send({ mensagem: 'falha na autenticação'})
            }

            bcrypt.compare(req.body.senha, results[0].senha, (err, result) =>{
                if(err){
                    return res.status(401).send({mensagem: 'Falha na autenticação'})
                }

                if(result){
                    const token = jwt.sign({
                        id_usuario: results[0].id_user,
                        email: results[0].email
                    }, 'segredo',{
                        expiresIn: "1 day"
                    })

                    const response = {
                        mensagem: 'Autenticado com sucesso',
                        id_usuario: results[0].id_user,
                        email: results[0].email,
                        telefone: results[0].tell,
                        token: token
                    }

                    return res.status(200).send(response)
                }

                return res.status(401).send({mensagem: 'Falha na autenticação'})
            })
        })
        
    })
})

rota.get('/', (req, res) => {
    mysql.getConnection((err, cnx) => {
        if(err){
            return res.status(500).send({
                error: err
            })
        }
                    cnx.query(
                        'Select * from usuario',

                        (error, resultado, field) => {
                            cnx.release()

                            if(error){ return res.status(500).send({ error: error, response: null})}

                            const response = {
                                mensagem: 'Usuários cadastrados!',
                                user: resultado
                            }

                            res.status(200).send(response)
                        }
                    )
                })
            }
        })
    })
})


module.exports = rota;
