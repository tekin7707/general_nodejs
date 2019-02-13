const express = require('express');
const jwt = require('jwt-simple');
var User = require('../models/userModel');
var router = express.Router();

module.exports = { router };

var user = {
    router, checkAuthenticated: (req, res, next) => {
        if (req.header('authorization')) {
            try {
                token = req.header('authorization').split(' ')[1];
                var payload = jwt.decode(token, '12345');
                if (payload){
                    req._id = payload._id; 
                    next();
                }
                else res.send({ status: 401, message: 'invalid token' });
            } catch (error) {
                res.send({ status: 401, message: 'invalid token' });
            }
        }
        else res.send({ status: 401, message: 'No Autharization Header' });
    }
}

router.post('/register', (req, res) => {
    var userData = req.body;
    console.log(userData);
    var a = JSON.stringify(userData);
    var user = new User(userData);
    user.save((error, result) => {
        if (error) {
            console.log('Error post');
            console.log(error);
            return res.send({ status: 201, data: user, message: error });
        } else {
            console.log('Success post');
            console.log(result);
            return res.send({ status: 201, data: user, message: 'Created' });
        }
    });
});

router.delete('/delete', async (req, res) => {

    var userData = req.body;
    console.log(userData);

    var user = await User.find({ email: userData.email });
    console.log(user);

    User.remove({ _id: userData._id }, (error, result) => {
        if (error) {
            console.log(error);
            return res.sendStatus(500).send({ message: error });
        } else {
            console.log('Success delete');
            return res.sendStatus(200);
        }
    });
});

router.post('/add', async (req, res) => {
    var userData = req.body;
    var user = new User(userData);
    user.save((error, result) => {
        if (error) {
            console.log(error);
            return res.sendStatus(500).send({ message: error });
        } else {
            console.log('Success post');
            return res.sendStatus(201);
        }
    });
});

router.post('/update', (req, res) => {
    var userData = req.body;
    User.findById(userData._id, (error, data) => {
        if (error) {
            console.log(error);
            return res.send({ status: 401, data: null, message: 'Record not found' });
        }
        data.update({firstName:userData.firstName,lastName:userData.lastName},(error, result) => {
            if (error) {
                console.log(error);
                return res.send({ status: 401, data: null, message: error });
            } else {
                return res.send({ status: 200, data: data, message: 'Updated' });
            }
        });
    });
});


router.get('/get', async (req, res) => {
    var users = await User.find({});
    res.send(users);
});

router.post('/login', async (req, res) => {
    var userData = req.body;
    var user = new User(userData);
    User.findOne({ email: user.email, password: user.password }).then(x => {
        let r = x ? { status: 200, message: '', data: x } : { status: 403, message: 'Email or Password not match' };
        console.log(r);
        if (r.status == 200) {
            let payload = {_id:x._id};//token decode edince _id değerini almak için ekledik
            x.token = jwt.encode(payload, '12345');
            r.data = x;
            console.log(r);
        }
        return res.send(r);
    });
});

router.get('/getAll', user.checkAuthenticated, async (req, res) => {
    console.log('user: %s',req._id);
    var users = await User.find({});
    res.send(users);
});


