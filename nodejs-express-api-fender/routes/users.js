'use strict'

var express = require('express');
var UserController= require('../controllers/user');

var router = express.Router();

const checkToken = (req, res, next) => {
    const header = req.headers['authorization'];
    if(typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];
        req.token = token;
        next();
    } else {
        //If header is undefined return Forbidden (403)
        res.sendStatus(403)
    }
}

//rutas

router.post('/login',UserController.login);
router.get('/auth',checkToken,UserController.auth);
router.get('/PokeData',UserController.PokeData);
router.get('/PokeDataId',UserController.PokeDataId);

module.exports = router;