'use strict'
var validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'secretkeyGM1234';
const User = require('../models/user');
var validator = require('validator');
const fs = require('fs');//file system lib
const path = require('path');//permite sacar la ruta de un archivo en el sistema de arhivos del servidor
const axios = require('axios');
const Redis = require('redis');
const DEFAULT_EXPIRATION_INTERVAL = 600
const redisClient = Redis.createClient();

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/profile-photos' });

exports.createUser = (req, res, next) => {
    const newUser = {
        email: req.body.email,
        usuario: req.body.usuario,
        password: req.body.password
    }
    User.create(newUser, (err, user) => {
        if (err) return res.status(500).send('Server error');
        const expiresIn = 24 * 60;
        const accessToken = jwt.sign({ id: user.id },
            SECRET_KEY, {
            expiresIn: expiresIn
        });

        res.send({ user });
    })
}; // end controller

var controllerUser = {
    login: (req, res) => {
        var params = req.body;
        //validar datos
        try {
            var validate_email = !validator.isEmpty(params.email);
            var validate_user = !validator.isEmpty(params.usuario);
            var validate_pass = !validator.isEmpty(params.password);
        } catch (error) {
            return res.status(404).send({
                status: 'Error',
                message: 'Faltan datos por enviar !!'
            });
        }
        if (validate_email && validate_user && validate_pass) {

            if (params.email == null || params.usuario == null || params.password == null) {
                return res.status(404).send({
                    status: 'Error',
                    message: 'Faltan datos por enviar !!!'
                });
            }
            User.findOne({ email: params.email }, (err, user) => {
                if (err) return res.status(500).send({
                    status: 'Error',
                    message: 'Error en el servidor!!'
                });
                if (!user) {//email no existe
                    res.status(409).send({ message: 'Somenthing is wrong' });
                } else {
                    const resultUsuario = user.usuario;
                    if (resultUsuario && resultUsuario == (params.usuario)) {
                        var passwordIsValid = bcrypt.compareSync(
                            params.password,
                            user.password
                        );
                        if (!passwordIsValid) {
                            return res.status(401).send({
                                accessToken: null,
                                message: "Invalid Password!"
                            });
                        } else {
                            const expiresIn = 60;
                            const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: expiresIn });
                            return res.status(200).send({
                                status: 'success',
                                user: { _id: user.id, email: user.email, usuario: user.usuario },
                                expiresIn,
                                accessToken
                            });
                        }
                    } else {
                        res.status(409).send({ //usuario incorrecto
                            status: 'Error',
                            message: 'Somenthing is wrong'
                        });
                    }
                }
            });
        }
    },
    auth: (req, res) => {
        jwt.verify(req.token, SECRET_KEY, (err, authorizedData) => {
            if (err) {
                return res.status(409).send({
                    status: 'Error',
                    message: 'Ocurrió un error'
                });
            } else {
                //Si el token fue correctamente verificado, podemos regresar los datos autorizados
                res.json({
                    message: 'Successfull log in',
                    authorizedData
                });
                console.log('SUCCESS: Connected to protected route');
            }
        });
    },
    PokeData: async (req, res) => {
        const PokeId = req.query.id
        const Pokes = await getOrSetCache(`pokemon?id=${PokeId}`, async () => {
            const { data } = await axios.get(
                "https://pokeapi.co/api/v2/pokemon/",
                { params: { PokeId } }
            )
            console.log(data)
            console.log("here")
            return data
        })
        res.json(Pokes)
    },
    PokeDataId: async(req, res) => {
        const PokeId = req.query.id
        const Pokes = await getOrSetCache(`pokemon?id=${PokeId}`, async () => {
            const { data } = await axios.get(
                `https://pokeapi.co/api/v2/pokemon/${req.params.id}`,
                { params: { PokeId } }
            )
            console.log(data)
            
            return data
        })
        res.json(Pokes)
    }
}
function getOrSetCache(key,cb){
    return (resolve,reject) => {
        redisClient.get(key, async (err, data) => {
            if (err) return reject(err)
            if (data!=null) return resolve(JSON.parse(data))
            const freshData = await cb()
            redisClient.setex(key, DEFAULT_EXPIRATION_INTERVAL,JSON.stringify(freshData))
            resolve(freshData)
        })
    }
}


module.exports = controllerUser;